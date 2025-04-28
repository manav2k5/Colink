import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceLogo, setWorkspaceLogo] = useState("");
  const [userName, setUserName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [email] = useState("user@example.com");  // Replace later
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-company");
        const company = await response.json();
        setWorkspaceName(company.name || "");
        setWorkspaceLogo(company.logo || "");
      } catch (err) {
        console.error("Failed to fetch company details", err);
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get-username/${email}`);
        const user = await response.json();
        setUserName(user.name || "");
      } catch (err) {
        console.error("Failed to fetch user name", err);
      }
    };

    fetchCompanyDetails();
    fetchUserName();
  }, [email]);

  const updateUserName = async () => {
    try {
      await fetch("http://127.0.0.1:5000/save-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: userName }),
      });
    } catch (err) {
      console.error("Failed to save username", err);
    }
  };
  

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "black", color: "white" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#000", padding: "20px" }}>
        {workspaceName && (
          <>
            {workspaceLogo ? (
              <img
                src={workspaceLogo}
                alt="Workspace Logo"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            ) : (
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "purple",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                {workspaceName.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>{workspaceName}</div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ color: "gray", fontSize: "12px" }}>Step 2 of 5</div>
        <h2 style={{ fontSize: "28px", fontWeight: "bold" }}>What’s your name?</h2>
        <p style={{ color: "gray", marginBottom: "10px" }}>
          Adding your name and profile photo helps your teammates recognize and connect with you more easily.
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
            marginBottom: "10px",
          }}
        />

        <div style={{ color: "gray", fontSize: "14px", marginBottom: "8px" }}>
          Your profile photo (optional)
        </div>

        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
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
          style={{
            marginTop: "10px",
            width: "150px",
            padding: "10px",
            backgroundColor: "#444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Edit photo
        </button>

        <button
          onClick={() => navigate("/project")}
          style={{
            marginTop: "20px",
            width: "150px",
            padding: "12px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
