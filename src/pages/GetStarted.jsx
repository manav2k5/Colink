import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

const PersonIllustration1 = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="45" r="25" fill="#2D2D2D"/>
    <path d="M60 75C81.5 75 95 85 95 100H25C25 85 38.5 75 60 75Z" fill="#2D2D2D"/>
    <path d="M45 42C45 42 50 49 60 49C70 49 75 42 75 42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="45" cy="35" r="5" fill="white"/>
    <circle cx="75" cy="35" r="5" fill="white"/>
  </svg>
);

const PersonIllustration2 = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="45" r="25" fill="#2D2D2D"/>
    <path d="M60 75C81.5 75 95 85 95 100H25C25 85 38.5 75 60 75Z" fill="#2D2D2D"/>
    <path d="M45 42C45 42 50 35 60 35C70 35 75 42 75 42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="45" cy="35" r="5" fill="white"/>
    <circle cx="75" cy="35" r="5" fill="white"/>
  </svg>
);

const PersonIllustration3 = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="45" r="25" fill="#2D2D2D"/>
    <path d="M60 75C81.5 75 95 85 95 100H25C25 85 38.5 75 60 75Z" fill="#2D2D2D"/>
    <path d="M45 35H75" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="45" cy="35" r="5" fill="white"/>
    <circle cx="75" cy="35" r="5" fill="white"/>
  </svg>
);

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#4A154B", // Slack's purple
        color: "white",
        overflow: "hidden",
        fontFamily: "'Lato', 'Segoe UI', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            margin: "0 0 40px 0",
            lineHeight: "1.2",
          }}
        >
          CoLink brings the team together, wherever you are
        </h1>

        {/* Illustration Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            marginBottom: "40px",
          }}
        >
          {/* Team Member 1 - Top Left */}
          <div
            style={{
              position: "absolute",
              top: "50px",
              left: "100px",
              backgroundColor: "#FFF1E9",
              borderRadius: "20px",
              padding: "20px",
              width: "220px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(-5deg)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(-5deg) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(-5deg)";
            }}
          >
            <PersonIllustration1 />
            <div
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ color: "#E01E5A" }}>📄</span>
              <span style={{ color: "#333", fontSize: "14px" }}>Document.pdf</span>
            </div>
          </div>

          {/* Team Member 2 - Top Right */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "120px",
              backgroundColor: "#FFB900",
              borderRadius: "20px",
              padding: "20px",
              width: "180px",
              height: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "rotate(5deg)",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotate(5deg) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotate(5deg)";
            }}
          >
            <PersonIllustration2 />
          </div>

          {/* Team Member 3 - Bottom */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#FF9B8E",
              borderRadius: "20px",
              padding: "20px",
              width: "200px",
              height: "150px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(-50%)";
            }}
          >
            <PersonIllustration3 />
            <div
              style={{
                position: "absolute",
                bottom: "-15px",
                right: "-15px",
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <span style={{ color: "#007A5A" }}>✓</span>
              <span style={{ color: "#333", fontSize: "14px" }}>3</span>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "white",
            color: "#4A154B",
            border: "none",
            borderRadius: "28px",
            padding: "19px 40px 20px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.2s ease",
            width: "300px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F8F8F8";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Get started
        </button>
      </div>
    </div>
  );
}
