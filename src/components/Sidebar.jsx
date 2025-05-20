import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";

export default function MainSidebar() {
  const [companyName, setCompanyName] = useState("Loading...");
  const [projectName, setProjectName] = useState("Loading...");
  const [companyId, setCompanyId] = useState("");
  const [signedInUserEmail, setSignedInUserEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false); // ✅
  const [showChannelDropdown, setShowChannelDropdown] = useState(false); // ✅
  const [hoveredItem, setHoveredItem] = useState("");                    // ✅

  const inviteModalRef = useRef(null);
  const companyDropdownRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setCompanyName(data.company_name || "Company Name Unavailable");
        setProjectName(data.project_type || "Project Name Unavailable");
        setCompanyId(data.company_id || "");
        setSignedInUserEmail(data.email || "");
      });
  }, []);

  const handleInviteClick = () => {
    if (!companyId) return;
    setShowInviteModal(true);
    setInviteLink(`${window.location.origin}/invite/${companyId}`);

  };

  const handleSendInvite = async () => {
    if (!email || !signedInUserEmail || !inviteLink) return;

    try {
      const response = await fetch("http://127.0.0.1:5000/send-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: signedInUserEmail,
          receiverEmail: email,
          companyId,
        }),
        credentials: "include",
      });
      

      if (response.ok) {
        setEmail("");
        setShowInviteModal(false);
        alert("Invitation sent successfully!");
      } else {
        alert("Failed to send invitation.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("Error occurred while sending invitation.");
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
      if (inviteModalRef.current && !inviteModalRef.current.contains(event.target)) {
        setShowInviteModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/logout", { method: "GET", credentials: "include" });
      navigate("/"); // or go back to login page
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  

  const Section = ({ title, items }) => (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ 
        color: "#9ea3a8", 
        fontSize: "13px", 
        padding: "0 16px 8px",
        textTransform: "uppercase",
        letterSpacing: "0.5px"
      }}>{title}</div>
      {items.map(([label, path, onClick]) => (
        <button
          key={label}
          onClick={() => {
            if (onClick) onClick();
            else if (path) navigate(path);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: label.startsWith("+") ? "#4FC3F7" : "white",
            textAlign: "left",
            fontSize: "14px",
            cursor: path || onClick ? "pointer" : "default",
            borderRadius: "4px",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            if (path || onClick) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
          }}
          onMouseOut={(e) => {
            if (path || onClick) e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const dropdownItemStyle = {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  };

  const channelItemStyle = {
    display: "block",
    width: "100%",
    padding: "6px 12px",
    background: "transparent",
    border: "none",
    color: "white",
    textAlign: "left",
    fontSize: "16px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minWidth: "300px",
        maxWidth: "500px",
        background: "linear-gradient(to bottom, rgb(15,0,30), rgb(5,0,10))",
        color: "white",
        paddingTop: "16px",
        paddingBottom: "20px",
        paddingLeft: "10px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Company Info Dropdown Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "0 16px 16px", 
        position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "16px"
      }}>
        <div
          onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
          style={{ 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            fontWeight: "bold", 
            fontSize: "18px",
            height: "48px",
            padding: "8px 0"
          }}
        >
          <div>
            {companyName}<br />
            <span style={{ color: "#9ea3a8", fontSize: "13px" }}>{companyName.toLowerCase().replace(/\s+/g, '')}.colink.com</span>
          </div>
          <span style={{ color: "#9ea3a8", fontSize: "14px", marginLeft: "auto" }}>⌄</span>
        </div>

        {/* ➕ Add Page button */}
        <div
          onClick={() => alert("Add Page clicked!")}
          style={{
            cursor: "pointer",
            padding: "6px 10px",
            backgroundColor: "#4FC3F7",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "bold",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ➕
        </div>

        {/* Dropdown Content */}
        {showCompanyDropdown && (
          <div
            ref={companyDropdownRef}
            style={{
              position: "absolute",
              top: "60px",
              left: "16px",
              backgroundColor: "rgb(15,0,30)",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              width: "260px",
              zIndex: 10,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              🚀 <strong>Pro trial</strong> lasts until 30 April. <span style={{ color: "#4FC3F7", cursor: "pointer" }}>See upgrade options</span>
            </div>
            <div style={{ marginBottom: "12px" }}>
              🇮🇳 Get 55% off a paid subscription. <span style={{ color: "#4FC3F7", cursor: "pointer" }}>See subscription details</span>
            </div>
            <div style={{
              padding: "8px",
              backgroundColor: "#000",
              borderRadius: "6px",
              textAlign: "center",
              fontWeight: "bold",
              border: "1px solid #4FC3F7",
              cursor: "pointer",
            }}>
              🚀 Upgrade now
            </div>
            <hr style={{ borderColor: "#333", margin: "12px 0" }} />
            <div style={{ marginBottom: "8px" }}>Invite people to <strong>{companyName}</strong></div>
            <div style={{ marginBottom: "8px", cursor: "pointer" }}>Preferences ⌘,</div>
            <div style={{ marginBottom: "8px", cursor: "pointer" }}>Filter sidebar ›</div>
            <div style={{ marginBottom: "8px", cursor: "pointer" }}>Tools & settings ›</div>
            <div style={{ marginBottom: "4px", color: "gray" }}>Leave channels</div>
            <div style={{ fontSize: "12px", color: "#888" }}>Looking fresh! No new recommendations...</div>
            <hr style={{ borderColor: "#333", margin: "12px 0" }} />
            <div style={{ marginBottom: "6px", cursor: "pointer" }}>Sign in on mobile</div>
            <div style={{ cursor: "pointer" }} onClick={handleLogout}>Sign out</div>
          </div>
        )}
      </div>

      {/* Huddles */}
      <div style={{ 
        padding: "8px 16px", 
        color: "#9ea3a8", 
        fontSize: "15px", 
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        🎧 Huddles
      </div>

      {/* Channels with Dropdown */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px 8px",
            fontSize: "15px",
            color: "#9ea3a8",
            cursor: "pointer",
            position: "relative",
            zIndex: 2,
            height: "40px",
          }}
          onClick={() => setShowChannelDropdown(!showChannelDropdown)}
        >
          <span>Channels</span>
          <span style={{ color: "#9ea3a8", fontSize: "14px" }}>⌄</span>
        </div>

        {/* Channel Dropdown */}
        {showChannelDropdown && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "120px",
              backgroundColor: "#222",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px",
              zIndex: 3,
              width: "160px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            }}
            onMouseLeave={() => setHoveredItem("")}
          >
            {/* Create / Manage / Sort */}
            <div style={dropdownItemStyle} onMouseEnter={() => setHoveredItem("create")}>Create</div>
            <div style={dropdownItemStyle} onMouseEnter={() => setHoveredItem("manage")}>Manage</div>
            <div style={{ ...dropdownItemStyle, display: "flex", justifyContent: "space-between" }}>
              <span>Show and sort</span><span style={{ color: "gray", fontSize: "12px" }}>All</span>
            </div>
          </div>
        )}

        {/* Channels */}
        <button onClick={() => navigate("/homepage1")} style={channelItemStyle}>
          # {companyName}
        </button>
        <button onClick={() => navigate("/homepage2")} style={channelItemStyle}>
          # {projectName}
        </button>
        <button onClick={() => navigate("/social")} style={channelItemStyle}>
          # social
        </button>
        <button style={{ ...channelItemStyle, color: "#4FC3F7" }}>
          + Add channels
        </button>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
        <Section
          title="Direct messages"
          items={[
            ["Manav  (you)", "/dm"],
            ["+ Invite people", null, handleInviteClick],
          ]}
        />
        <Section
          title="Apps"
          items={[
            ["Slackbot"],
            ["+ Add apps"],
          ]}
        />
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            ref={inviteModalRef}
            style={{
              backgroundColor: "rgb(26,0,51)",
              padding: "32px",
              borderRadius: "8px",
              width: "460px",
              color: "white",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2 style={{ 
              marginBottom: "24px", 
              fontSize: "22px",
              fontWeight: "600",
              color: "#ffffff",
              textAlign: "center"
            }}>Invite People</h2>
            
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#9ea3a8",
              }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                  color: "white",
                  fontSize: "14px",
                }}
              />
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                color: "#9ea3a8",
              }}>Invite Link</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    color: "white",
                    fontSize: "14px",
                  }}
                />
                <button
                  onClick={copyInviteLink}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#4FC3F7",
                    border: "none",
                    borderRadius: "4px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "12px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px"
            }}>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4FC3F7",
                  border: "none",
                  borderRadius: "4px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ flexGrow: 1 }}></div>
    </div>
  );
}
