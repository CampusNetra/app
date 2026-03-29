import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  UserSquare2,
  Grid2X2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import AnnouncementModal from "./components/AnnouncementModal";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@campusnetra.com",
    dept_name: "Your Department"
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeSections: 0,
    totalChannels: 0,
    messagesToday: 0,
  });
  const [announcements, setAnnouncements] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch {
        setUser({ name: "Admin User", email: "admin@campusnetra.com", dept_name: "Your Department" });
      }
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, annRes, actRes] = await Promise.all([
        axios.get("/api/admin/stats", { headers }),
        axios.get("/api/admin/announcements", { headers }),
        axios.get("/api/admin/activity", { headers }),
      ]);

      setStats(statsRes.data);
      setAnnouncements(annRes.data);
      setActivity(actRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "TOTAL STUDENTS",
      value: stats.totalStudents,
      icon: Users,
      color: "#E53935",
    },
    {
      label: "TOTAL FACULTY",
      value: stats.totalFaculty,
      icon: UserSquare2,
      color: "#1E88E5",
    },
    {
      label: "ACTIVE SECTIONS",
      value: stats.activeSections,
      icon: Grid2X2,
      color: "#FB8C00",
    },
    {
      label: "TOTAL CHANNELS",
      value: stats.totalChannels,
      icon: MessageSquare,
      color: "#1e293b",
    },
    {
      label: "MESSAGES TODAY",
      value: stats.messagesToday,
      icon: TrendingUp,
      color: "#10b981",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
        }}
      >
        <h2 style={{ color: "#E53935", fontSize: "24px", fontWeight: 800 }}>
          CampusNetra
        </h2>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#fcfdfe",
      }}
    >
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        user={user}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          height: "100vh",
        }}
      >
        <DashboardHeader
          showCreateButton
          onCreateAnnouncement={() => setIsAnnouncementModalOpen(true)}
        />

        <main style={{ flex: 1, overflowY: "auto", padding: "36px 42px" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "38px",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "8px",
                letterSpacing: "-0.03em",
              }}
            >
              Dashboard Overview
            </h1>
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              Welcome back, here's what's happening at your campus today.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6"
            style={{ marginBottom: "28px" }}
          >
            {statCards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#64748b",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {card.label}
                  </p>
                  <div
                    style={{
                      padding: "9px",
                      borderRadius: "12px",
                      color: card.color,
                      background: `${card.color}12`,
                    }}
                  >
                    <card.icon size={18} />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    marginTop: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {card.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div
              className="xl:col-span-2"
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  padding: "16px 18px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 800,
                    color: "#1e293b",
                  }}
                >
                  Recent Announcements
                </h3>
                <button
                  type="button"
                  style={{
                    color: "#E53935",
                    fontSize: "12px",
                    fontWeight: 800,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  View All
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px 18px",
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        Announcement
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px 18px",
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        Channel
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px 18px",
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "12px 18px",
                          color: "#94a3b8",
                          fontSize: "11px",
                        }}
                      >
                        Reach
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length > 0 ? (
                      announcements.map((ann, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "#334155",
                              fontWeight: 700,
                              borderTop: "1px solid #f8fafc",
                            }}
                          >
                            <div style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {ann.title}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "#64748b",
                              borderTop: "1px solid #f8fafc",
                            }}
                          >
                            <span style={{ 
                              padding: "4px 10px", 
                              background: "#f1f5f9", 
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              color: "#475569"
                            }}>
                              {ann.channel_name}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "#64748b",
                              borderTop: "1px solid #f8fafc",
                              fontSize: "13px"
                            }}
                          >
                            {new Date(ann.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td
                            style={{
                              padding: "13px 18px",
                              color: "#64748b",
                              fontWeight: 600,
                              borderTop: "1px solid #f8fafc",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <TrendingUp size={14} className="text-green-500" />
                              {(ann.reach || 0).toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          style={{
                            textAlign: "center",
                            padding: "42px",
                            color: "#94a3b8",
                            fontStyle: "italic",
                          }}
                        >
                          No announcements found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                }}
              >
                <div
                  style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 800,
                      color: "#1e293b",
                    }}
                  >
                    User Activity
                  </h3>
                </div>
                <div
                  style={{
                    padding: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  {activity.length > 0 ? (
                    activity.map((act, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            marginTop: "6px",
                            background:
                              act.type === "user" ? "#1E88E5" : "#E53935",
                          }}
                        />
                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#334155",
                              margin: 0,
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              {act.detail}
                            </span>{" "}
                            {act.action} {act.role ? `as ${act.role}` : ""}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#94a3b8",
                              marginTop: "4px",
                            }}
                          >
                            {new Date(act.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        fontSize: "14px",
                      }}
                    >
                      No recent activity.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <AnnouncementModal
          isOpen={isAnnouncementModalOpen}
          onClose={() => setIsAnnouncementModalOpen(false)}
          onAnnouncementPosted={fetchAllData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
