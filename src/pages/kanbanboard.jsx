// pages/KanbanBoard.jsx

import React, { useState } from "react";
import MainLayout from "../components/MainLayout";
import { 
  FaRocket, 
  FaRoad, 
  FaClipboardList, 
  FaChartBar, 
  FaExclamationTriangle,
  FaCog,
  FaEdit,
  FaPlus,
  FaTimes,
  FaArrowRight
} from "react-icons/fa";
import { 
  BsKanban, 
  BsGraphUp
} from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const INITIAL_COLUMNS = {
  "TO DO": [],
  "IN PROGRESS": [],
  "IN REVIEW": [],
  "DONE": []
};

const DEFAULT_LABELS = {
  BILLING: "#007FFF",
  ACCOUNTS: "#28A745",
  FORMS: "#6C757D",
  FEEDBACK: "#FFC107",
  BUG: "#DC3545",
  FEATURE: "#6610F2",
  UI: "#E83E8C",
  API: "#FD7E14",
  SECURITY: "#20C997",
  PERFORMANCE: "#6F42C1",
  DOCUMENTATION: "#17A2B8"
};

const menuItems = [
  { 
    id: 'planning', 
    label: 'PLANNING', 
    items: [
      { id: 'roadmap', label: 'Roadmap', icon: FaRoad },
      { id: 'backlog', label: 'Backlog', icon: FaClipboardList },
      { id: 'board', label: 'Board', icon: BsKanban, active: true },
      { id: 'reports', label: 'Reports', icon: BsGraphUp },
      { id: 'issues', label: 'Issues', icon: FaExclamationTriangle },
    ]
  },
  
];

