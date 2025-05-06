import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceLogo, setWorkspaceLogo] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/get-current-user", { withCredentials: true });
      const data = res.data;
      setWorkspaceName(data.company_name || "");
      setUserName(data.name || "");
      setUserEmail(data.email || "");
      setProfilePhoto(data.profile_photo || ""); // Optional if you store photo URL later
    } catch (err) {
      console.error("Failed to fetch user details", err);
    }
  };

  const updateUserName = async () => {
    if (!userName.trim()) return;
    try {
      await axios.post("http://127.0.0.1:5000/save-user-details", {
        email: userEmail,
        profile: userName,
      }, { withCredentials: true });
    } catch (err) {
      console.error("Failed to save user name", err);
    }
  };

  // For now, we won't handle real image upload (just basic profile photo management)
  const handleNext = async () => {
    await updateUserName(); // Make sure name is saved before moving forward
    navigate("/project");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "black", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#000", padding: "20px" }}>
        {workspaceName && (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "purple",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              {workspaceName}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ color: "gray", fontSize: "12px" }}>Step 2 of 5</div>
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>What’s your name?</h2>
        <p style={{ color: "gray", marginBottom: "20px" }}>
          Adding your name and profile photo helps your teammates recognize you better.
        </p>

        <input
          type="text"
          value={userName}
          placeholder="Enter your name"
          onChange={(e) => setUserName(e.target.value)}
          onBlur={updateUserName}
          style={{
            padding: "12px",
            width: "100%",
            backgroundColor: "#1a1a1a",
            border: "none",
            borderRadius: "5px",
            color: "white",
            marginBottom: "20px",
          }}
        />

        <div style={{ color: "gray", fontSize: "14px", marginBottom: "8px" }}>
          Your profile photo (auto-fetched from Google)
        </div>

        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "gray",
              opacity: 0.5,
              borderRadius: "50%",
            }}
          />
        )}

        <button
          onClick={handleNext}
          disabled={!userName || isLoading}
          style={{
            marginTop: "30px",
            width: "200px",
            padding: "14px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: userName ? "pointer" : "not-allowed",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
