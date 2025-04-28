
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";


export default function MainSidebar() {
  const [companyName, setCompanyName] = useState("Loading...");
  const [projectName, setProjectName] = useState("Loading...");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get-details")
      .then((res) => res.json())
      .then((data) => {
        setCompanyName(data.company_name || "Company Name Unavailable");
        setProjectName(data.project_type || "Project Name Unavailable");
      })
      .catch(() => {
        setCompanyName("Company Name Unavailable");
        setProjectName("Project Name Unavailable");
      });
  }, []);

  const Section = ({ title, items }) => (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ color: "gray", fontSize: "12px", padding: "0 12px 8px" }}>{title}</div>
      {items.map(([label, path], index) => (
        <button
          key={index}
          onClick={() => path && navigate(path)}
          style={{
            display: "block",
            width: "100%",
            padding: "6px 12px",
            background: "transparent",
            border: "none",
            color: label.startsWith("+") ? "#4FC3F7" : "white",
            textAlign: "left",
            fontSize: "14px",
            cursor: path ? "pointer" : "default",
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
    cursor: "pointer"
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
    cursor: "pointer"
  };
  
  const companyDropdownRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
      setShowCompanyDropdown(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  return (
    <div
      style={{
        minWidth: "300px",
        maxWidth: "500px",
        background: "linear-gradient(to bottom, rgb(26,0,51), black)",
        color: "white",
        paddingTop: "12px",
        paddingBottom: "20px",
        paddingLeft: "10px",
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {/* Company Info Dropdown Header */}
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 12px", position: "relative" }}>
  <div
    onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "16px" }}
  >
    
    <div>
      {companyName}<br />
      <span style={{ color: "#bbb", fontSize: "12px" }}>{companyName.toLowerCase().replace(/\s+/g, '')}.colink.com</span>
    </div>
    <span style={{ color: "#bbb", fontSize: "12px", marginLeft: "auto" }}>⌄</span>
  </div>

  {/* ➕ Add Page button */}
  <div
    onClick={() => alert("Add Page clicked!")} // Replace with real function
    style={{
      cursor: "pointer",
      padding: "4px 8px",
      backgroundColor: "#4FC3F7",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "bold"
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
        top: "50px",
        left: "16px",
        backgroundColor: "#1f1f1f",
        color: "white",
        padding: "16px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        width: "260px",
        zIndex: 10
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
        cursor: "pointer"
      }}>🚀 Upgrade now</div>
      <hr style={{ borderColor: "#333", margin: "12px 0" }} />
      <div style={{ marginBottom: "8px" }}>Invite people to <strong>{companyName}</strong></div>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>Preferences ⌘,</div>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>Filter sidebar ›</div>
      <div style={{ marginBottom: "8px", cursor: "pointer" }}>Tools & settings ›</div>
      <div style={{ marginBottom: "4px", color: "gray" }}>Leave channels</div>
      <div style={{ fontSize: "12px", color: "#888" }}>Looking fresh! No new recommendations...</div>
      <hr style={{ borderColor: "#333", margin: "12px 0" }} />
      <div style={{ marginBottom: "6px", cursor: "pointer" }}>Sign in on mobile</div>
      <div style={{ cursor: "pointer" }}>Sign out</div>
    </div>
  )}
</div>

  
      
      {/* Huddles */}
      <div style={{ padding: "6 12px", color: "gray", fontSize: "15px", marginBottom: "8px" }}>
        🎧 Huddles
      </div>

      
     {/* CHANNELS with DROPDOWN AND SUBMENUS */}
<div style={{ position: "relative", marginBottom: "20px" }}>
  {/* Channels Title with Arrow */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 12px 8px",
      fontSize: "15px",
      color: "gray",
      cursor: "pointer",
      position: "relative",
      zIndex: 2
    }}
    onClick={() => setShowChannelDropdown(!showChannelDropdown)}
  >
    <span>Channels</span>
    <span style={{ color: "white", fontSize: "14px" }}>⌄</span>
  </div>

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
        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
        width: "160px"
      }}
      onMouseLeave={() => {
        setHoveredItem("");
      }}
    >
      {/* Create */}
      <div
        style={dropdownItemStyle}
        onMouseEnter={() => setHoveredItem("create")}
      >
        Create
        {hoveredItem === "create" && (
          <div style={{
            position: "absolute",
            left: "160px",
            top: 0,
            backgroundColor: "#333",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            width: "180px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            zIndex: 4
          }}>
            <div style={dropdownItemStyle}>Create Channel</div>
            <div style={dropdownItemStyle}>Create Section</div>
          </div>
        )}
      </div>

      {/* Manage */}
      <div
        style={dropdownItemStyle}
        onMouseEnter={() => setHoveredItem("manage")}
      >
        Manage
        {hoveredItem === "manage" && (
          <div style={{
            position: "absolute",
            left: "160px",
            top: "40px",
            backgroundColor: "#333",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            width: "180px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            zIndex: 4
          }}>
            <div style={dropdownItemStyle}>Browse Channels</div>
            <div style={dropdownItemStyle}>Edit All Sections</div>
          </div>
        )}
      </div>

      {/* Show and sort */}
      <div
        style={{ ...dropdownItemStyle, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        onMouseEnter={() => setHoveredItem("sort")}
      >
        <span>Show and sort</span>
        <span style={{ color: "gray", fontSize: "12px" }}>All</span>
        {hoveredItem === "sort" && (
          <div style={{
            position: "absolute",
            left: "160px",
            top: "80px",
            backgroundColor: "#333",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
            width: "180px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
            zIndex: 4
          }}>
            <div style={dropdownItemStyle}>All</div>
            <div style={dropdownItemStyle}>Unread messages only</div>
            <div style={dropdownItemStyle}>Mentions only</div>
            <hr style={{ borderColor: "#555", margin: "4px 0" }} />
            <div style={dropdownItemStyle}>Alphabetically</div>
            <div style={dropdownItemStyle}>By most recent</div>
            <div style={dropdownItemStyle}>Priority</div>
          </div>
        )}
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


      <Section
        title="Direct messages"
        items={[
          ["Manav  you", "/dm"],
          ["+ Invite people"]
        ]}
      />

      <Section
        title="Apps"
        items={[
          ["Slackbot"],
          ["+ Add apps"]
        ]}
      />

      <div style={{ flexGrow: 1 }}></div>
    </div>
  );
}
