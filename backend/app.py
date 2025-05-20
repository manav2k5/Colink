from flask import Flask, request, jsonify, Response, stream_with_context, redirect, session
from flask_cors import CORS
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import AuthorizedSession
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
import redis
import os
import json
import certifi
from datetime import timedelta
import time
from dotenv import load_dotenv
import uuid
from flask import session
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart 
import pytz


load_dotenv()
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")

# CORS setup
CORS(app, supports_credentials=True)

# Session cookie setup
app.config['SESSION_COOKIE_NAME'] = "colink-session"
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True

# MongoDB Cloud Setup
MONGO_URL = os.getenv("MONGO_URI")
client = MongoClient(
    MONGO_URL,
    server_api=ServerApi("1"),
    tls=True,
    tlsCAFile=certifi.where()
)
db = client["colink"]
details = db["details"]
users = db["users"]
notes_collection = db["personal_notes"]

# Redis Setup
REDIS_URL = os.getenv("REDIS_URL")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

# Google OAuth Setup
with open('client_secret.json', 'r') as f:
    client_config = json.load(f)

GOOGLE_REDIRECT_URI = "http://127.0.0.1:5000/google/callback"

flow = Flow.from_client_config(
    client_config,
    scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    redirect_uri=GOOGLE_REDIRECT_URI
)


# ---------- AUTH ROUTES ----------

@app.route('/login/google')
def google_login():
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true'
    )
    session['state'] = state
    return redirect(authorization_url)

@app.route('/google/callback')
def google_callback():
    if session.get('state') != request.args.get('state'):
        return "Invalid state parameter", 401

    try:
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        authed_session = AuthorizedSession(credentials)
        user_info = authed_session.get('https://www.googleapis.com/oauth2/v1/userinfo').json()

        session['email'] = user_info.get('email')
        session['name'] = user_info.get('name')

        picture = user_info.get('picture')

        existing_user = users.find_one({"email": user_info.get('email')})

        if not existing_user:
            # First login ➔ insert user with empty details
            users.insert_one({
                "email": user_info.get('email'),
                "name": user_info.get('name'),
                "company_name": "",
                "company_id": str(uuid.uuid4())[:8],  # ← short unique ID
                "profile_photo": "",
                "project_type": ""
            })
            if invited_company_id:
                db.companies.update_one(
                    {"company_id": invited_company_id},
                    {"$addToSet": {"members": user_info.get("email")}},
                      upsert=True
        )
            session.pop("invited_company_id", None)

            return redirect("http://127.0.0.1:3000/#/start")
        

        else:
            # Existing user
            if not existing_user.get('company_name'):
                return redirect("http://127.0.0.1:3000/#/company")
            elif not existing_user.get('profile'):
                return redirect("http://127.0.0.1:3000/#/userprofile")
            elif not existing_user.get('project_type'):
                return redirect("http://127.0.0.1:3000/#/projecttype")
            else:
                return redirect("http://127.0.0.1:3000/#/homepage1")

    except Exception as e:
        print(f"Error fetching token: {e}")
        return "Authentication error", 400


@app.route("/get-current-user", methods=["GET"])
def get_current_user():
    if "email" not in session:
        return jsonify({"error": "Not logged in"}), 401

    user = users.find_one({"email": session["email"]}, {"_id": 0})
    if user:
        return jsonify(user), 200
    return jsonify({"error": "User not found"}), 404

@app.route("/save-user-details", methods=["POST"])
def save_user_details():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    update_data = {}

    if "company_name" in data:
        update_data["company_name"] = data["company_name"]
    if "profile" in data:
        update_data["profile"] = data["profile"]
    if "project_type" in data:
        update_data["project_type"] = data["project_type"]
    if "profile_photo" in data:
        update_data["profile_photo"] = data["profile_photo"]  
    if not update_data:
        return jsonify({"error": "No fields to update"}), 400

    users.update_one(
        {"email": email},
        {"$set": update_data}
    )

    return jsonify({"message": "Details updated successfully"}), 200


@app.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

# ---------- DETAILS ROUTES ----------

@app.route("/get-details", methods=["GET"])
def get_details():
    data = details.find_one({}, {"_id": 0})
    if data:
        return jsonify(data), 200
    return jsonify({"error": "No details found", "company_name": "", "project_type": ""}), 404

@app.route("/update-details", methods=["POST"])
def update_details():
    data = request.json
    company_name = data.get("company_name")
    project_type = data.get("project_type")

    if not company_name or not project_type:
        return jsonify({"error": "Company name and project type are required"}), 400

    details.update_one({}, {"$set": {
        "company_name": company_name,
        "project_type": project_type
    }}, upsert=True)
    return jsonify({"message": "Details updated successfully"}), 201

