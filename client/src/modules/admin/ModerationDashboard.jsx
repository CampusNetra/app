import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShieldAlert, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Zap,
  Flag,
  UserX,
  AlertTriangle,
  History,
  TrendingUp,
  X,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Bell,
  BarChart3
} from 'lucide-react';
import api from '../../api';

const ModerationDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('messages'); // messages, posts, users

    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchReports();
        fetchStats();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/reports');
            setReports(res.data || []);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-8 py-8 space-y-10 max-w-7xl mx-auto pb-20">
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: 'Pending Messages', value: stats?.pendingReports || 0, color: 'text-orange-500', bg: 'bg-orange-50', icon: MessageSquare },
                        { label: 'Flagged Posts', value: stats?.pendingReports || 0, color: 'text-orange-500', bg: 'bg-orange-50', icon: Trash2 },
                        { label: 'Active Suspensions', value: stats?.suspendedUsers || 0, color: 'text-slate-400', bg: 'bg-slate-50', icon: UserX }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 bg-white border border-slate-100 rounded-[24px] shadow-sm relative overflow-hidden flex flex-col justify-between h-[180px]">
                            <div className="flex justify-between items-start">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={18} fill="currentColor" fillOpacity={0.2} />
                                </div>
                            </div>
                            <div className="flex items-end gap-3 translate-y-2">
                                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs & Table Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-8 border-b border-slate-100 pb-px font-sans">
                        {[
                            { id: 'messages', label: 'Reported Messages' },
                            { id: 'posts', label: 'Reported Posts' },
                            { id: 'users', label: 'Suspended Users' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-[#FCFDFF]">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporter</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported User</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Message Preview</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reports</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-10 text-center">
                                            <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full mx-auto" />
                                        </td>
                                    </tr>
                                ) : reports.length > 0 ? reports.map((report, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                                                    {report.reporter?.avatar ? <img src={report.reporter.avatar} alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">{report.reporter_name?.[0]}</div>}
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-700">{report.reporter_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                                                    {report.reported?.avatar ? <img src={report.reported.avatar} alt="" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">{report.reported_name?.[0]}</div>}
                                                </div>
                                                <span className="text-[13px] font-bold text-slate-700">{report.reported_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-[13px] font-medium text-slate-500 line-clamp-1 italic italic">
                                                "{report.message_content}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-6 whitespace-nowrap">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-wider border border-slate-200/50">
                                                #{report.channel_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto border border-orange-100/50">
                                                <span className="text-xs font-black">1</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right whitespace-nowrap">
                                            <button 
                                                className="px-5 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700 uppercase tracking-widest shadow-sm transition-all active:scale-95"
                                                onClick={() => console.log('Review report', report.id)}
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center text-slate-400 font-medium">
                                            No pending reports found for review.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <div className="px-8 py-6 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
                            <span className="text-[11px] font-bold text-slate-400 capitalize underline decoration-slate-200 underline-offset-4 decoration-2">Showing {reports.length} pending reports</span>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 text-xs font-black uppercase text-slate-400 border border-slate-200 rounded-xl disabled:opacity-30" disabled>Previous</button>
                                <button className="px-4 py-2 text-xs font-black uppercase text-slate-900 border border-slate-200 rounded-xl hover:bg-white shadow-sm transition-all active:scale-95" disabled>Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Rows: Recent Actions & Trends */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <h4 className="flex items-center gap-3 text-lg font-black text-slate-900 uppercase tracking-tight">
                           <History className="text-primary" size={24} />
                           Recent Activity
                        </h4>
                        <div className="space-y-4">
                            {reports.length > 0 ? reports.slice(0, 3).map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:translate-x-1 transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center`}>
                                            <AlertTriangle size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <h5 className="text-[15px] font-black text-slate-900 leading-none">Report Pending</h5>
                                            <p className="text-[12px] font-medium text-slate-400 mt-1">From @{report.reporter_name} in #{report.channel_name}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            )) : (
                                <div className="p-8 text-center bg-white border border-slate-100 rounded-[24px] text-slate-400 italic">
                                    No recent moderation actions recorded.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="flex items-center gap-3 text-lg font-black text-slate-900 uppercase tracking-tight">
                           <TrendingUp className="text-primary" size={24} />
                           Activity Trends
                        </h4>
                        <div className="p-8 bg-white border border-slate-100 rounded-[28px] shadow-sm h-[200px] flex items-end justify-between relative overflow-hidden group">
                           {/* Chart Background Grid (aesthetic only) */}
                            <div className="absolute inset-x-8 top-12 bottom-12 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                                {[1,2,3].map(i => <div key={i} className="h-px bg-slate-900 w-full" />)}
                            </div>

                           {/* Bar Chart representing real message history if available */}
                           {(stats?.messageHistory?.length > 0 ? stats.messageHistory : [10, 20, 15, 25, 30, 18, 12]).map((item, i) => {
                               const value = typeof item === 'object' ? item.count : item;
                               const max = Math.max(...(stats?.messageHistory?.map(d => d.count) || [30]));
                               const h = (value / max) * 100;
                               return (
                                   <div key={i} className="flex-1 px-1 flex flex-col items-center gap-2 group/bar">
                                       <div 
                                          className={`w-full rounded-t-xl transition-all duration-700 ease-out group-hover/bar:brightness-110 ${i >= (stats?.messageHistory?.length - 2) ? 'bg-primary shadow-[0_4px_12px_rgba(255,97,41,0.3)]' : 'bg-orange-100'}`}
                                          style={{ height: `${Math.max(10, h)}%` }}
                                       />
                                   </div>
                               );
                           })}

                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm leading-none whitespace-nowrap">
                                  {stats?.messageHistory?.length > 0 ? '7 Day Activity Frequency' : 'Pending Data Sync'}
                               </p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModerationDashboard;
