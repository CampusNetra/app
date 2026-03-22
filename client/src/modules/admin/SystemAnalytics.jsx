import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Zap, 
  Calendar, 
  Eye, 
  MoreHorizontal,
  Loader2,
  RefreshCw,
  Clock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import api from '../../api';

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching analytics for range:', timeRange);
    
    try {
      const [statsRes, announcementsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/announcements')
      ]);
      
      console.log('Stats Response:', statsRes.data);
      console.log('Announcements Response:', announcementsRes.data);
      
      setStats(statsRes.data);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError(err.response?.data?.error || err.message || 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Campus Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 bg-slate-50/50">
        <div className="text-center p-10 bg-white rounded-[2rem] border border-red-100 shadow-xl max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Sync Error</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={fetchAnalytics}
            className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  const generatePath = () => {
    if (!stats?.messageHistory || stats.messageHistory.length === 0) {
      return "M0,80 C100,80 200,80 400,80 L400,100 L0,100 Z";
    }
    
    const data = stats.messageHistory.slice(-7);
    const max = Math.max(...data.map(d => d.count), 1);
    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * 400,
      y: 80 - (d.count / max) * 60
    }));

    let d = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      d += ` C${cp1x},${curr.y} ${cp1x},${next.y} ${next.x},${next.y}`;
    }
    
    const fill = d + ` L400,100 L0,100 Z`;
    const line = d;
    return { fill, line };
  };

  const chartData = generatePath();

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 bg-slate-50/50 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Analytics</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time performance metrics across the campus network.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={fetchAnalytics}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary transition-all shadow-sm active:scale-95"
                title="Refresh Analytics"
            >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <div className="flex items-center gap-1 bg-white p-1.5 border border-slate-200 rounded-2xl shadow-sm">
                {['7days', '30days', '90days'].map(range => (
                    <button 
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${timeRange === range ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                        {range.replace('days', ' Days')}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { label: 'Messages Today', value: stats?.messagesToday || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Active Clubs', value: stats?.totalClubs || 0, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Total Reach', value: stats?.totalMemberships || 0, icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:rotate-12`}>
                   <stat.icon size={22} />
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value.toLocaleString()}</h4>
            </div>
          ))}
        </div>

        {/* Main Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Daily Active Activity - Line Chart */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h5 className="text-lg font-black text-slate-900 tracking-tight">Messaging Activity</h5>
                <p className="text-xs text-slate-400 font-medium mt-1">Growth of communication volume</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-xs">
                <TrendingUp size={16} />
                REAL-TIME
              </div>
            </div>
            
            <div className="flex-1 min-h-[260px] flex flex-col justify-between relative z-10">
              <div className="relative h-48 w-full group/chart">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                    <defs>
                    <linearGradient id="chart-grad-real" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ff6129" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#ff6129" stopOpacity="0"></stop>
                    </linearGradient>
                    </defs>
                    <path 
                        fill="url(#chart-grad-real)" 
                        d={chartData.fill}
                        className="transition-all duration-1000"
                    />
                    <path 
                        d={chartData.line} 
                        fill="none" 
                        stroke="#ff6129" 
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
              </div>
              <div className="flex justify-between mt-8 px-2">
                {(stats?.messageHistory || []).slice(-7).map((d) => (
                  <span key={d.date} className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                    {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Interaction Load - Bar Chart */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h5 className="text-lg font-black text-slate-900 tracking-tight">Interaction Load</h5>
                <p className="text-xs text-slate-400 font-medium mt-1">Daily engagement intensity</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live Stats
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[260px] flex items-end justify-between gap-6 px-4">
              {((stats?.messageHistory || []).slice(-7)).map((d, idx) => {
                const max = Math.max(...stats.messageHistory.map(m => m.count), 1);
                const h = (d.count / max) * 100;
                return (
                  <div key={idx} className="flex flex-col flex-1 items-center gap-4 group/bar">
                    <div className="w-full bg-slate-50 rounded-2xl relative h-48 overflow-hidden">
                      <div 
                          className="absolute bottom-0 w-full bg-slate-900 rounded-2xl transition-all duration-700 ease-out group-hover/bar:bg-primary"
                          style={{ height: `${Math.max(h, 5)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                      {new Date(d.date).toLocaleDateString(undefined, { weekday: 'narrow' })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12">
          {/* Club Engagement */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex flex-col mb-10">
              <h5 className="text-lg font-black text-slate-900 tracking-tight">Campus Engagement</h5>
              <p className="text-xs text-slate-400 font-medium mt-1">Activity across student groups</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 group">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-slate-50" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                  <circle 
                    className="stroke-primary transition-all duration-1000" 
                    cx="18" cy="18" fill="none" r="16" 
                    strokeDasharray={`${Math.min(100, (stats?.totalClubs || 0) * 10)}, 100`} 
                    strokeLinecap="round" strokeWidth="4">
                  </circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.totalClubs || 0}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Clubs</span>
                </div>
              </div>
              
              <div className="w-full mt-12 space-y-3">
                {[
                    { label: 'Active Channels', val: stats?.totalChannels || 0, color: 'bg-primary' },
                    { label: 'Total Memberships', val: stats?.totalMemberships || 0, color: 'bg-slate-900' },
                    { label: 'Dept Sections', val: stats?.activeSections || 0, color: 'bg-slate-200' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group/item">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color} group-hover/item:scale-150 transition-transform`} />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-sm font-black text-slate-400">{item.val.toLocaleString()}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements Posted */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h5 className="text-lg font-black text-slate-900 tracking-tight">Recent Announcements</h5>
                <p className="text-xs text-slate-400 font-medium mt-1">Latest updates reaching the campus population</p>
              </div>
              <button 
                onClick={() => window.location.href = '/admin/channels'}
                className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:translate-x-1 transition-all"
              >
                Broadcast New
                <ExternalLink size={14} />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="grid grid-cols-1 gap-4">
                {announcements.length > 0 ? announcements.map((ann, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-100 transition-all hover:-translate-x-2 group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-500 shadow-lg">
                                <Clock size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[15px] font-black text-slate-900 line-clamp-1">{ann.title}</span>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[11px] font-black text-primary uppercase tracking-widest">{ann.channel_name}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <span className="text-[11px] font-medium text-slate-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900">{ann.reach?.toLocaleString() || 0}</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Reach</span>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary transition-colors cursor-pointer group-hover:shadow-md">
                                <Eye size={18} />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No recent announcements found.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemAnalytics;