# ---------- MESSAGING ROUTES (REDIS) ----------

@app.route("/send-message", methods=["POST"])
def send_message():
    data = request.json
    email = data.get("email")
    message = data.get("message")
    user = users.find_one({"email": email}, {"_id": 0, "name": 1})

    if not user or not message:
        return jsonify({"error": "Invalid message or user"}), 400

    from datetime import datetime
    timestamp = datetime.now().strftime("%H:%M")
    msg_obj = {
        "name": user["name"],
        "message": message,
        "timestamp": timestamp
    }
    payload = json.dumps(msg_obj)

    redis_client.rpush("messages", payload)
    redis_client.publish("messages", payload)

    return jsonify({"status": "Message sent"}), 200

@app.route("/get-messages", methods=["GET"])
def get_messages():
    raw = redis_client.lrange("messages", 0, -1)
    history = []
    for item in raw:
        try:
            history.append(json.loads(item))
        except json.JSONDecodeError:
            continue
    return jsonify(history), 200

@app.route("/stream-messages", methods=["GET"])
def stream_messages():
    def event_stream():
        pubsub = redis_client.pubsub()
        pubsub.subscribe("messages")
        for msg in pubsub.listen():
            if msg["type"] == "message":
                yield f"data: {msg['data']}\n\n"
    return Response(stream_with_context(event_stream()), mimetype="text/event-stream")

@app.route("/delete-message", methods=["POST"])
def delete_message():
    data = request.json
    message_id = data.get("message_id")

    if not message_id:
        return jsonify({"error": "message_id is required"}), 400

    #  storing messages in Redis
    all_messages = redis_client.lrange("messages", 0, -1)
    for msg in all_messages:
        if json.loads(msg).get("timestamp") == message_id:
            redis_client.lrem("messages", 1, msg)
            break

    return jsonify({"status": "Message deleted"}), 200


# ---------- USERNAME MANAGEMENT (REDIS) ----------

@app.route("/save-username", methods=["POST"])
def save_username():
    data = request.json
    email = data.get("email")
    username = data.get("username")

    if not email or not username:
        return jsonify({"error": "Email and username are required"}), 400

    redis_client.set(f"user:{email}", username)
    return jsonify({"message": "Username saved in Redis"}), 200

@app.route("/get-username/<email>", methods=["GET"])
def get_username(email):
    username = redis_client.get(f"user:{email}")
    if username:
        return jsonify({"name": username}), 200
    return jsonify({"name": ""}), 404

# ---------- SOCIAL MESSAGES ROUTES (REDIS) ----------

@app.route("/send-social-message", methods=["POST"])
def send_social_message():
    data = request.json
    email = data.get("email")
    message = data.get("message")
    user = users.find_one({"email": email}, {"_id": 0, "name": 1})

    if not user or not message:
        return jsonify({"error": "Invalid social message or user"}), 400

    from datetime import datetime
    timestamp = datetime.now().strftime("%H:%M")
    msg_obj = {
        "name": user["name"],
        "message": message,
        "timestamp": timestamp
    }
    payload = json.dumps(msg_obj)

    redis_client.rpush("social-messages", payload)
    redis_client.publish("social-messages", payload)

    return jsonify({"status": "Social message sent"}), 200

@app.route("/get-social-messages", methods=["GET"])
def get_social_messages():
    raw = redis_client.lrange("social-messages", 0, -1)
    history = []
    for item in raw:
        try:
            history.append(json.loads(item))
        except Exception:
            continue
    return jsonify(history), 200

@app.route("/delete-social-message", methods=["POST"])
def delete_social_message():
    data = request.json
    payload = data.get("payload")

    if not payload:
        return jsonify({"error": "Payload required"}), 400

    redis_client.lrem("social-messages", 1, payload)
    return jsonify({"status": "Social message deleted"}), 200

# ---------- PROJECT MESSAGES ROUTES (REDIS) ----------

@app.route("/send-project-message", methods=["POST"])
def send_project_message():
    data = request.json
    email = data.get("email")
    message = data.get("message")

    user = users.find_one({"email": email}, {"_id": 0, "name": 1})

    if not user or not message:
        return jsonify({"error": "Invalid project message or user"}), 400

    from datetime import datetime
    timestamp = datetime.now().strftime("%H:%M")

    msg_obj = {
        "name": user["name"],
        "message": message,
        "timestamp": timestamp
    }
    payload = json.dumps(msg_obj)

    redis_client.rpush("project-messages", payload)
    redis_client.publish("project-messages", payload)

    return jsonify({"status": "Project message sent"}), 200

