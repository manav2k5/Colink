import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CompanyName() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const storeCompanyName = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/update-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: workspaceName,
          project_type: "default_project", 
        }),
      });

      if (response.status === 201) {
        navigate("/profile");
      } else {
        setErrorMessage(`Failed with status ${response.status}`);
      }
    } catch (error) {
      setErrorMessage("Network error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "200px", backgroundColor: "black", padding: "20px", color: "white" }}>
        {workspaceName && (
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
                marginBottom: "10px",
              }}
            >
              {workspaceName.charAt(0)}
            </div>
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{workspaceName}</div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, backgroundColor: "black", color: "white", padding: "40px" }}>
        <div style={{ maxWidth: "600px" }}>
          <div style={{ color: "gray", fontSize: "12px" }}>Step 1 of 5</div>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginTop: "10px" }}>
            What’s the name of your company or team?
          </h2>
          <p style={{ color: "gray", fontSize: "14px", marginTop: "10px" }}>
            This will be the name of your CoLink workspace – choose something that your team will recognize.
          </p>

          <input
            type="text"
            value={workspaceName}
            placeholder="e.g. A1 or A1 Marketing"
            onChange={(e) => setWorkspaceName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              backgroundColor: "#1a1a1a",
              border: "none",
              borderRadius: "5px",
              color: "white",
              fontSize: "16px",
            }}
          />

          <button
            onClick={storeCompanyName}
            disabled={!workspaceName || isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: workspaceName ? "gray" : "rgba(128,128,128,0.5)",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "20px",
              cursor: workspaceName && !isLoading ? "pointer" : "not-allowed",
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
    </div>
  );
}
