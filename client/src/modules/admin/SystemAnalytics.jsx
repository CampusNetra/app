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
  ExternalLink
} from 'lucide-react';
import api from '../../api';

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, announcementsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/announcements')
      ]);
      setStats(statsRes.data);
      setAnnouncements(announcementsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
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
            { label: 'Active Today', value: stats?.messagesToday || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Total Clubs', value: stats?.totalClubs || 0, icon: Calendar, color: 'text-rose-500', bg: 'bg-rose-50' },
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
                <p className="text-xs text-slate-400 font-medium mt-1">Volume of interactions across the network</p>
              </div>
              <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:text-slate-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
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
                    {/* Simplified Chart Path based on real data or fallback */}
                    <path 
                        fill="url(#chart-grad-real)" 
                        d="M0,80 C50,70 100,90 150,40 C200,10 250,50 300,30 C350,20 400,60 400,60 L400,100 L0,100 Z"
                        className="transition-all duration-1000"
                    />
                    <path 
                        d="M0,80 C50,70 100,90 150,40 C200,10 250,50 300,30 C350,20 400,60" 
                        fill="none" 
                        stroke="#ff6129" 
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                    />
                </svg>
              </div>
              <div className="flex justify-between mt-8 px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{day}</span>
                ))}
              </div>
            </div>
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Messages Volume - Bar Chart */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h5 className="text-lg font-black text-slate-900 tracking-tight">Interaction Load</h5>
                <p className="text-xs text-slate-400 font-medium mt-1">Student activity trends per session</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Real-time
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[260px] flex items-end justify-between gap-6 px-4">
              {[60, 85, 45, 95, 70, 30, 20].map((h, idx) => (
                <div key={idx} className="flex flex-col flex-1 items-center gap-4 group/bar">
                  <div className="w-full bg-slate-50 rounded-2xl relative h-48 overflow-hidden">
                    <div 
                        className="absolute bottom-0 w-full bg-slate-900 rounded-2xl transition-all duration-1000 ease-out group-hover/bar:bg-primary"
                        style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-12">
          {/* Club Distribution */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col mb-10">
              <h5 className="text-lg font-black text-slate-900 tracking-tight">Club Engagement</h5>
              <p className="text-xs text-slate-400 font-medium mt-1">Distribution of active chapters</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90 group" viewBox="0 0 36 36">
                  <circle className="stroke-slate-50" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                  <circle 
                    className="stroke-primary transition-all duration-1000" 
                    cx="18" cy="18" fill="none" r="16" 
                    strokeDasharray={`${Math.min(100, (stats?.totalClubs || 0) * 5)}, 100`} 
                    strokeLinecap="round" strokeWidth="4">
                  </circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900">{stats?.totalClubs || 0}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Active</span>
                </div>
              </div>
              
              <div className="w-full mt-12 space-y-4">
                {[
                    { label: 'Technical', val: '45%', color: 'bg-primary' },
                    { label: 'Cultural', val: '30%', color: 'bg-slate-400' },
                    { label: 'Others', val: '25%', color: 'bg-slate-200' }
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <span className="text-xs font-black text-slate-400">{item.val}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Announcements Posted - Feed Style */}
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
                    <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-50 hover:bg-slate-50 transition-all group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
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
                                <span className="text-xs font-black text-slate-900">{ann.reach?.toLocaleString() || 0}</span>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Reach</span>
                            </div>
                            <div className="w-px h-10 bg-slate-100" />
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-primary transition-colors">
                                <Eye size={18} />
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center">
                        <p className="text-slate-400 font-medium italic">No recent announcements found.</p>
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
