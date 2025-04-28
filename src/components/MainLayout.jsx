import React from "react";
import LeftSidebar from "./LeftSidebar";
import MainSidebar from "./Sidebar";

export default function MainLayout({ children, hideMainSidebar = false }) {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#1a1d21", color: "white", display: "flex", flexDirection: "column" }}>
      {/* Top Search Bar */}
      <div style={{
      width: "100%",
      height: "40px",
      background: "linear-gradient(to right, #2a1a2a, #4a2a4a, #2a1a2a)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px",
      borderBottom: "1px solid #444"
    }}>
      <div style={{ width: "45%", maxWidth: "800px" }}>
        <input
          type="text"
          placeholder="Search messages, files, or channels"
          style={{
            width: "100%",
            height: "30px",
            padding: "0 16px",
            borderRadius: "6px",
            border: "1px solid #6a3a6a",
            backgroundColor: "#3a2a3a",
            color: "white",
            fontSize: "14px",
            outline: "none"
          }}
        />
      </div>
    </div>

      {/* Main Content Layout */}
      <div style={{ flex: 1, display: "flex", height: "calc(100vh - 64px)" }}>
        <LeftSidebar />
        {!hideMainSidebar && <MainSidebar />}

        {/* Main Page Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
