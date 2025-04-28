import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";

import { 
  FaEdit, 
  FaPlus, 
  FaTimes, 
  FaMapMarkerAlt,
  FaRocket, 
  FaCog,
  FaRoad,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaHourglassHalf
} from 'react-icons/fa';
import { BsKanban, BsGraphUp } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const DEFAULT_WORKFLOW = [
  {
    id: 1,
    title: "Research & Planning",
    description: "Initial research and project planning phase",
    duration: "2 weeks",
    color: "#FF4B6E",
    tasks: [
      { id: 1, name: "Market Research", done: true },
      { id: 2, name: "Competitor Analysis", done: true },
      { id: 3, name: "Project Timeline", done: true }
    ]
  },
  {
    id: 2,
    title: "Design Phase",
    description: "UI/UX design and prototyping",
    duration: "3 weeks",
    color: "#00BFA6",
    tasks: [
      { id: 1, name: "Wireframes", done: true },
      { id: 2, name: "UI Design", done: true },
      { id: 3, name: "Prototyping", done: false }
    ]
  },
  {
    id: 3,
    title: "Development",
    description: "Core development and implementation",
    duration: "6 weeks",
    color: "#00BFA6",
    tasks: [
      { id: 1, name: "Frontend Setup", done: true },
      { id: 2, name: "Backend Development", done: false },
      { id: 3, name: "API Integration", done: false }
    ]
  },
  {
    id: 4,
    title: "Testing",
    description: "QA and bug fixes",
    duration: "2 weeks",
    color: "#FF8A48",
    tasks: [
      { id: 1, name: "Unit Testing", done: false },
      { id: 2, name: "Integration Testing", done: false },
      { id: 3, name: "User Testing", done: false }
    ]
  }
];

const menuItems = [
  { 
    id: 'planning', 
    label: 'PLANNING', 
    items: [
      { id: 'roadmap', label: 'Roadmap', icon: FaRoad, active: true },
      { id: 'backlog', label: 'Backlog', icon: FaClipboardList },
      { id: 'board', label: 'Board', icon: BsKanban },
      { id: 'reports', label: 'Reports', icon: BsGraphUp },
      { id: 'issues', label: 'Issues', icon: FaExclamationTriangle },
    ]
  }
];

