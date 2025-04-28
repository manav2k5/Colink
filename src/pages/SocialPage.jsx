import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { 
  FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt,
  FaPlus, FaFont, FaSmile, FaAt, FaCamera, FaMicrophone, FaPencilAlt, FaPaperPlane, FaTrash
} from "react-icons/fa";

export default function SocialPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("User");

  const email = "user@example.com";

  useEffect(() => {
    fetchUsername();
    fetchSocialMessages();
  }, []);

  const fetchUsername = async () => {
    const res = await fetch(`http://127.0.0.1:5000/get-username/${email}`);
    const data = await res.json();
    setUsername(data.name || "User");
  };

  const fetchSocialMessages = async () => {
    const res = await fetch("http://127.0.0.1:5000/get-social-messages");
    const data = await res.json();
    setMessages(data.reverse());
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    await fetch("http://127.0.0.1:5000/send-social-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });

    setMessage("");
    fetchSocialMessages();
  };

  const handleDelete = async (payload) => {
    await fetch("http://127.0.0.1:5000/delete-social-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    });

    fetchSocialMessages();
  };

  const MessageInput = () => (
    <div style={{ backgroundColor: "transparent", padding: "0 16px 16px 16px", marginTop: "auto" }}>
      <div style={{
        border: "1px solid #424242",
        borderRadius: "4px",
        backgroundColor: "#222529",
        padding: "12px"
      }}>
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          {[FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt].map((Icon, i) => (
            <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "15px" }}>
              <Icon />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {[FaPlus, FaFont, FaSmile, FaAt].map((Icon, i) => (
              <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}>
                <Icon />
              </button>
            ))}
          </div>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message #social"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "15px",
              outline: "none"
            }}
          />

          <div style={{ display: "flex", gap: "8px" }}>
            {[FaCamera, FaMicrophone, FaPencilAlt].map((Icon, i) => (
              <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "16px" }}>
                <Icon />
              </button>
            ))}
            <button onClick={handleSend} style={{ background: "transparent", border: "none", color: "#4FC3F7", fontSize: "16px" }}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1a1d21", height: "100%" }}>

        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", backgroundColor: "#1a1d21" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
            # social
          </div>
        </div>

        {/* Welcome Section */}
        <div style={{ background: "linear-gradient(180deg, #4a154b 0%, #1a1d21 100%)", padding: "32px 16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>💬</div>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "400", color: "#ffffff" }}>Have a little chit-chat in # social</h1>
              <p style={{ margin: 0, fontSize: "15px", color: "#9ea3a8", lineHeight: "1.4" }}>
                Other channels are for work. This one's just for fun. Get to know your teammates and show your lighter side. 🎈
              </p>
            </div>
          </div>

          {/* Coffee Break Card */}
          <div style={{ marginTop: "24px", backgroundColor: "#222529", borderRadius: "8px", padding: "16px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", maxWidth: "400px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "8px", backgroundColor: "#1264a3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🎧</div>
            <div>
              <div style={{ fontWeight: "600", color: "#e6e6e6", marginBottom: "4px" }}>Take a coffee break together</div>
              <div style={{ color: "#9ea3a8", fontSize: "14px" }}>Try out an impromptu huddle</div>
            </div>
          </div>
        </div>

        {/* Social Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "16px", alignItems: "flex-start" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "4px",
                backgroundColor: "#4a154b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500"
              }}>
                {msg.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <strong style={{ color: "#e6e6e6" }}>{msg.name}</strong>
                  <span style={{ color: "#666", fontSize: "11px" }}>{msg.timestamp}</span>
                </div>
                <div style={{ color: "#d0d0d0", fontSize: "14px", marginTop: "2px" }}>{msg.message}</div>
              </div>
              <button onClick={() => handleDelete(JSON.stringify(msg))} style={{
                background: "transparent",
                border: "none",
                color: "#ff4d4d",
                cursor: "pointer",
                fontSize: "16px"
              }}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <MessageInput />
      </div>
    </MainLayout>
  );
}
