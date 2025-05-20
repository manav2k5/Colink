import React, { useState, useEffect } from "react";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import { 
  FaRocket, 
  FaRoad, 
  FaClipboardList, 
  FaChartBar, 
  FaExclamationTriangle,
  FaCog,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaColumns
} from "react-icons/fa";
import { 
  BsKanban, 
  BsGraphUp,
  BsArrowLeftRight
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const menuItems = [
  { 
    id: 'planning', 
    label: 'PLANNING', 
    items: [
      { id: 'roadmap', label: 'Roadmap', icon: FaRoad, path: '/roadmap' },
      { id: 'backlog', label: 'Backlog', icon: FaClipboardList, path: '/backlog' },
      { id: 'board', label: 'Board', icon: BsKanban, path: '/kanbanboard' },
      { id: 'reports', label: 'Reports', icon: BsGraphUp, active: true, path: '/reports' },
      { id: 'issues', label: 'Issues', icon: FaExclamationTriangle, path: '/issues' },
    ]
  },
];

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [companyName, setCompanyName] = useState("Loading...");
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  // Sample data - replace with actual API data
  const completionData = [
    { date: '2024-03-01', completed: 5, total: 10 },
    { date: '2024-03-02', completed: 8, total: 12 },
    { date: '2024-03-03', completed: 6, total: 8 },
    { date: '2024-03-04', completed: 9, total: 15 },
    { date: '2024-03-05', completed: 7, total: 11 },
  ];

  const labelData = [
    { name: 'BUG', value: 15 },
    { name: 'FEATURE', value: 25 },
    { name: 'UI', value: 10 },
    { name: 'API', value: 20 },
    { name: 'DOCS', value: 5 },
  ];

  const assigneeData = [
    { name: 'Alwin', tasks: 12, maxTasks: 15 },
    { name: 'Manav', tasks: 18, maxTasks: 15 },
    { name: 'Vedanta', tasks: 8, maxTasks: 15 },
    { name: 'Shahriyar', tasks: 15, maxTasks: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-reports", {
          credentials: "include"
        });
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
                    if (item.path) {
                      navigate(item.path);
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
                    transition: 'all 0.2s ease',
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

  const FilterBar = () => (
    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaCalendarAlt color="#888" />
        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          style={{
            backgroundColor: '#333',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '4px 8px',
            color: 'white'
          }}
        />
        <span style={{ color: '#888' }}>to</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          style={{
            backgroundColor: '#333',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '4px 8px',
            color: 'white'
          }}
        />
      </div>
      <select
        value={selectedAssignee}
        onChange={(e) => setSelectedAssignee(e.target.value)}
        style={{
          backgroundColor: '#333',
          border: '1px solid #444',
          borderRadius: '4px',
          padding: '4px 8px',
          color: 'white'
        }}
      >
        <option value="">All Assignees</option>
        <option value="manav">Manav</option>
        <option value="vedanta">Vedanta</option>
      </select>
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        style={{
          backgroundColor: '#333',
          border: '1px solid #444',
          borderRadius: '4px',
          padding: '4px 8px',
          color: 'white'
        }}
      >
        <option value="">All Columns</option>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        onClick={() => {/* Handle export */}}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4FC3F7',
          color: 'black',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginLeft: 'auto'
        }}
      >
        <FaDownload />
        Export Report
      </button>
    </div>
  );

  return (
    <MainLayout hideMainSidebar>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{
          flex: 1,
          padding: "24px",
          height: "100%",
          backgroundColor: "#1a1a1a",
          color: "white",
          overflowY: 'auto'
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h1 style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#fff",
              margin: 0
            }}>
              Reports Dashboard
            </h1>
          </div>

          <FilterBar />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Completion Rate */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#4FC3F7' }}>Completion Rate</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="completed" stroke="#4FC3F7" />
                    <Line type="monotone" dataKey="total" stroke="#FF9800" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Label Distribution */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#4FC3F7' }}>Label Distribution</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={labelData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {labelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assignee Breakdown */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              gridColumn: 'span 2'
            }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#4FC3F7' }}>Assignee Breakdown</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assigneeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333',
                        color: 'white'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="tasks" fill="#4FC3F7" />
                    <Bar dataKey="maxTasks" fill="#FF9800" opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Task Aging Section */}
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#4FC3F7' }}>Task Aging</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {['To Do', 'In Progress', 'In Review'].map(column => (
                <div key={column} style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  padding: '16px'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#888' }}>{column}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px'
                      }}>
                        <span>Task {i}</span>
                        <span style={{ color: '#FF9800' }}>{7 + i} days</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 