const Roadmap = () => {
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState(DEFAULT_WORKFLOW);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [companyName, setCompanyName] = useState("Loading...");
  const [hoveredItem, setHoveredItem] = useState(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [addingTaskToId, setAddingTaskToId] = useState(null);

  // Animation on mount
  useEffect(() => {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }, []);

  const getStatus = (tasks) => {
    if (!tasks.length) return "pending";
    const completedTasks = tasks.filter(t => t.done).length;
    if (completedTasks === 0) return "pending";
    if (completedTasks === tasks.length) return "completed";
    return "in-progress";
  };

  const getProgress = (tasks) => {
    if (!tasks.length) return 0;
    return (tasks.filter(t => t.done).length / tasks.length) * 100;
  };

  const toggleTask = (phaseId, taskId) => {
    setWorkflow(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.map(task => 
            task.id === taskId ? { ...task, done: !task.done } : task
          )
        };
      }
      return phase;
    }));
  };

  const addNewTask = (phaseId) => {
    if (!newTaskText.trim()) return;
    
    setWorkflow(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        const newTask = {
          id: Math.max(0, ...phase.tasks.map(t => t.id)) + 1,
          name: newTaskText.trim(),
          done: false
        };
        return {
          ...phase,
          tasks: [...phase.tasks, newTask]
        };
      }
      return phase;
    }));
    
    setNewTaskText("");
    setAddingTaskToId(null);
  };

  const deleteTask = (phaseId, taskId) => {
    setWorkflow(prev => prev.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.filter(task => task.id !== taskId)
        };
      }
      return phase;
    }));
  };

  const Sidebar = () => (
    <div style={{
      width: '300px',
      backgroundColor: '#1a1a1a',
      height: '100vh',
      padding: '20px 0',
      borderRight: '1px solid #333',
      flexShrink: 0,
    }}>
      {/* Project Header */}
      <div style={{
        padding: '0 20px 20px',
        borderBottom: '1px solid #333',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '4px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#2563eb',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
          }}>
            <FaRocket size={18} />
          </div>
          <div>
            <div style={{
              fontWeight: '500',
              color: 'white',
            }}>Beyond Gravity</div>
            <div style={{
              fontSize: '12px',
              color: '#888',
            }}>Software project</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ marginTop: '20px' }}>
        {menuItems.map(section => (
          <div key={section.id} style={{ marginBottom: '24px' }}>
            <div style={{
              padding: '0 20px',
              marginBottom: '12px',
              fontSize: '12px',
              color: '#888',
              fontWeight: '500',
            }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'board') {
                      navigate('/');
                    }
                  }}
                  style={{
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: item.active ? 'white' : '#888',
                    backgroundColor: item.active ? '#2563eb' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = '#222';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!item.active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <IconComponent size={16} />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Project Settings */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '350px',
        borderTop: '1px solid #333',
        padding: '12px 20px',
      }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#888',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#888';
          }}
        >
          <FaCog size={16} />
          Project settings
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout hideMainSidebar>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          backgroundColor: "#111",
          minHeight: "100vh",
          padding: "24px",
          color: "white"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "48px"
          }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "500", marginBottom: "8px" }}>Project Roadmap</h1>
              <p style={{ color: "#888", fontSize: "14px" }}>Track your project's progress and milestones</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "4px",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaPlus size={14} />
              Add Phase
            </button>
          </div>

          {/* Timeline View */}
          <div style={{ 
            position: "relative",
            padding: "40px 0",
            marginTop: "60px"
          }}>
            {/* Timeline Line with Progress */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              height: "2px",
              backgroundColor: "#333",
              transform: "translateY(-50%)",
              zIndex: 1
            }}>
              <div style={{
                height: "100%",
                width: `${workflow.reduce((acc, curr) => 
                  acc + (getStatus(curr.tasks) === 'completed' ? 1 : 0), 0) 
                  / workflow.length * 100}%`,
                backgroundColor: "#2563eb",
                transition: "width 0.5s ease-in-out"
              }} />
            </div>

            {/* Timeline Items */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2
            }}>
              {workflow.map((item) => {
                const status = getStatus(item.tasks);
                const progress = getProgress(item.tasks);
                
                return (
                  <div 
                    key={item.id} 
                    className="timeline-item"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "250px",
                      opacity: 0,
                      transform: 'translateY(20px)',
                      transition: 'all 0.5s ease-out'
                    }}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Progress Circle */}
                    <div style={{
                      width: "60px",
                      height: "60px",
                      position: "relative",
                      marginBottom: "20px"
                    }}>
                      {/* Progress Ring */}
                      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          stroke="#333"
                          strokeWidth="5"
                          fill="none"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r="25"
                          stroke={item.color}
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 25}
                          strokeDashoffset={2 * Math.PI * 25 * (1 - progress / 100)}
                          style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                        />
                      </svg>
                      
                      {/* Number */}
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        backgroundColor: item.color,
                        borderRadius: "50%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "18px"
                      }}>
                        {String(item.id).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Content Bubble */}
                    <div style={{
                      backgroundColor: "#1a1a1a",
                      borderRadius: "12px",
                      padding: "16px",
                      width: "220px",
                      marginTop: "20px",
                      position: "relative",
                      border: `1px solid ${item.color}40`,
                      transform: hoveredItem === item.id ? 'translateY(-5px)' : 'translateY(0)',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: hoveredItem === item.id ? `0 4px 12px ${item.color}20` : 'none'
                    }}>
                      <h3 style={{ 
                        fontSize: "16px", 
                        fontWeight: "500",
                        marginBottom: "8px",
                        color: item.color
                      }}>
                        {item.title}
                      </h3>
                      <p style={{ 
                        color: "#888", 
                        fontSize: "14px",
                        marginBottom: "12px" 
                      }}>
                        {item.description}
                      </p>

                      {/* Tasks List */}
                      <div style={{ marginBottom: "12px" }}>
                        {item.tasks.map((task) => (
                          <div 
                            key={task.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              marginBottom: "8px"
                            }}
                          >
                            <div
                              onClick={() => toggleTask(item.id, task.id)}
                              style={{
                                width: "16px",
                                height: "16px",
                                borderRadius: "4px",
                                border: `1px solid ${task.done ? item.color : '#666'}`,
                                backgroundColor: task.done ? item.color : 'transparent',
                                cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "10px"
                              }}
                            >
                              {task.done && <FaCheck />}
                            </div>
                            <span style={{
                              color: task.done ? "#666" : "#888",
                              textDecoration: task.done ? "line-through" : "none",
                              fontSize: "14px",
                              flex: 1
                            }}>
                              {task.name}
                            </span>
                            <button
                              onClick={() => deleteTask(item.id, task.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#666",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0.5,
                                transition: "opacity 0.2s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = 1}
                              onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}

                        {/* Add Task Input */}
                        {addingTaskToId === item.id ? (
                          <div style={{
                            display: "flex",
                            gap: "8px",
                            marginTop: "8px"
                          }}>
                            <input
                              type="text"
                              value={newTaskText}
                              onChange={(e) => setNewTaskText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  addNewTask(item.id);
                                }
                              }}
                              placeholder="New task..."
                              style={{
                                flex: 1,
                                background: "#333",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                color: "white",
                                fontSize: "14px"
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => addNewTask(item.id)}
                              style={{
                                background: item.color,
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                color: "white",
                                cursor: "pointer"
                              }}
                            >
                              Add
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingTaskToId(item.id)}
                            style={{
                              background: "none",
                              border: "none",
                              color: item.color,
                              cursor: "pointer",
                              padding: "4px 0",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              opacity: 0.8,
                              transition: "opacity 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
                          >
                            <FaPlus size={12} />
                            Add Task
                          </button>
                        )}
                      </div>

                      <div style={{ 
                        color: "#666", 
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #333",
                        paddingTop: "12px"
                      }}>
                        <span>{item.duration}</span>
                        <span>{Math.round(progress)}% Complete</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}>
              <div style={{
                backgroundColor: "#222",
                borderRadius: "8px",
                padding: "24px",
                width: "500px"
              }}>
                <h2 style={{ marginBottom: "16px" }}>
                  {editingItem ? "Edit Phase" : "Add New Phase"}
                </h2>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>Title</label>
                  <input
                    type="text"
                    value={editingItem?.title || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, title: e.target.value });
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>Description</label>
                  <textarea
                    value={editingItem?.description || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, description: e.target.value });
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white",
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>Duration</label>
                  <input
                    type="text"
                    value={editingItem?.duration || ""}
                    onChange={(e) => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, duration: e.target.value });
                      }
                    }}
                    placeholder="e.g., 2 weeks"
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white"
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditingItem(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#333",
                      border: "1px solid #444",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (editingItem) {
                        setWorkflow(prev => prev.map(item => 
                          item.id === editingItem.id ? editingItem : item
                        ));
                      }
                      setIsEditing(false);
                      setEditingItem(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#2563eb",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    {editingItem ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Roadmap;
