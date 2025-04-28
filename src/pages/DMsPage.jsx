import React from "react";
import MainLayout from "../components/MainLayout";

export default function DMsPage() {
  return (
    <MainLayout hideMainSidebar>
      <div style={{ display: "flex", width: "100vw", height: "100%", backgroundColor: "black", color: "white", overflow: "hidden" }}>
        {/* Sidebar with DMs */}
        <div style={{ width: "300px", background: "linear-gradient(to bottom, rgba(128,0,128,0.5), black)", padding: "16px", height: "100%" }}>
          <h3 style={{ marginBottom: "12px" }}>Direct messages</h3>

          <input
            type="text"
            placeholder="Find a DM"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              marginBottom: "20px",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: "gray",
                borderRadius: "50%",
              }}
            />
            <div>
              <div>Manav (you)</div>
              <small style={{ color: "gray" }}>This is your space. Draft messages...</small>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "gray",
                borderRadius: "50%",
              }}
            />
            <strong>Manav (you)</strong>
          </div>

          {/* Profile area */}
          <div style={{ padding: "20px", flexShrink: 0 }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "gray",
                borderRadius: "10px",
                marginBottom: "12px",
              }}
            />
            <h3 style={{ margin: 0 }}>
              Manav (you) • <span style={{ color: "green" }}>🟢</span>
            </h3>
            <p style={{ color: "gray", marginTop: "8px" }}>
              <strong>This is your space.</strong> Draft messages, make to-do lists...
            </p>
            <button
              style={{
                marginTop: "8px",
                padding: "8px 12px",
                backgroundColor: "white",
                color: "black",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Edit profile
            </button>
          </div>

          <div style={{ flexGrow: 1 }} />

          {/* Message Input */}
          <div style={{ backgroundColor: "rgba(0,0,0,0.9)", padding: "12px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "8px", color: "gray" }}>
              <button>B</button>
              <button>I</button>
              <button>🔗</button>
              <button>• List</button>
              <button>{"</>"}</button>
              <div style={{ flexGrow: 1 }}></div>
              <button>📎</button>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Make a note of something"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "white",
                }}
              />
              <button style={{ fontSize: "24px", color: "white" }}>📤</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