@app.route("/get-project-messages", methods=["GET"])
def get_project_messages():
    raw = redis_client.lrange("project-messages", 0, -1)
    history = []
    for item in raw:
        try:
            history.append(json.loads(item))
        except json.JSONDecodeError:
            continue
    return jsonify(history), 200

@app.route("/delete-project-message", methods=["POST"])
def delete_project_message():
    data = request.json
    message_id = data.get("message_id")  # This is actually the timestamp

    if not message_id:
        return jsonify({"error": "message_id is required"}), 400

    all_messages = redis_client.lrange("project_messages", 0, -1)

    for msg in all_messages:
        try:
            parsed_msg = json.loads(msg)
            if parsed_msg.get("timestamp") == message_id:
                redis_client.lrem("project_messages", 1, msg)
                break
        except json.JSONDecodeError:
            continue

    return jsonify({"status": "Message deleted"}), 200

# ---------INVITE------------------

SMTP_EMAIL = "manav2k5@gmail.com"
SMTP_PASSWORD = "kdlnlopazlfmkqcz"
#@SMTP_PASSWORD = "Manav@christ"

@app.route("/send-invite", methods=["POST"])
def send_invite():
    data = request.json
    sender = data.get("senderEmail")
    receiver = data.get("receiverEmail")  # This will be provided by the user
    company_id = data.get("companyId")

    if not all([sender, receiver, company_id]):
        return jsonify({"error": "Missing fields"}), 400

    invite_link = f"http://localhost:3000/invite/{company_id}"
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "You're invited to join a company on CoLink!"
    msg["From"] = SMTP_EMAIL
    msg["To"] = receiver

    html = f"""
    <html>
        <body>
            <p>{sender} has invited you to join their company on <strong>CoLink</strong>.</p>
            <p><a href="{invite_link}">Click here to join the workspace</a></p>
        </body>
    </html>
    """
    msg.attach(MIMEText(html, "html"))

    try:
        print("Connecting to smtp.gmail.com ...")
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, receiver, msg.as_string())
        server.quit()

        return jsonify({"message": "Email sent successfully"}), 200

    except smtplib.SMTPAuthenticationError as e:
        print("Authentication error:", e)
        return jsonify({"error": "Authentication failed"}), 401
    except Exception as e:
        print(" Error:", e)
        return jsonify({"error": "Failed to send email"}), 500

#    -----------DmsPage---------------------------


@app.route('/save-note', methods=['POST'])
def save_note():
    data = request.get_json()
    note_text = data.get("note")
    email = data.get("email")

    if not note_text or not email:
        return jsonify({"error": "Missing note or email"}), 400

    # Indian Standard Time (IST)
    ist = pytz.timezone('Asia/Kolkata')
    timestamp = datetime.now(ist)

    db.notes.insert_one({
        "email": email,
        "note": note_text,
        "timestamp": timestamp
    })

    return jsonify({"message": "Note saved"}), 200
 

@app.route("/get-notes/<email>", methods=["GET"])
def get_notes(email):
    notes = list(db["notes"].find({"email": email}, {"_id": 0}))
    return jsonify(notes), 200

from flask import request, jsonify
from datetime import timedelta
from email.utils import parsedate_to_datetime
import pytz

@app.route("/delete-note", methods=["POST"])
def delete_note():
    data = request.json
    print("Incoming request data:", data)

    email = data.get("email")
    timestamp_str = data.get("timestamp")

    if not email or not timestamp_str:
        return jsonify({"error": "Missing fields"}), 400

    try:
      
        parsed = parsedate_to_datetime(timestamp_str)
        ist = pytz.timezone('Asia/Kolkata')
        timestamp = parsed.astimezone(ist)
        start = timestamp - timedelta(seconds=1)
        end = timestamp + timedelta(seconds=1)

        result = db["notes"].delete_one({
            "email": email,
            "timestamp": {"$gte": start, "$lte": end}
        })

        if result.deleted_count == 1:
            return jsonify({"message": "Note deleted"}), 200
        else:
            return jsonify({"error": "Note not found"}), 404

    except Exception as e:
        print(" Internal error:", e)
        return jsonify({"error": "Failed to delete note"}), 500



# ---------- MAIN ----------

if __name__ == "__main__":
    app.run(debug=True)
