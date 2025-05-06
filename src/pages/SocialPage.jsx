import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { 
  FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt,
  FaPlus, FaFont, FaSmile, FaAt, FaCamera, FaMicrophone, FaPencilAlt, FaPaperPlane, FaTrash
} from "react-icons/fa";

export default function SocialPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("User");
  const email = "user@example.com";  // TODO: Later replace with real email
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchSocialMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/get-username/${email}`);
      const data = await res.json();
      setUsername(data.name || "User");
      fetchSocialMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSocialMessages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/get-social-messages");
      const data = await res.json();
      setMessages(data.reverse());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      await fetch("http://127.0.0.1:5000/send-social-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      setMessage("");
      fetchSocialMessages();
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  const handleDelete = async (payload) => {
    try {
      await fetch("http://127.0.0.1:5000/delete-social-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload }),
      });
      fetchSocialMessages();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const MessageInput = () => (
    <div style={{ backgroundColor: "transparent", padding: "0 16px 16px 16px", marginTop: "auto" }}>
      <div style={{
        border: "1px solid #424242",
        borderRadius: "4px",
        backgroundColor: "#222529",
        padding: "12px"
      }}>
        {/* Toolbar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
          {[FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt].map((Icon, i) => (
            <button key={i} style={{ background: "transparent", border: "none", color: "#9ea3a8", fontSize: "15px" }}>
              <Icon />
            </button>
          ))}
        </div>

        {/* Input Row */}
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
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6" }}>
            # social
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(180deg, #4a154b 0%, #1a1d21 100%)", padding: "32px 16px" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ width: "48px", height: "48px", backgroundColor: "#fff", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>💬</div>
            <div>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "400", color: "#ffffff" }}>
                Have a little chit-chat in #social
              </h1>
              <p style={{ margin: 0, fontSize: "15px", color: "#9ea3a8" }}>
                Other channels are for work. This one is just for fun. Get to know your teammates. 🎈
              </p>
            </div>
          </div>
        </div>

        {/* Social Messages List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                backgroundColor: "#4a154b",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "500"
              }}>
                {msg.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <strong style={{ color: "#e6e6e6" }}>{msg.name}</strong>
                  <span style={{ fontSize: "11px", color: "#666" }}>{msg.timestamp}</span>
                </div>
                <div style={{ marginTop: "4px", fontSize: "14px", color: "#d0d0d0" }}>
                  {msg.message}
                </div>
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

        {/* Input Box */}
        <MessageInput />
      </div>
    </MainLayout>
  );
}