const KanbanBoard = () => {
  const [tasks, setTasks] = useState(INITIAL_COLUMNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [companyName, setCompanyName] = useState("Loading...");
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#007FFF" });
  const [newTask, setNewTask] = useState({
    id: "",
    title: "",
    labels: [],
    assignee: ""
  });
  const navigate = useNavigate();

  const handleAddTask = (column) => {
    setSelectedColumn(column);
    setNewTask({
      id: `NUC-${Math.floor(Math.random() * 1000)}`,
      title: "",
      labels: [],
      assignee: ""
    });
    setIsModalOpen(true);
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (newTask.title.trim() === "" || newTask.id.trim() === "") return;

    setTasks(prev => ({
      ...prev,
      [selectedColumn]: [...prev[selectedColumn], newTask]
    }));
    setIsModalOpen(false);
    setNewTask({
      id: "",
      title: "",
      labels: [],
      assignee: ""
    });
  };

  const toggleLabel = (label) => {
    setNewTask(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...prev.labels, label]
    }));
  };

  const handleAddLabel = () => {
    if (newLabel.name.trim() === "") return;
    setLabels(prev => ({
      ...prev,
      [newLabel.name.toUpperCase()]: newLabel.color
    }));
    setNewLabel({ name: "", color: "#007FFF" });
  };

  const handleDeleteLabel = (labelToDelete) => {
    const { [labelToDelete]: _, ...remainingLabels } = labels;
    setLabels(remainingLabels);
    // Remove the deleted label from any tasks that have it
    Object.keys(tasks).forEach(column => {
      setTasks(prev => ({
        ...prev,
        [column]: prev[column].map(task => ({
          ...task,
          labels: task.labels.filter(label => label !== labelToDelete)
        }))
      }));
    });
  };

  const handleEditLabel = (oldLabel, newName, newColor) => {
    const { [oldLabel]: oldColor, ...rest } = labels;
    setLabels({
      ...rest,
      [newName.toUpperCase()]: newColor
    });
    // Update the label in all tasks
    Object.keys(tasks).forEach(column => {
      setTasks(prev => ({
        ...prev,
        [column]: prev[column].map(task => ({
          ...task,
          labels: task.labels.map(label => 
            label === oldLabel ? newName.toUpperCase() : label
          )
        }))
      }));
    });
  };

  const moveTaskForward = (taskId, currentColumn) => {
    const columnOrder = ["TO DO", "IN PROGRESS", "IN REVIEW", "DONE"];
    const currentIndex = columnOrder.indexOf(currentColumn);
    
    if (currentIndex < columnOrder.length - 1) {
      const nextColumn = columnOrder[currentIndex + 1];
      const taskToMove = tasks[currentColumn].find(task => task.id === taskId);
      
      setTasks(prev => ({
        ...prev,
        [currentColumn]: prev[currentColumn].filter(task => task.id !== taskId),
        [nextColumn]: [...prev[nextColumn], taskToMove]
      }));
    }
  };

  const Sidebar = () => (
    <div style={{
      width: '350px',
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

      {/* Updated Navigation Menu */}
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
                    if (item.id === 'roadmap') {
                      navigate('/roadmap');
                    } else if (item.id === 'reports') {
                      navigate('/reports');
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
        <div className="kanban-container" style={{
          backgroundColor: "#111",
        color: "white",
        minHeight: "100vh",
          flex: 1,
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 24px",
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#888" }}>Projects</span>
                <span style={{ color: "#888" }}>/</span>
                <span>Beyond Gravity</span>
              </div>
              <h1 style={{ fontSize: "24px", fontWeight: "500" }}>Board</h1>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>GROUP BY</span>
                <select style={{
                  backgroundColor: "#222",
                  color: "white",
                  border: "1px solid #444",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  <option>None</option>
                </select>
              </div>
              <button style={{
                backgroundColor: "#222",
                color: "white",
                border: "1px solid #444",
                padding: "4px 12px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                Insights
              </button>
            </div>
          </div>

          {/* Updated Board */}
          <div style={{
            padding: "24px",
            display: "flex",
            gap: "24px",
        overflowX: "auto"
      }}>
          {Object.entries(tasks).map(([column, items]) => (
            <div key={column} style={{
                minWidth: "300px",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
                padding: "16px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "500" }}>{column}</span>
                    <span style={{
                      backgroundColor: "#333",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "12px"
                    }}>{items.length}</span>
                  </div>
                  <button
                    onClick={() => handleAddTask(column)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "20px"
                    }}
                  >
                    +
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {items.map((task) => (
                    <div key={task.id} style={{
                      backgroundColor: "#222",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor: "pointer",
                      position: "relative",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateX(4px)"
                      }
                    }}>
                      <div style={{ marginBottom: "8px" }}>
                        {task.labels.map((label) => (
                          <span key={label} style={{
                            backgroundColor: labels[label],
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            marginRight: "4px"
                          }}>
                            {label}
                          </span>
                        ))}
                      </div>
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "flex-start" 
                      }}>
                        <div>
                          <div style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}>{task.id}</div>
                          <div style={{ fontSize: "14px" }}>{task.title}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            backgroundColor: "#333",
                            flexShrink: 0
                          }}></div>
                          {column !== "DONE" && (
                            <button
                              onClick={() => moveTaskForward(task.id, column)}
                              style={{
                                backgroundColor: "#2563eb",
                                border: "none",
                                borderRadius: "4px",
                                color: "white",
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  backgroundColor: "#1d4ed8",
                                  transform: "scale(1.05)"
                                }
                              }}
                            >
                              <FaArrowRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Updated Add Task Modal */}
          {isModalOpen && (
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
                width: "500px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "16px"
              }}>
                  <h2>Add New Task</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditingLabels(!isEditingLabels)}
                    style={{
                      padding: "4px 8px",
                      backgroundColor: isEditingLabels ? "#007FFF" : "#333",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px"
                    }}
                  >
                    <FaEdit size={12} />
                    {isEditingLabels ? "Done Editing" : "Edit Labels"}
                  </button>
                </div>

                {isEditingLabels ? (
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ marginBottom: "12px" }}>Manage Labels</h3>
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ 
                        display: "flex", 
                        gap: "8px",
                        marginBottom: "12px"
                      }}>
                        <input
                          type="text"
                          value={newLabel.name}
                          onChange={(e) => setNewLabel(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="New label name"
                          style={{
                            flex: 1,
                            padding: "8px",
                            backgroundColor: "#333",
                            border: "1px solid #444",
                            borderRadius: "4px",
                            color: "white"
                          }}
                        />
                        <input
                          type="color"
                          value={newLabel.color}
                          onChange={(e) => setNewLabel(prev => ({ ...prev, color: e.target.value }))}
                          style={{
                            width: "40px",
                            padding: "0",
                            backgroundColor: "#333",
                            border: "1px solid #444",
                            borderRadius: "4px"
                          }}
                        />
                        <button
                          onClick={handleAddLabel}
                          style={{
                            padding: "8px",
                            backgroundColor: "#007FFF",
                            border: "none",
                            borderRadius: "4px",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px"
                      }}>
                        {Object.entries(labels).map(([label, color]) => (
                          <div
                            key={label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 8px",
                              backgroundColor: color,
                              borderRadius: "4px",
                              color: "white",
                              fontSize: "12px"
                            }}
                          >
                            {label}
                            <button
                              onClick={() => handleDeleteLabel(label)}
                              style={{
                                padding: "2px",
                                backgroundColor: "rgba(0,0,0,0.2)",
                                border: "none",
                                borderRadius: "4px",
                                color: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTask}>
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", marginBottom: "8px" }}>Task ID</label>
                      <input
                        type="text"
                        value={newTask.id}
                        onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
                        placeholder="e.g., NUC-123"
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
                      <label style={{ display: "block", marginBottom: "8px" }}>Title</label>
                      <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                      <label style={{ display: "block", marginBottom: "8px" }}>Labels</label>
                      <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}>
                        {Object.entries(labels).map(([label, color]) => (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleLabel(label)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: newTask.labels.includes(label) ? color : "#333",
                              border: `1px solid ${newTask.labels.includes(label) ? color : "#444"}`,
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              opacity: newTask.labels.includes(label) ? 1 : 0.7,
                              transition: "all 0.2s ease",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
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
                        type="submit"
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#007FFF",
                          border: "none",
                          borderRadius: "4px",
                          color: "white",
                          cursor: "pointer",
                          opacity: newTask.title.trim() === "" || newTask.id.trim() === "" ? 0.7 : 1,
                        }}
                        disabled={newTask.title.trim() === "" || newTask.id.trim() === ""}
                      >
                        Add Task
                      </button>
                    </div>
                  </form>
                )}
                  </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default KanbanBoard;
