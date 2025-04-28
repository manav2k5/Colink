from flask import Flask, request, jsonify, Response, stream_with_context, redirect, session, url_for
from flask_cors import CORS
from flask_dance.contrib.google import make_google_blueprint, google
import redis
import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
import json
from pymongo import MongoClient
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")

# Google OAuth Setup
google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_url="/login/google/authorized",
    scope=["https://www.googleapis.com/auth/userinfo.profile", 
           "https://www.googleapis.com/auth/userinfo.email"]
)
app.register_blueprint(google_bp, url_prefix="/login")

# Google OAuth Callback Route
@app.route("/login/google/authorized")
def google_authorized():
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return redirect("/login-failed")
    user_info = resp.json()

    # Now you have user_info['email'], user_info['name'], user_info['picture'] etc
    session["email"] = user_info["email"]
    session["name"] = user_info["name"]

    return redirect("http://localhost:5000/start")  # After successful login, send user to your app



@app.route("/get-current-user", methods=["GET"])
def get_current_user():
    if "email" not in session:
        return jsonify({"error": "Not logged in"}), 401
    return jsonify({
        "email": session["email"],
        "name": session["name"]
    }), 200

@app.route("/logout", methods=["GET"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


# MongoDB Setup
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
client = MongoClient(MONGO_URL)
db = client["colink"]
details = db["details"]
users = db["users"]

# Redis Setup
REDIS_URL = os.getenv("REDIS_URL")
redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

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
            continue  # Just skip bad entries
    return jsonify(history), 200



@app.route("/stream-messages", methods=["GET"])
def stream_messages():
    def event_stream():
        pubsub = redis_client.pubsub()
        pubsub.subscribe("messages")
        for msg in pubsub.listen():
            if msg["type"] == "message":
                
                yield f"data: {msg['data']}\n\n"

    return Response(
        stream_with_context(event_stream()),
        mimetype="text/event-stream"
    )


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
@app.route("/delete-message", methods=["POST"])
def delete_message():
    data = request.json
    message_id = data.get("message_id")

    if not message_id:
        return jsonify({"error": "message_id is required"}), 400

    # Fetch all messages
    all_messages = redis_client.lrange("messages", 0, -1)

    # Search for the exact one and delete
    for msg in all_messages:
        if json.loads(msg).get("timestamp") == message_id:
            redis_client.lrem("messages", 1, msg)
            break

    return jsonify({"status": "Message deleted"}), 200

# Store project-specific message
@app.route("/send-project-message", methods=["POST"])
def send_project_message():
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

    redis_client.rpush("project-messages", payload)  # 🔥 different list
    redis_client.publish("project-messages", payload)

    return jsonify({"status": "Project message sent"}), 200

# Get all project-specific messages
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

# Delete a project-specific message
@app.route("/delete-project-message", methods=["POST"])
def delete_project_message():
    data = request.json
    payload = data.get("payload")

    if not payload:
        return jsonify({"error": "No payload provided"}), 400

    redis_client.lrem("project-messages", 1, payload)
    return jsonify({"message": "Project message deleted"}), 200



# Store social message
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

# Get all social messages
@app.route("/get-social-messages", methods=["GET"])
def get_social_messages():
    raw = redis_client.lrange("social-messages", 0, -1)
    history = []
    for item in raw:
        try:
            history.append(json.loads(item))
        except Exception as e:
            continue
    return jsonify(history), 200

# Delete a specific social message
@app.route("/delete-social-message", methods=["POST"])
def delete_social_message():
    data = request.json
    payload = data.get("payload")

    if not payload:
        return jsonify({"error": "Payload required"}), 400

    redis_client.lrem("social-messages", 1, payload)
    return jsonify({"status": "Social message deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True)
