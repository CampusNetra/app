import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  UserPlus, 
  Ban, 
  CheckCircle2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Users,
  Zap,
  Plus
} from 'lucide-react';
import api from '../../api';

const ChannelsManagement = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('section');
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchChannels();
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

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/channels?type=${activeTab}`);
      setChannels(res.data || []);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            Active
          </div>
        );
      case 'draft':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-100/50">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            Draft
          </div>
        );
      case 'disabled':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold border border-slate-200/50">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            Disabled
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="px-8 pb-12 space-y-8 max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex md:items-center justify-between gap-6 pt-6">
          <div className="pt-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Channels</h1>
            <p className="text-slate-500 font-medium text-lg mt-1 font-sans">Manage and monitor all communication channels across the campus.</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap self-start mt-4">
             <Plus size={18} />
             Create New Channel
          </button>
        </div>

        {/* Custom Tabs Bar */}
        <div className="bg-slate-100/50 p-1 rounded-[18px] inline-flex items-center">
          {[
            { id: 'section', label: 'Section Channels' },
            { id: 'subject', label: 'Subject Channels' },
            { id: 'announcement', label: 'Announcement Channels' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-[14px] text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm shadow-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Channel Name</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Members</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Created At</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
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
              ) : channels.length > 0 ? channels.map((channel, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-bold text-slate-900">{channel.name}</td>
                  <td className="px-6 py-6">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-slate-200/50">
                      {channel.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-600">{channel.members}</td>
                  <td className="px-6 py-6 text-sm font-medium text-slate-400">
                    {new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-6">{getStatusBadge(channel.status || 'Active')}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-5 text-slate-400">
                      <button 
                        className="hover:text-primary transition-colors" 
                        title="View"
                        onClick={() => console.log('View channel', channel.id)}
                      >
                         <Eye size={18} />
                      </button>
                      <button 
                        className="hover:text-primary transition-colors" 
                        title="Invite"
                        onClick={() => console.log('Invite to channel', channel.id)}
                      >
                         <UserPlus size={18} />
                      </button>
                      {channel.status === 'Disabled' ? (
                        <button 
                          className="hover:text-emerald-500 transition-colors" 
                          title="Enable"
                          onClick={() => console.log('Enable channel', channel.id)}
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      ) : (
                        <button 
                          className="hover:text-rose-500 transition-colors" 
                          title="Disable"
                          onClick={() => console.log('Disable channel', channel.id)}
                        >
                          <Ban size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center text-slate-400 font-medium">
                    No channels found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="px-8 py-6 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
            <span className="text-[11px] font-bold text-slate-400 capitalize">Showing {channels.length} results</span>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                 <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">1</button>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                 <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Channels', value: stats?.totalChannels || 0, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Total Memberships', value: stats?.totalMemberships?.toLocaleString() || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Daily Messages', value: stats?.messagesToday?.toLocaleString() || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' }
          ].map((stat, i) => (
            <div key={i} className="p-10 bg-white border border-slate-100 rounded-[28px] shadow-sm relative overflow-hidden group">
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}>
                     <stat.icon size={24} fill="currentColor" fillOpacity={0.2} />
                  </div>
               </div>
               <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsManagement;
