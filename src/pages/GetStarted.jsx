import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css"; 

const FeatureCard = ({ icon, title, color }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "#111",
        padding: "20px",
        borderRadius: "20px",
        border: `1px solid ${color}`,
        textAlign: "center",
        color: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        transform: hovered ? "scale(1.05)" : "scale(1)",
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: "26px", marginBottom: "8px", color }}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div style={{ fontSize: "14px" }}>{title}</div>
    </div>
  );
};

export default function GetStarted() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [logoScale, setLogoScale] = useState(0.8);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);
    const interval = setInterval(() => {
      setLogoScale((prev) => (prev === 1.0 ? 0.9 : 1.0));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Animated Circles */}
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          backgroundColor: "#0066CC",
          opacity: 0.1,
          top: "80px",
          left: "40px",
          animation: "float1 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "#0099FF",
          opacity: 0.1,
          bottom: "80px",
          right: "40px",
          animation: "float2 6s ease-in-out infinite",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <div />
        <div
          style={{
            opacity: isAnimating ? 1 : 0,
            transform: `scale(${logoScale}) translateY(${isAnimating ? 0 : 40}px)`,
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              color: "#0066CC",
              marginBottom: "10px",
            }}
          >
            💬
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: 0 }}>
            Welcome to CoLink
          </h1>
          <p
            style={{
              color: "#aaa",
              fontSize: "16px",
              marginTop: "8px",
              maxWidth: "400px",
              marginInline: "auto",
            }}
          >
            A modern chat app for seamless communication.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
            marginTop: "40px",
            maxWidth: "600px",
            width: "100%",
            opacity: isAnimating ? 1 : 0,
            transform: `translateY(${isAnimating ? 0 : 40}px)`,
            transition: "all 0.7s ease",
          }}
        >
          <FeatureCard icon="comment-dots" title="Real-time Chat" color="#0066CC" />
          <FeatureCard icon="users" title="Team Collaboration" color="#0099FF" />
          <FeatureCard icon="lock" title="Secure" color="#0066CC" />
          <FeatureCard icon="bell" title="Notifications" color="#0099FF" />
        </div>

        <button
          style={{
            backgroundColor: "#0066CC",
            color: "white",
            border: "none",
            padding: "14px 30px",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            cursor: "pointer",
            transition: "box-shadow 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            opacity: isAnimating ? 1 : 0,
            transform: `translateY(${isAnimating ? 0 : 20}px)`,
          }}
          onClick={() => navigate("/login")}

          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)")
          }
        >
          Get Started <span style={{ fontSize: "20px" }}>→</span>
        </button>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(30px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(-30px); }
          50% { transform: translateY(30px); }
        }
      `}</style>
    </div>
  );
}
