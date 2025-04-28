import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import {
  FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl, FaCode, FaExternalLinkAlt,
  FaPlus, FaFont, FaSmile, FaAt, FaCamera, FaMicrophone, FaPencilAlt, FaPaperPlane, FaTrash
} from "react-icons/fa";

export default function Homepage1() {
  const [companyName, setCompanyName] = useState("Loading...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("User");

  const email = "user@example.com";
  const navigate = useNavigate();
  const formattedDate = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });

  const navButtons = [
    { icon: "💬", label: "Messages", to: "/homepage1" },
    { icon: "📖", label: "Company handbook", to: "/companyhandbook" },
    { icon: "", label: "+", to: "#" }
  ];

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [detailsRes, usernameRes] = await Promise.all([
        fetch("http://127.0.0.1:5000/get-details"),
        fetch(`http://127.0.0.1:5000/get-username/${email}`)
      ]);

      const details = await detailsRes.json();
      setCompanyName(details.company_name || "Unknown");

      const user = await usernameRes.json();
      setUsername(user.name || "User");

      const stored = localStorage.getItem("messages");
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/get-messages");
      const data = await res.json();
      const parsed = data.reverse();
      setMessages(parsed);
      localStorage.setItem("messages", JSON.stringify(parsed)); // Save in storage
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const handleSend = async () => {
    if (message.trim() === "") return;
  
    const newMessage = {
      name: username,
      message: message,
      timestamp: new Date().toLocaleString(),
    };
  
    try {
      await fetch("http://127.0.0.1:5000/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
  
      setMessages((prev) => [newMessage, ...prev]);  // add immediately to UI
  
      setTimeout(fetchMessages, 1000); // after 1 sec, fetch from server softly
      setMessage(""); // clear input but DON'T touch focus
  
    } catch (err) {
      console.error("Failed to send", err);
    }
  };
  
  

  const handleDelete = async (timestamp) => {
    try {
      await fetch("http://127.0.0.1:5000/delete-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: timestamp })
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const MessageInput = React.memo(() => (
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
            placeholder={`Message #all-${companyName}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            style={{
              flexGrow: 1,
              backgroundColor: "transparent",
              border: "none",
              color: "white",
              fontSize: "15px",
              outline: "none",
              padding: "8px 12px",
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
  ));

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1a1d21", height: "100%" }}>

        {/* Header */}
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1a1d21" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
            # all-{companyName}
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {navButtons.map((btn, i) => (
              <button key={i} onClick={() => btn.to !== "#" && navigate(btn.to)} style={{
                background: "transparent", border: "none", color: "#9ea3a8",
                fontSize: btn.label === "+" ? "20px" : "14px", cursor: "pointer"
              }}>
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={{ background: "linear-gradient(180deg, #4a154b 0%, #1a1d21 100%)", padding: "32px 16px", color: "white" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
              Everyone's all here in # all-{companyName}
            </h2>
            <p style={{ margin: 0, color: "#9ea3a8", fontSize: "15px" }}>
              Share announcements and updates about company news, upcoming events or teammates who deserve some kudos. ⭐
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#9ea3a8", fontSize: "12px", textAlign: "center", marginBottom: "16px" }}>
            {formattedDate}
          </div>

          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
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
                {msg.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <strong style={{ color: "#e6e6e6" }}>{msg.name}</strong>
                  <span style={{ color: "#666", fontSize: "11px" }}>{msg.timestamp}</span>
                </div>
                <div style={{ color: "#d0d0d0", fontSize: "14px", marginTop: "2px" }}>{msg.message}</div>
              </div>
              <button onClick={() => handleDelete(msg.timestamp)} style={{
                background: "transparent",
                border: "none",
                color: "#ff6666",
                fontSize: "16px",
                cursor: "pointer"
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

