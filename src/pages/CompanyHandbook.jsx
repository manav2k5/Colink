import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { FaLink, FaMountain, FaCalendarAlt, FaUsers, FaUserAlt, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CompanyHandbook() {
  const navigate = useNavigate();
  const companyName = "xoxo";
  const navButtons = [
    { icon: <FaLink />, label: "messages", to: "/homepage1" },
    { icon: <FaLink />, label: "Company handbook >", to: "#" },
    { label: "+", to: "#" }
  ];

  const [milestones, setMilestones] = useState([
    { text: "Add a milestone...", checked: false },
    { text: "Add a milestone...", checked: false },
    { text: "Add a milestone...", checked: false }
  ]);

  const handleInputChange = (index, value) => {
    const updated = [...milestones];
    updated[index].text = value;
    setMilestones(updated);
  };

  const handleCheck = (index) => {
    const updated = [...milestones];
    updated[index].checked = !updated[index].checked;
    setMilestones(updated);
  };

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1a1d21", minWidth: 0, height: "100%" }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "#1a1d21"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
            # all-{companyName}
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            {navButtons.map((btn, i) => (
              <button
                key={i}
                onClick={() => btn.to !== "#" && navigate(btn.to)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ea3a8",
                  fontSize: btn.label === "+" ? "20px" : "14px",
                  cursor: "pointer"
                }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div id="company-handbook-page" style={{
          padding: "32px",
          color: "white",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
          overflowY: "auto",
          height: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>Company handbook</h1>
            <p style={{ color: "#9ea3a8", marginBottom: "32px", textAlign: "center" }}>
              A place to reference company-wide announcements, upcoming events and helpful resources
            </p>

            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLink /> Helpful resources
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in links such as the company policies, onboarding guides, FAQs
              </p>
              <div style={{
                border: "1px dashed #2980b9",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#1a1d21"
              }}>
                <button style={{
                  backgroundColor: "#1f2a37",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}>
                  <FaLink style={{ marginRight: "8px" }} /> Add a link
                </button>
              </div>
            </section>

            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaMountain /> 2024 milestones/Company-wide announcements
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in important dates, product launches, holidays, etc.
              </p>
              {milestones.map((item, index) => (
                <label
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    marginBottom: "8px"
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheck(index)}
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter milestone"
                    style={{
                      flex: 1,
                      backgroundColor: "#1a1d21",
                      color: "#fff",
                      border: "1px solid #333",
                      borderRadius: "4px",
                      padding: "6px 10px",
                      textDecoration: item.checked ? "line-through" : "none"
                    }}
                  />
                </label>
              ))}
            </section>

            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCalendarAlt /> Upcoming events
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in upcoming events such as big launches, happy hours, promotion cut-offs, anniversaries
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "32px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #555" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>When</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Event details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #333" }}>
                    <td style={{ padding: "8px" }}>Event name</td>
                    <td style={{ padding: "8px" }}>Date/Time</td>
                    <td style={{ padding: "8px" }}>Add event details</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUsers /> The team
              </h2>
              <p style={{ fontSize: "14px", color: "#9ea3a8", marginBottom: "16px" }}>
                Your onboarding buddies are here if you have questions about processes, recurring meetings and more.
                Use @ to mention teammates. Then right-click on their display name to change to a card format.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[1, 2, 3].map((_, index) => (
                  <div key={index} style={{
                    width: "250px",
                    height: "130px",
                    border: "1px dashed #2980b9",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                    backgroundColor: "#1a1d21",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <FaUserAlt style={{ fontSize: "24px", marginBottom: "8px" }} />
                    <strong style={{ marginBottom: "4px" }}>Profile</strong>
                    <span style={{ fontSize: "12px", color: "#9ea3a8" }}>Add a profile</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaBook /> New hire welcome documents
              </h2>
              <div style={{
                border: "1px dashed #2980b9",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                backgroundColor: "#1a1d21",
                marginTop: "16px"
              }}>
                <button style={{
                  backgroundColor: "#1f2a37",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaLink /> Add a link
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
