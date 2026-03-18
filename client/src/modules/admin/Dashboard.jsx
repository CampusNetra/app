import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
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
    { label: 'TOTAL STUDENTS', value: stats.totalStudents, change: '+2.5%', isPositive: true },
    { label: 'TOTAL FACULTY', value: stats.totalFaculty, change: 'Stable', isPositive: null },
    { label: 'ACTIVE SECTIONS', value: stats.activeSections, change: null, isPositive: null },
    { label: 'TOTAL CHANNELS', value: stats.totalChannels, change: '+12%', isPositive: true },
    { label: 'MESSAGES TODAY', value: stats.messagesToday, change: '+18%', isPositive: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening at your campus today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">{card.value.toLocaleString()}</p>
              {card.change && (
                <span className={`text-xs font-medium ${card.isPositive ? 'text-green-600' : 'text-slate-400'}`}>
                  {card.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 text-base">Recent Announcements</h2>
              <button className="text-xs font-medium text-primary hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Subject</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Channel</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">Date</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Reach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {announcements.length > 0 ? announcements.map((ann, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{ann.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{ann.channel_name}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(ann.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 text-right">{(ann.reach || 0).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-slate-400 italic text-sm">No announcements found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 text-base">User Activity</h2>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[350px] custom-scrollbar">
              {activity.length > 0 ? activity.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.type === 'user' ? 'bg-primary' : 'bg-red-500'}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      <span className="font-bold">{act.detail}</span> {act.action} {act.role ? `as ${act.role}` : ''}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 text-sm">No recent activity.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 text-sm">System Status</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-green-600">Healthy</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Server Load</span>
                  <span>14%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-slate-900 h-1.5 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Database Latency</span>
                  <span>24ms</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
