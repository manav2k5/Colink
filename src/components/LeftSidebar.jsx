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
  FaChartLine
} from "react-icons/fa";

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
      console.log("Company Name:", data);
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
          backgroundColor: isSelected ? "purple" : "transparent",
          color: "white",
          border: "none",
          padding: "10px",
          borderRadius: "17px",
          width: "55px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        <div style={{ fontSize: "20px" }}>
          <DisplayIcon />
        </div>
        <div style={{ fontSize: "10px" }}>{label}</div>
      </button>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", position: "relative" }}>
      {/* Left Sidebar */}
      <div
        style={{
          width: "70px",
          background: "linear-gradient(to bottom, rgb(51,0,77), black)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        {/* Company Initial */}
        <div style={{
          width: "38px", height: "32px", backgroundColor: "#888", borderRadius: "6px", marginBottom: "20px",
          display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "white"
        }}>
          {companyName[0]?.toUpperCase()}
        </div>


        <SidebarButton icon={FaHome} filledIcon={FaHome} label="Home" name="Home" to="/homepage1" />
        <SidebarButton icon={FaRegCommentDots} filledIcon={FaCommentDots} label="DMs" name="DMs" to="/dms" />
        <SidebarButton icon={FaClipboardList} filledIcon={FaClipboardList} label="Activity" name="Activity" to="/activity" />
        <SidebarButton icon={FaChartLine} filledIcon={FaChartLine} label="TaskBoard" name="TaskBoard" to="/kanbanboard" />


        <button
          onClick={() => {
            setSelected("More");
            setShowMoreMenu(!showMoreMenu);
          }}
          style={{
            backgroundColor: selected === "More" ? "purple" : "transparent",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "10px",
            width: "60px",
            cursor: "pointer",
            marginBottom: "10px",
          }}
        >
          <div style={{ fontSize: "20px" }}>
            <FaEllipsisH />
          </div>
          <div style={{ fontSize: "10px" }}>More</div>
        </button>


        <div style={{ flexGrow: 1 }}></div>


        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "rgba(128,0,128,0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
          <FaPlus />
        </div>


        <div
          style={{
            width: "40px",
            height: "40px",
            backgroundColor: "purple",
            borderRadius: "10px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "white",
          }}
        >
          <FaUserCircle size={20} />
          <div
            style={{
              position: "absolute",
              width: "10px",
              height: "10px",
              backgroundColor: "green",
              borderRadius: "50%",
              bottom: "-2px",
              right: "-2px",
              border: "2px solid black",
            }}
          ></div>
        </div>
      </div>

      {showMoreMenu && (
        <div
          style={{
            position: "absolute",
            left: "80px",
            top: "160px",
            backgroundColor: "#1f1f1f",
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "16px",
            zIndex: 1000,
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            width: "260px",
            color: "white",
          }}
        >
          <div style={{ padding: "8px 0", borderBottom: "1px solid #444" }}><strong>More</strong></div>
          <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div><strong>Templates</strong><br /><span style={{ color: "gray" }}>Kick-start any job</span></div>
            <div><strong>Automations</strong><br /><span style={{ color: "gray" }}>Find workflows and apps</span></div>
            <div><strong>Canvases</strong><br /><span style={{ color: "gray" }}>Curate content</span></div>
            <div><strong>Lists</strong><br /><span style={{ color: "gray" }}>Track and manage</span></div>
            <div><strong>Files</strong><br /><span style={{ color: "gray" }}>Documents and clips</span></div>
            <div><strong>Channels</strong><br /><span style={{ color: "gray" }}>Team conversations</span></div>
            <div><strong>People</strong><br /><span style={{ color: "gray" }}>User groups</span></div>
            <div><strong>External Connections</strong><br /><span style={{ color: "gray" }}>Work with others</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
