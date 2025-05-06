import React, { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";

export default function DMsPage() {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");


  useEffect(() => {
    fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.name);
        setUserEmail(data.email);
        setName(data.name);
        setEmail(data.email);
        setProfilePhoto(data.profile_photo); // ✅ new line
        fetchNotes(data.email);
      });
  }, []);


  const fetchNotes = async (userEmail) => {
    const res = await fetch(`http://127.0.0.1:5000/get-notes/${userEmail}`);
    const data = await res.json();
    setNotes(data.reverse()); // show most recent first
  };

  const handleSendNote = async () => {
    if (!note) return;

    await fetch("http://127.0.0.1:5000/save-note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, note }),
    });

    setNote("");
    fetchNotes(email);
  };

  const handleDeleteNote = async (timestamp) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/delete-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: userEmail,
          timestamp: timestamp,
        }),
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.timestamp !== timestamp));
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Delete request failed:", error);
    }
  };

  return (
    <MainLayout hideMainSidebar>
      <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "black", color: "white", overflow: "hidden" }}>
        {/* Sidebar with DMs */}
        <div style={{ width: "300px", background: "linear-gradient(to bottom, rgba(128,0,128,0.5), black)", padding: "16px", height: "100%", overflowY: "auto" }}>
          <h3 style={{ marginBottom: "12px" }}>Direct messages</h3>

          <input
            type="text"
            placeholder="Find a DM"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              marginBottom: "20px",
              fontSize: "14px",
              transition: "all 0.2s ease",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src={profilePhoto}
              alt="Profile"
              style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
            />

            <div>
              <div>{name} (you)</div>
              <small style={{ color: "gray" }}>This is your space. Draft messages...</small>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", backgroundColor: "rgba(0, 0, 0, 0.9)", flexShrink: 0 }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "gray", borderRadius: "50%" }} />
            <strong>{name} (you)</strong>
          </div>

          <div style={{ padding: "20px", flexShrink: 0 }}>
            <div style={{ width: "60px", height: "60px", backgroundColor: "gray", borderRadius: "10px", marginBottom: "12px" }} />
            <h3 style={{ margin: 0 }}>{name} (you) • <span style={{ color: "green" }}>🟢</span></h3>
            <p style={{ color: "gray", marginTop: "8px" }}><strong>This is your space.</strong> Draft messages, make to-do lists...</p>
            <button style={{ marginTop: "8px", padding: "8px 12px", backgroundColor: "white", color: "black", border: "none", borderRadius: "6px", cursor: "pointer" }}>Edit profile</button>
          </div>

          <div style={{ flexGrow: 1, overflowY: "auto", padding: "20px", minHeight: 0 }}>
            <h4 style={{ color: "#4FC3F7", marginBottom: "16px" }}>📝 Your Notes</h4>
            {notes.length === 0 ? (
              <p style={{ color: "gray" }}>No notes yet. Start writing below!</p>
            ) : (
              notes.map((item, index) => (
                <div key={index} style={{ marginBottom: "12px", padding: "10px 12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "14px", position: "relative", transition: "all 0.2s ease" }}>
                  {item.note}
                  <div style={{ color: "gray", fontSize: "12px", marginTop: "6px" }}>{new Date(item.timestamp).toLocaleString()}</div>
                  <button onClick={() => handleDeleteNote(item.timestamp)} style={{ position: "absolute", top: "8px", right: "8px", background: "transparent", border: "none", color: "#FF6B6B", fontSize: "16px", cursor: "pointer", padding: "4px", borderRadius: "4px", transition: "all 0.2s ease" }} title="Delete note">
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>

          <div style={{ backgroundColor: "rgba(0,0,0,0.9)", padding: "16px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px" }}>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Make a note of something"
                style={{ flex: 1, padding: "10px", backgroundColor: "transparent", border: "none", color: "white", fontSize: "14px", outline: "none" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && note.trim()) handleSendNote();
                }}
              />
              <button onClick={handleSendNote} style={{ fontSize: "20px", color: note.trim() ? "#4FC3F7" : "rgba(255,255,255,0.3)", cursor: note.trim() ? "pointer" : "not-allowed", transition: "color 0.2s ease", padding: "4px 8px", borderRadius: "4px", backgroundColor: "transparent", border: "none" }} disabled={!note.trim()}>
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
