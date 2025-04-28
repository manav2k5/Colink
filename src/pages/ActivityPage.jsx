import React from "react";
import MainLayout from "../components/MainLayout";

export default function ActivityPage() {
  return (
    <MainLayout hideMainSidebar>
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Activity Sidebar */}
        <div
          style={{
            width: "440px",
            background: "linear-gradient(to bottom, #2c0f3a, #0c0210)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>Activity</h2>
            <label style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
              <span style={{ marginRight: "8px" }}>Unread messages</span>
              <input type="checkbox" />
            </label>
          </div>

          {/* Tab */}
          <div style={{ marginTop: "16px", paddingBottom: "8px", borderBottom: "2px solid white", fontSize: "14px" }}>
            All
          </div>

          {/* Caught Up Message */}
          <div style={{ marginTop: "80px", textAlign: "center" }}>
            <div style={{ fontSize: "40px" }}>✅</div>
            <h3 style={{ marginTop: "16px", fontSize: "16px" }}>You’ve caught up with everything.</h3>
            <p style={{ fontSize: "14px", color: "#ccc", marginTop: "8px" }}>
              Looks like things are quiet for now. When there’s new activity, you’ll see it here.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#a365d6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "white",
              boxShadow: "0 0 40px rgba(163, 101, 214, 0.5)",
            }}
          >
            @
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
