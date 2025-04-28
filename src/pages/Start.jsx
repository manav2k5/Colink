import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Start() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [userEmail, setUserEmail] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 100);

    // fetch logged-in user's email
    fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUserEmail(data.email || "Unknown"))
      .catch(() => setUserEmail("Unknown"));
  }, []);


  const ImageUploadCard = ({ index }) => {
    const [hovered, setHovered] = useState(false);
    const isSelected = selectedImageIndex === index;

    return (
      <button
        onClick={() => setSelectedImageIndex(index)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${
            isSelected || hovered ? "rgba(0,153,255,0.8)" : "rgba(0,153,255,0.3)"
          }`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          boxShadow: hovered
            ? "0 5px 10px rgba(0,102,204,0.3)"
            : "0 0 0 rgba(0,0,0,0)",
          cursor: "pointer",
          color: "#ccc",
        }}
      >
        <div style={{ fontSize: "26px", color: "deepskyblue" }}>🖼</div>
        <div style={{ fontSize: "12px", marginTop: "5px" }}>Insert Image</div>
      </button>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #000000, #0A0A0A, rgba(0,102,204,0.3))",
        color: "white",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "40px",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "bold",
            background: "linear-gradient(to right, #0066CC, #0099FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: `translateY(${isAnimating ? 0 : -30}px)`,
            opacity: isAnimating ? 1 : 0,
            transition: "all 0.7s ease",
          }}
        >
          CoLink
        </h1>

        {/* Confirmed Email */}
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "rgba(255,255,255,0.05)",
            padding: "16px",
            borderRadius: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(0,153,255,0.3)",
            transform: `translateY(${isAnimating ? 0 : 30}px)`,
            opacity: isAnimating ? 1 : 0,
            transition: "all 0.7s ease",
          }}
        >
          <span style={{ color: "gray" }}>
            Confirmed as{" "}
            <strong
              style={{
                background: "linear-gradient(to right, #0066CC, #0099FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {userEmail}
            </strong>
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#0099FF",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Change
          </button>
        </div>

        {/* Info */}
        <div style={{ textAlign: "center", maxWidth: "700px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>
            Create a new <br /> CoLink workspace
          </h2>
          <p style={{ color: "gray", fontSize: "15px", marginTop: "10px" }}>
            CoLink gives your team a home – a place where they can talk and work together.
            To create a new workspace, click on the button below.
          </p>
        </div>

        {/* Image Grid */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {[0, 1, 2].map((i) => (
            <ImageUploadCard key={i} index={i} />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/company")}
          style={{
            marginTop: "20px",
            width: "300px",
            height: "56px",
            borderRadius: "28px",
            background: "linear-gradient(to right, #0066CC, #0099FF)",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            boxShadow: "0 5px 10px rgba(0,102,204,0.5)",
            transition: "transform 0.3s ease",
            cursor: "pointer",
          }}
        >
          Create a workspace →
        </button>

        {/* Terms */}
        <p
          style={{
            fontSize: "12px",
            color: "gray",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: "1.4",
            marginTop: "20px",
          }}
        >
          By continuing, you're agreeing to our main services agreement, user terms of service and
          CoLink supplemental Terms. Additional disclosures are available in our privacy policy and cookie policy.
        </p>
      </div>

      {/* Animation Keyframes */}
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
