import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, UserSquare2, Grid2X2, MessageSquare, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CreateAnnouncementModal from './components/CreateAnnouncementModal';

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    activeSections: 0,
    totalChannels: 0,
    messagesToday: 0
  });
  const [announcements, setAnnouncements] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, annRes, actRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers }),
        axios.get('/api/admin/announcements', { headers }),
        axios.get('/api/admin/activity', { headers })
      ]);

      setStats(statsRes.data);
      setAnnouncements(annRes.data);
      setActivity(actRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'TOTAL STUDENTS', value: stats.totalStudents, change: '+2.5%', icon: Users, color: '#E53935' },
    { label: 'TOTAL FACULTY', value: stats.totalFaculty, change: 'Stable', icon: UserSquare2, color: '#1E88E5' },
    { label: 'ACTIVE SECTIONS', value: stats.activeSections, change: null, icon: Grid2X2, color: '#FB8C00' },
    { label: 'TOTAL CHANNELS', value: stats.totalChannels, change: '+12%', icon: MessageSquare, color: '#1e293b' },
    { label: 'MESSAGES TODAY', value: stats.messagesToday, change: '+18%', icon: TrendingUp, color: '#10b981' },
  ];

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <h2 style={{ color: '#E53935', fontSize: '24px', fontWeight: '800' }}>CampusNetra</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <div className="main-content">
        <Header onOpenModal={() => setIsModalOpen(true)} />
        
        <main className="scroll-area">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Dashboard Overview</h1>
            <p style={{ color: '#64748b', fontSize: '15px' }}>Welcome back, here's what's happening at your campus today.</p>
          </div>

          <div className="stats-grid">
            {statCards.map((card, i) => (
              <div key={i} className="card stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p className="stat-label">{card.label}</p>
                  <div style={{ padding: '10px', background: `${card.color}10`, borderRadius: '12px', color: card.color }}>
                    <card.icon size={20} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span className="stat-value">{card.value.toLocaleString()}</span>
                  {(card.value > 0) && card.change && (
                    <span className={`stat-change ${card.change.includes('+') ? 'status-positive' : 'status-neutral'}`} style={{ marginLeft: '12px' }}>
                      {card.change}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="content-row">
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>Recent Announcements</h3>
                <button style={{ color: '#E53935', fontSize: '12px', fontWeight: '800', border: 'none', background: 'none', cursor: 'pointer' }}>View All</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Channel</th>
                      <th>Date</th>
                      <th>Reach</th>
                    </tr>
                  </thead>
                  <tbody>
                    {announcements.length > 0 ? announcements.map((ann, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: '700', color: '#334155' }}>{ann.title}</td>
                        <td style={{ color: '#64748b' }}>{ann.channel_name}</td>
                        <td style={{ color: '#64748b' }}>{new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td style={{ color: '#64748b', fontWeight: '600' }}>{(ann.reach || 0).toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontStyle: 'italic' }}>No announcements found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>User Activity</h3>
                </div>
                <div className="card-content" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {activity.length > 0 ? activity.map((act, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{ 
                          width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0,
                          background: act.type === 'user' ? '#1E88E5' : '#E53935' 
                        }}></div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: '#334155', margin: 0 }}>
                            <span style={{ fontWeight: '700' }}>{act.detail}</span> {act.action} {act.role ? `as ${act.role}` : ''}
                          </p>
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                            {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>No recent activity.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#1e293b' }}>System Status</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981' }}>HEALTHY</span>
                  </div>
                </div>
                <div className="card-content" style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>
                      <span style={{ color: '#94a3b8' }}>SERVER LOAD</span>
                      <span style={{ color: '#1e293b' }}>14%</span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#E53935', width: '14%', borderRadius: '10px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '800', marginBottom: '10px' }}>
                      <span style={{ color: '#94a3b8' }}>DATABASE LATENCY</span>
                      <span style={{ color: '#1e293b' }}>24MS</span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#1E88E5', width: '24%', borderRadius: '10px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <CreateAnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreated={fetchAllData} 
      />
    </div>
  );
};

export default Dashboard;
