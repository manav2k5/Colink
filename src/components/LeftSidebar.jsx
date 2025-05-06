import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaRegCommentDots,
  FaCommentDots,
  FaCog,
  FaEllipsisH,
  FaPlus,
  FaUserCircle,
  FaBell,
  FaTasks,
  FaProjectDiagram,
  FaClipboardList,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaExternalLinkAlt,
  FaListAlt,
  FaRobot,
  FaRocket,
  FaLightbulb,
  FaPuzzlePiece,
  FaLayerGroup,
  FaFolder,
  FaUserFriends,
  FaLink
} from "react-icons/fa";
import { BsGrid3X3Gap, BsKanban, BsCalendarEvent } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";

export default function LeftSidebar() {
  const [selected, setSelected] = useState("Home");
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyName();
  }, []);

  const fetchCompanyName = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-details");
      const data = await response.json();
      setCompanyName(data.company_name || "");
    } catch (error) {
      console.error("Error fetching company name:", error);
    }
  };

  const SidebarButton = ({ icon: Icon, filledIcon: FilledIcon, label, name, to }) => {
    const isSelected = selected === name;
    const DisplayIcon = isSelected ? FilledIcon : Icon;

    return (
      <button
        onClick={() => {
          setSelected(name);
          if (to) navigate(to);
        }}
        style={{
          backgroundColor: isSelected ? "rgba(74, 42, 74, 0.15)" : "transparent",
          color: isSelected ? "#b388ff" : "white",
          border: "none",
          padding: "12px 8px",
          borderRadius: "8px",
          width: "64px",
          cursor: "pointer",
          marginBottom: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          transition: "all 0.2s ease",
        }}
        onMouseOver={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.1)";
            e.currentTarget.style.color = "#b388ff";
          }
        }}
        onMouseOut={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "white";
          }
        }}
      >
        <DisplayIcon style={{ fontSize: "20px" }} />
        <span style={{ fontSize: "11px", fontWeight: "500" }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      fontFamily: "'Segoe UI', sans-serif", 
      position: "relative",
      background: "#2a1a2a",
    }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: "65px",
          background: "#2a1a2a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "24px",
          paddingBottom: "24px",
          borderRight: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {/* Company Initial */}
        <div style={{
          width: "44px",
          height: "44px",
          backgroundColor: "#4a2a4a",
          borderRadius: "8px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          color: "white",
          fontSize: "18px",
          boxShadow: "0 2px 8px rgba(74, 42, 74, 0.3)",
        }}>
          {companyName[0]?.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <SidebarButton icon={MdDashboard} filledIcon={MdDashboard} label="Home" name="Home" to="/homepage1" />
          <SidebarButton icon={FaRegCommentDots} filledIcon={FaCommentDots} label="DMs" name="DMs" to="/dms" />
          <SidebarButton icon={BsKanban} filledIcon={BsKanban} label="Tasks" name="TaskBoard" to="/kanbanboard" />
          <SidebarButton icon={BsCalendarEvent} filledIcon={BsCalendarEvent} label="Calendar" name="Calendar" to="/calendar" />
        </div>

        <div style={{ flexGrow: 1 }}></div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => {
              setSelected("More");
              setShowMoreMenu(!showMoreMenu);
            }}
            style={{
              backgroundColor: selected === "More" ? "rgba(74, 42, 74, 0.15)" : "transparent",
              color: selected === "More" ? "#b388ff" : "white",
              border: "none",
              padding: "12px 8px",
              borderRadius: "8px",
              width: "64px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (selected !== "More") {
                e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.1)";
                e.currentTarget.style.color = "#b388ff";
              }
            }}
            onMouseOut={(e) => {
              if (selected !== "More") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "white";
              }
            }}
          >
            <BsGrid3X3Gap style={{ fontSize: "20px" }} />
            <span style={{ fontSize: "11px", fontWeight: "500" }}>More</span>
          </button>

          <div
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "rgba(74, 42, 74, 0.15)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b388ff",
              fontSize: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaPlus />
          </div>

          <div
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "rgba(74, 42, 74, 0.15)",
              borderRadius: "8px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b388ff",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.25)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(74, 42, 74, 0.15)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaUserCircle size={24} />
            <div
              style={{
                position: "absolute",
                width: "12px",
                height: "12px",
                backgroundColor: "#b388ff",
                borderRadius: "50%",
                bottom: "-2px",
                right: "-2px",
                border: "2px solid #2a1a2a",
                boxShadow: "0 0 4px rgba(179, 136, 255, 0.5)",
              }}
            ></div>
          </div>
        </div>
      </div>

      {showMoreMenu && (
        <div
          style={{
            position: "absolute",
            left: "90px",
            top: "160px",
            backgroundColor: "#2a1a2a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            padding: "16px",
            zIndex: 1000,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            width: "280px",
            color: "white",
          }}
        >
          <div style={{ 
            padding: "8px 0", 
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "12px",
            color: "#b388ff",
            fontWeight: "600",
            fontSize: "14px"
          }}>More Tools</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaLightbulb style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>Templates</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Kick-start any job</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaRocket style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>Automations</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Find workflows and apps</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaLayerGroup style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>Canvases</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Curate content</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaPuzzlePiece style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>Integrations</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Connect your tools</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaFolder style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>Files</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Documents and clips</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaUserFriends style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>People</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>User groups</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
              <FaLink style={{ color: "#b388ff", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "500" }}>External Connections</div>
                <div style={{ color: "#9ea3a8", fontSize: "12px" }}>Work with others</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
