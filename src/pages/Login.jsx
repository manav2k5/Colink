import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    // Save the email in localStorage for later
    localStorage.setItem("email", email);
    navigate("/start");
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login/google";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "white",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "600px",
          height: "800px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
        }}
      >
        {/* App Icon */}
        <div style={{ fontSize: "50px", marginBottom: "10px" }}>📱</div>

        {/* Main Title */}
        <h1 style={{
          fontSize: "28px", fontWeight: "bold", textAlign: "center", padding: "0 40px", marginBottom: "10px"
        }}>
          First of all, enter your email address
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "16px", color: "gray", textAlign: "center", padding: "0 40px", marginBottom: "20px"
        }}>
          We suggest using the email address that you use at work.
        </p>

        {/* Email Input */}
        <input
          type="email"
          value={email}
          placeholder="name@work-email.com"
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "350px", padding: "12px 16px", borderRadius: "6px", border: "1px solid #ccc",
            fontSize: "16px", marginBottom: "20px"
          }}
        />

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: "350px", height: "50px", backgroundColor: "purple", color: "white",
            border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "16px", cursor: "pointer",
            marginBottom: "30px"
          }}
        >
          Continue
        </button>

        {/* OR Divider */}
        <div style={{
          display: "flex", alignItems: "center", width: "350px",
          marginBottom: "20px", color: "gray"
        }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "gray" }} />
          <span style={{ margin: "0 10px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "gray" }} />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "350px", height: "50px", backgroundColor: "#eee", border: "none",
            borderRadius: "8px", marginBottom: "15px", fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
          }}
        >
          🌐 Continue with Google
        </button>

        {/* Apple Button (Optional) */}
        <button
          style={{
            width: "350px", height: "50px", backgroundColor: "#eee", border: "none",
            borderRadius: "8px", fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
          }}
        >
          🍎 Continue with Apple
        </button>
      </div>
    </div>
  );
}
