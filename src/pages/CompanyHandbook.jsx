import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { FaLink, FaMountain, FaCalendarAlt, FaUsers, FaUserAlt, FaBook, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CompanyHandbook() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("xoxo");
  const [resources, setResources] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [events, setEvents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [welcomeDocs, setWelcomeDocs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch initial data
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get-current-user", { credentials: "include" });
      if (response.status === 200) {
        const data = await response.json();
        setCompanyName(data.company_name || "xoxo");
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleAddResource = () => {
    const newResource = { title: "", url: "", id: Date.now() };
    setResources([...resources, newResource]);
  };

  const handleAddMilestone = () => {
    const newMilestone = { text: "", checked: false, id: Date.now() };
    setMilestones([...milestones, newMilestone]);
  };

  const handleAddEvent = () => {
    const newEvent = { name: "", when: "", details: "", id: Date.now() };
    setEvents([...events, newEvent]);
  };

  const handleAddTeamMember = () => {
    const newMember = { name: "", role: "", id: Date.now() };
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleAddWelcomeDoc = () => {
    const newDoc = { title: "", url: "", id: Date.now() };
    setWelcomeDocs([...welcomeDocs, newDoc]);
  };

  const handleDeleteItem = (type, id) => {
    switch (type) {
      case 'resource':
        setResources(resources.filter(item => item.id !== id));
        break;
      case 'milestone':
        setMilestones(milestones.filter(item => item.id !== id));
        break;
      case 'event':
        setEvents(events.filter(item => item.id !== id));
        break;
      case 'team':
        setTeamMembers(teamMembers.filter(item => item.id !== id));
        break;
      case 'doc':
        setWelcomeDocs(welcomeDocs.filter(item => item.id !== id));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (type, id, field, value) => {
    switch (type) {
      case 'resource':
        setResources(resources.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
        break;
      case 'milestone':
        setMilestones(milestones.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
        break;
      case 'event':
        setEvents(events.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
        break;
      case 'team':
        setTeamMembers(teamMembers.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
        break;
      case 'doc':
        setWelcomeDocs(welcomeDocs.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        ));
        break;
      default:
        break;
    }
  };

  const handleCheckMilestone = (id) => {
    setMilestones(milestones.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <MainLayout>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#1a1d21", minWidth: 0, height: "100%" }}>
        <div style={{
          padding: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "#1a1d21",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "18px", fontWeight: "600", color: "#e6e6e6", marginBottom: "12px" }}>
              # all-{companyName}
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                onClick={() => navigate("/homepage1")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ea3a8",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <FaLink /> messages
              </button>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#9ea3a8",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <FaLink /> Company handbook
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              background: "#2a2a2a",
              border: "1px solid #444",
              color: "#9ea3a8",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <FaEdit /> {isEditing ? "Done Editing" : "Edit Handbook"}
          </button>
        </div>

        <div id="company-handbook-page" style={{
          padding: "32px",
          color: "white",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
          overflowY: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "8px", textAlign: "center" }}>Company Handbook</h1>
            <p style={{ color: "#9ea3a8", marginBottom: "32px", textAlign: "center" }}>
              A place to reference company-wide announcements, upcoming events and helpful resources
            </p>

            {/* Helpful Resources Section */}
            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaLink /> Helpful resources
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in links such as the company policies, onboarding guides, FAQs
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {resources.map((resource) => (
                  <div key={resource.id} style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px"
                  }}>
                    <input
                      type="text"
                      value={resource.title}
                      onChange={(e) => handleInputChange('resource', resource.id, 'title', e.target.value)}
                      placeholder="Resource title"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    <input
                      type="text"
                      value={resource.url}
                      onChange={(e) => handleInputChange('resource', resource.id, 'url', e.target.value)}
                      placeholder="Resource URL"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteItem('resource', resource.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer"
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={handleAddResource}
                    style={{
                      backgroundColor: "#2a2a2a",
                      color: "white",
                      border: "1px dashed #444",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <FaPlus /> Add Resource
                  </button>
                )}
              </div>
            </section>

            {/* Milestones Section */}
            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaMountain /> 2024 milestones/Company-wide announcements
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in important dates, product launches, holidays, etc.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {milestones.map((milestone) => (
                  <div key={milestone.id} style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px"
                  }}>
                    <input
                      type="checkbox"
                      checked={milestone.checked}
                      onChange={() => handleCheckMilestone(milestone.id)}
                      style={{ cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={milestone.text}
                      onChange={(e) => handleInputChange('milestone', milestone.id, 'text', e.target.value)}
                      placeholder="Enter milestone"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px",
                        textDecoration: milestone.checked ? "line-through" : "none"
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteItem('milestone', milestone.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer"
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={handleAddMilestone}
                    style={{
                      backgroundColor: "#2a2a2a",
                      color: "white",
                      border: "1px dashed #444",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <FaPlus /> Add Milestone
                  </button>
                )}
              </div>
            </section>

            {/* Events Section */}
            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCalendarAlt /> Upcoming events
              </h2>
              <p style={{ fontStyle: "italic", color: "#9ea3a8", marginBottom: "16px" }}>
                Drop in upcoming events such as big launches, happy hours, promotion cut-offs, anniversaries
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {events.map((event) => (
                  <div key={event.id} style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px"
                  }}>
                    <input
                      type="text"
                      value={event.name}
                      onChange={(e) => handleInputChange('event', event.id, 'name', e.target.value)}
                      placeholder="Event name"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    <input
                      type="text"
                      value={event.when}
                      onChange={(e) => handleInputChange('event', event.id, 'when', e.target.value)}
                      placeholder="Date/Time"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    <input
                      type="text"
                      value={event.details}
                      onChange={(e) => handleInputChange('event', event.id, 'details', e.target.value)}
                      placeholder="Event details"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteItem('event', event.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer"
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={handleAddEvent}
                    style={{
                      backgroundColor: "#2a2a2a",
                      color: "white",
                      border: "1px dashed #444",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <FaPlus /> Add Event
                  </button>
                )}
              </div>
            </section>

            {/* Team Section */}
            <section style={{ marginBottom: "48px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUsers /> The team
              </h2>
              <p style={{ fontSize: "14px", color: "#9ea3a8", marginBottom: "16px" }}>
                Your onboarding buddies are here if you have questions about processes, recurring meetings and more.
                Use @ to mention teammates. Then right-click on their display name to change to a card format.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {teamMembers.map((member) => (
                  <div key={member.id} style={{
                    width: "250px",
                    height: "130px",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#2a2a2a",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                  }}>
                    <FaUserAlt style={{ fontSize: "24px", marginBottom: "8px" }} />
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleInputChange('team', member.id, 'name', e.target.value)}
                      placeholder="Member name"
                      style={{
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px",
                        marginBottom: "4px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    />
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleInputChange('team', member.id, 'role', e.target.value)}
                      placeholder="Role"
                      style={{
                        backgroundColor: "#1a1d21",
                        color: "#9ea3a8",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px",
                        width: "100%",
                        textAlign: "center",
                        fontSize: "12px"
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteItem('team', member.id)}
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer"
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={handleAddTeamMember}
                    style={{
                      width: "250px",
                      height: "130px",
                      border: "1px dashed #444",
                      borderRadius: "8px",
                      padding: "16px",
                      backgroundColor: "#2a2a2a",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer"
                    }}
                  >
                    <FaPlus /> Add Team Member
                  </button>
                )}
              </div>
            </section>

            {/* Welcome Documents Section */}
            <section>
              <h2 style={{ fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaBook /> New hire welcome documents
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {welcomeDocs.map((doc) => (
                  <div key={doc.id} style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: "16px",
                    backgroundColor: "#2a2a2a",
                    borderRadius: "8px"
                  }}>
                    <input
                      type="text"
                      value={doc.title}
                      onChange={(e) => handleInputChange('doc', doc.id, 'title', e.target.value)}
                      placeholder="Document title"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    <input
                      type="text"
                      value={doc.url}
                      onChange={(e) => handleInputChange('doc', doc.id, 'url', e.target.value)}
                      placeholder="Document URL"
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1d21",
                        color: "white",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        padding: "8px"
                      }}
                    />
                    {isEditing && (
                      <button
                        onClick={() => handleDeleteItem('doc', doc.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer"
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={handleAddWelcomeDoc}
                    style={{
                      backgroundColor: "#2a2a2a",
                      color: "white",
                      border: "1px dashed #444",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                  >
                    <FaPlus /> Add Document
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
