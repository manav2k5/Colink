import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProjectType() {
  const [companyName, setCompanyName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get("http://127.0.0.1:5000/get-current-user", { withCredentials: true });
      if (response.status === 200) {
        const userData = response.data;
        setUserEmail(userData.email || "");
        setCompanyName(userData.company_name || "");
        setProjectType(userData.project_type || "");
      } else {
        setErrorMessage("Failed to fetch user details.");
      }
    } catch (error) {
      setErrorMessage("Network error: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const saveProjectType = async () => {
    if (!projectType.trim()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/save-user-details", {
        email: userEmail,
        project_type: projectType
      }, { withCredentials: true });

      if (response.status === 200) {
        navigate("/homepage1");  // ✅ Final step, go to Homepage1
      } else {
        setErrorMessage("Failed to save project type.");
      }
    } catch (error) {
      setErrorMessage("Network error: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "black", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "#000", padding: "20px" }}>
        {companyName && (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "purple",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "20px",
                color: "white",
              }}
            >
              {companyName.charAt(0)}
            </div>
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>{companyName}</div>
            <div style={{ marginTop: "20px", fontSize: "20px" }}>Channel</div>
            {projectType && (
              <div style={{ marginTop: "5px", fontSize: "16px" }}>
                {projectType}
              </div>
            )}
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px" }}>
        <div style={{ color: "gray", fontSize: "12px" }}>Step 3 of 5</div>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginTop: "10px" }}>
          What project are you working on?
        </h2>
        <p style={{ color: "gray", marginBottom: "10px" }}>
          This will be the primary channel in your CoLink workspace where discussions and updates
          about this project will take place.
        </p>

        <input
          type="text"
          value={projectType}
          placeholder="e.g. Website Redesign, Security Audit"
          onChange={(e) => setProjectType(e.target.value)}
          style={{
            padding: "12px",
            width: "100%",
            backgroundColor: "#1a1a1a",
            border: "none",
            borderRadius: "5px",
            color: "white",
            marginBottom: "20px",
            marginTop: "20px",
          }}
        />

        <button
          onClick={saveProjectType}
          disabled={!projectType || isLoading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: projectType ? "gray" : "rgba(128,128,128,0.5)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            cursor: projectType ? "pointer" : "not-allowed",
          }}
        >
          {isLoading ? "Saving..." : "Next"}
        </button>

        {errorMessage && (
          <div style={{ color: "red", fontSize: "12px", marginTop: "10px" }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
