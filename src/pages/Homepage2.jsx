import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { 
  FaUsers, FaFileAlt, FaHandshake, FaClipboardList,
  FaBold, FaItalic, FaStrikethrough, FaLink, FaListUl,
  FaCode, FaExternalLinkAlt, FaPlus, FaFont, FaSmile,
  FaAt, FaCamera, FaMicrophone, FaPencilAlt, FaPaperPlane, FaTrash
} from "react-icons/fa";

export default function Homepage2() {
  const [projectName, setProjectName] = useState("Loading...");
  const [projectMessages, setProjectMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({ name: "User", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(fetchProjectMessages, 1500);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const userRes = await fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" });
      const messagesRes = await fetch("http://127.0.0.1:5000/get-project-messages");

      if (userRes.status === 200) {
        const userData = await userRes.json();
        setUser({ name: userData.name, email: userData.email });
        setProjectName(userData.project_type || "Unknown");
      }

      if (messagesRes.status === 200) {
        const msgData = await messagesRes.json();
        const parsed = msgData.reverse();
        setProjectMessages(parsed)
        
      }
    } catch (error) {
      console.error("Error fetching initial data", error);
    }
  };

  const fetchProjectMessages = async () => {
    const controller = new AbortController();
    try {
      const res = await fetch("http://127.0.0.1:5000/get-project-messages", {
        signal: controller.signal,
      });

      if (res.status === 200) {
        const data = await res.json();
        setProjectMessages(data.reverse());
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching project messages", error);
      }
    }
    return () => controller.abort();
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    const tempMessage = {
      name: user.name,
      
      message: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setProjectMessages((prev) => [tempMessage, ...prev]);
    setMessage("");

    try {
      await fetch("http://127.0.0.1:5000/send-project-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, message }),
      });

      fetchProjectMessages(); // Sync with latest messages
    } catch (error) {
      console.error("Error sending project message", error);
    }
  };

  const handleDelete = async (msg) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/delete-project-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message_id: msg.timestamp }),
      });
  
      if (res.ok) {
        await fetchProjectMessages(); // re-sync state from Redis
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting project message", error);
    }
  };
  
  
  const WelcomeCard = ({ title, subtitle, icon, color }) => (
    <div style={{
      width: "260px",
      height: "220px",
      backgroundColor: color,
      borderRadius: "8px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      cursor: "pointer"
    }}>
      <div style={{ fontSize: "32px", color: "white" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "white", marginBottom: "4px" }}>{title}</div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{subtitle}</div>
      </div>
    </div>
  );

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
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Message #all-${projectName}`}
            style={{
              flexGrow: 1,
              backgroundColor: "transparent",
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
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#1a1d21" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
            # all-{projectName}
          </div>
        </div>

        {/* Welcome Banner */}
        <div style={{ padding: "32px 16px", background: "linear-gradient(180deg, rgba(74,21,75,0.9) 0%, rgba(26,29,33,1) 100%)" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "400", marginBottom: "16px" }}>👋 Welcome to the #{projectName} channel</h1>
          <p style={{ fontSize: "15px", color: "#9ea3a8", marginBottom: "24px" }}>
            This channel is for everything #{projectName}. Get started by setting up the channel for your team:
          </p>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
            <WelcomeCard title="Invite teammates" subtitle="Add your whole team" color="#4A154B" icon={<FaUsers />} />
            <WelcomeCard title="Add project brief" subtitle="Canvas template" color="#1C4B57" icon={<FaFileAlt />} />
            <WelcomeCard title="Host weekly syncs" subtitle="Huddle in Slack" color="#1E4620" icon={<FaHandshake />} />
            <WelcomeCard title="Add project tracker" subtitle="List template" color="#4A3205" icon={<FaClipboardList />} />
          </div>
        </div>

        {/* Project Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column" }}>
          {projectMessages.map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
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
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                  <strong style={{ color: "#e6e6e6" }}>{msg.name}</strong>
                  <span style={{ color: "#666", fontSize: "11px" }}>{msg.timestamp}</span>
                </div>
                <div style={{ color: "#d0d0d0", fontSize: "14px", marginTop: "2px" }}>{msg.message}</div>
              </div>
              <button onClick={() => handleDelete(msg)} style={{
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
