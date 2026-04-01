import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Eye, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Users,
  Zap,
  Plus,
  X,
  Globe,
  Lock,
  Building2,
  AlertTriangle
} from 'lucide-react';
import api from '../../api';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
           <div className={`w-16 h-16 rounded-2xl ${type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'} flex items-center justify-center mx-auto mb-6`}>
              <AlertTriangle size={32} />
           </div>
           <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
           <p className="text-slate-500 font-medium">{message}</p>
        </div>
        <div className="p-4 bg-slate-50 flex gap-3">
           <button 
             onClick={onClose}
             className="flex-1 py-4 text-sm font-black text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
           >
              Cancel
           </button>
           <button 
             onClick={() => { onConfirm(); onClose(); }}
             className={`flex-1 py-4 ${type === 'danger' ? 'bg-rose-500 shadow-rose-200' : 'bg-primary shadow-primary/20'} text-white text-sm font-black rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-100 uppercase tracking-widest`}
           >
              Confirm
           </button>
        </div>
      </div>
    </div>
  );
};

const ManageMembersModal = ({ isOpen, onClose, channel, onSync }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ sections: [], faculty: [], students: [] });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState('sections');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) fetchOptions();
  }, [isOpen]);

  const fetchOptions = async () => {
    try {
      const res = await api.get('/admin/channels/eligible-users');
      setData(res.data);
    } catch (err) {
      console.error('Fetch eligible users error', err);
    }
  };

  const toggleUser = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectSection = (sectionId) => {
    const next = new Set(selectedIds);
    data.students.forEach(s => {
      if (s.section_id === sectionId) next.add(s.id);
    });
    setSelectedIds(next);
  };

  const selectAllFaculty = () => {
    const next = new Set(selectedIds);
    data.faculty.forEach(f => next.add(f.id));
    setSelectedIds(next);
  };

  const clearAll = () => setSelectedIds(new Set());

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post(`/admin/channels/${channel.id}/members`, { userIds: Array.from(selectedIds) });
      onSync();
      onClose();
    } catch (err) {
      alert('Failed to update members');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <UserPlus size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900">Manage Members</h3>
                <p className="text-sm font-bold text-slate-400">Targeting: {channel.name}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
              {['sections', 'faculty'].map(t => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {t}
                </button>
              ))}
           </div>

           {activeTab === 'sections' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Cohorts</h4>
                   <button onClick={clearAll} className="text-xs font-bold text-primary">Clear All</button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   {data.sections.map(s => {
                     const inSection = data.students.filter(st => st.section_id === s.id);
                     const isAllSelected = inSection.length > 0 && inSection.every(st => selectedIds.has(st.id));
                     
                     return (
                       <button 
                         key={s.id}
                         onClick={() => selectSection(s.id)}
                         className={`p-4 rounded-2xl border text-left transition-all ${isAllSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                       >
                          <p className="font-black text-slate-900">{s.name}</p>
                          <p className={`text-[10px] font-bold ${isAllSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                            {inSection.length} Students {isAllSelected && '• Selected'}
                          </p>
                       </button>
                     );
                   })}
                </div>
             </div>
           )}

           {activeTab === 'faculty' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Faculty Members</h4>
                   <div className="flex gap-4">
                     <button onClick={selectAllFaculty} className="text-xs font-bold text-primary underline underline-offset-4">Select All</button>
                     <button onClick={clearAll} className="text-xs font-bold text-slate-400">Clear</button>
                   </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   {data.faculty.map(f => (
                     <div 
                       key={f.id}
                       onClick={() => toggleUser(f.id)}
                       className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${selectedIds.has(f.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}
                     >
                        <span className="font-bold text-slate-700">{f.name}</span>
                        {selectedIds.has(f.id) && <CheckCircle2 size={18} className="text-emerald-500" />}
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        <div className="p-8 bg-slate-50 flex items-center justify-between">
           <p className="text-sm font-bold text-slate-500">{selectedIds.size} ready to add</p>
           <button 
             onClick={handleSave}
             disabled={loading}
             className="px-10 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all uppercase tracking-widest disabled:opacity-50"
           >
              {loading ? 'Adding...' : 'Add Members'}
           </button>
        </div>
      </div>
    </div>
  );
};

const ChannelModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('announcement');
  const [visibility, setVisibility] = useState('department');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                 <MessageSquare size={24} strokeWidth={2.5} />
              </div>
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Channel</h3>
                 <p className="text-sm font-bold text-slate-400 mt-0.5">Define your campus broadcast hub</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
              <X size={20} className="text-slate-400" />
           </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, type, description, visibility }); }} className="p-10 space-y-8 bg-slate-50/30">
           <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2.5">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Channel Name</label>
                 <input 
                   required
                   value={name}
                   onChange={e => setName(e.target.value)}
                   placeholder="e.g. Sports Announcements"
                   className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 shadow-sm"
                 />
              </div>
              
              <div className="space-y-2.5">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Type</label>
                 <select 
                   value={type}
                   onChange={e => setType(e.target.value)}
                   className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                 >
                    <option value="announcement">Announcement Only</option>
                    <option value="general">Open Discussion</option>
                 </select>
              </div>

              <div className="space-y-2.5">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Visibility</label>
                 <select 
                   value={visibility}
                   onChange={e => setVisibility(e.target.value)}
                   className="w-full h-14 px-6 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer shadow-sm"
                 >
                    <option value="department">Department Hub</option>
                    <option value="public">Campus Wide</option>
                    <option value="private">Private Group</option>
                 </select>
              </div>

              <div className="col-span-2 space-y-2.5">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Channel Description</label>
                 <textarea 
                   value={description}
                   onChange={e => setDescription(e.target.value)}
                   placeholder="What happens in this channel? (Optional)"
                   className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold text-slate-700 resize-none h-24 mb-1 shadow-sm"
                 />
              </div>
           </div>

           <div className="flex gap-4 pt-4 border-t border-slate-200/50">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 h-14 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest"
              >
                 Discard
              </button>
              <button 
                disabled={loading || !name}
                className="flex-[2] h-14 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2"
              >
                 {loading ? (
                   <div className="w-5 h-5 border-3 border-white/30 border-t-white animate-spin rounded-full" />
                 ) : (
                   <>
                     <Plus size={18} strokeWidth={3} />
                     <span>Finalize Hub</span>
                   </>
                 )}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

const ChannelsManagement = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('section');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [memberModal, setMemberModal] = useState({ open: false, channel: null });

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

  const handleCreateChannel = async (payload) => {
    setCreating(true);
    try {
       await api.post('/admin/channels', payload);
       setIsModalOpen(false);
       fetchChannels();
       fetchStats();
    } catch (err) {
       console.error('Error creating channel:', err);
       alert(err.response?.data?.error || 'Failed to create channel');
    } finally {
       setCreating(false);
    }
  };

  const handleDeleteChannel = async (id) => {
    try {
      await api.delete(`/admin/channels/${id}`);
      fetchChannels();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete channel', err);
      alert('Failed to delete channel');
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
      case 'branch':
      case 'system':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-100/50">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
            System
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
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100/50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            Active
          </div>
        );
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'section': return <Building2 size={12} />;
      case 'branch': return <Globe size={12} />;
      case 'club': return <Zap size={12} />;
      default: return <MessageSquare size={12} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="px-8 pb-12 space-y-10 max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex md:items-center justify-between gap-6 pt-6 mb-2">
          <div className="pt-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Channels</h1>
            <p className="text-slate-500 font-medium text-lg mt-1 font-sans">Monitor and expand your campus communication hubs.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white text-sm font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest whitespace-nowrap self-start mt-4"
          >
             <Plus size={18} />
             Create New Channel
          </button>
        </div>

        {/* Statistics Cards - MOVED TO TOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           {/* Card 1: Channel Breakdown */}
           <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-500 relative">
              <div className="flex items-start justify-between mb-4">
                 <div>
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1.5 block">Our Hubs</span>
                   <h3 className="text-xl font-black text-slate-900 leading-tight">Active Groups</h3>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-sm">
                    <MessageSquare size={24} strokeWidth={2.5} />
                 </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
               {[
                   { label: 'Sections', value: stats?.channels?.sections || 0 },
                   { label: 'Subjects', value: stats?.channels?.subjects || 0 },
                   { label: 'Broadcast', value: stats?.channels?.announcements || 0 }
                 ].map((item, i) => (
                   <div key={i} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-black text-slate-700 font-sans">{item.value}</p>
                   </div>
                 ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                 <p className="text-xs font-bold text-slate-500">Total Groups</p>
                 <p className="text-xl font-black text-slate-900 tracking-tight font-sans">{stats?.channels?.total || 0}</p>
              </div>
           </div>
 
           {/* Card 2: Population Breakdown */}
           <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-500 relative">
              <div className="flex items-start justify-between mb-4">
                 <div>
                   <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1.5 block">Communication</span>
                   <h3 className="text-xl font-black text-slate-900 leading-tight">Campus Members</h3>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shadow-sm">
                    <Users size={24} strokeWidth={2.5} />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: 'Students', value: stats?.totalStudents || 0 },
                   { label: 'Faculty', value: stats?.totalFaculty || 0 }
                 ].map((item, i) => (
                   <div key={i} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-2xl font-black text-slate-700 font-sans">{item.value}</p>
                   </div>
                 ))}
              </div>
               <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500">Total People</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight font-sans">{(stats?.totalStudents || 0) + (stats?.totalFaculty || 0)}</p>
               </div>
            </div>
        </div>

        {/* Custom Tabs Bar */}
        <div className="flex items-center justify-between">
            <div className="bg-slate-100/50 p-1 rounded-[18px] inline-flex items-center">
            {[
                { id: 'section', label: 'Section Channels' },
                { id: 'subject', label: 'Subject Channels' },
                { id: 'announcement', label: 'Broadcast Channels' }
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
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
               <input 
                 type="text"
                 placeholder="Search hubs..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="h-12 pl-12 pr-6 bg-slate-100/50 border border-transparent rounded-[14px] focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 outline-none w-64 transition-all font-bold text-slate-700 text-sm"
               />
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden min-h-[460px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hub Name</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">People</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Established</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-10 text-center">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary animate-spin rounded-full mx-auto" />
                  </td>
                </tr>
              ) : channels.length > 0 ? channels.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((channel, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6 text-sm font-extrabold text-slate-900">{channel.name}</td>
                  <td className="px-6 py-6 font-sans">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200/50 flex items-center gap-1.5 w-fit">
                      {getTypeIcon(channel.type)}
                      {channel.type === 'branch' ? 'Department' : channel.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-slate-600 text-center">
                    <div className="bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center mx-auto border border-slate-100 font-sans">
                      {channel.members}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-slate-400 font-sans">
                    {new Date(channel.created_at).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-6 font-sans">{getStatusBadge(channel.type === 'branch' ? 'branch' : (channel.status || 'Active'))}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      {/* Broadcast/General Management */}
                      {(channel.type === 'announcement' || channel.type === 'general') && (
                        <>
                          <button 
                            className="w-10 h-10 rounded-xl hover:bg-white hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center justify-center border border-transparent hover:border-slate-100" 
                            title="Manage Audience"
                            onClick={() => setMemberModal({ open: true, channel })}
                          >
                             <UserPlus size={18} strokeWidth={2.5} />
                          </button>
                          <button 
                             className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center border border-transparent" 
                             title="Remove Channel"
                             onClick={() => setConfirmState({ open: true, id: channel.id })}
                           >
                             <Trash2 size={18} strokeWidth={2.5} />
                           </button>
                        </>
                      )}

                      {/* Subject Channel Specific Actions */}
                      {channel.type === 'subject' && (
                        <>
                          <button 
                            className="w-10 h-10 rounded-xl hover:bg-white hover:text-primary hover:shadow-lg hover:shadow-primary/10 transition-all flex items-center justify-center border border-transparent hover:border-slate-100" 
                            title="Manage Students"
                            onClick={() => navigate('/admin/students')}
                          >
                             <Eye size={18} strokeWidth={2.5} />
                          </button>
                          <button 
                            className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center border border-transparent" 
                            title="Remove Channel"
                            onClick={() => setConfirmState({ open: true, id: channel.id })}
                          >
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                         <MessageSquare size={32} />
                      </div>
                      <p className="text-slate-400 font-bold max-w-xs mx-auto">No channels found in this category.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Table Footer */}
          <div className="px-8 py-6 bg-slate-50/10 flex items-center justify-between border-t border-slate-100">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest tracking-loose">Displaying {channels.length} Hubs</span>
            <div className="flex items-center gap-2 font-sans">
              <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                 <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black shadow-lg shadow-primary/20">1</button>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-30" disabled>
                 <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChannelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChannel}
        loading={creating}
      />

      <ManageMembersModal 
        isOpen={memberModal.open}
        onClose={() => setMemberModal({ open: false, channel: null })}
        channel={memberModal.channel}
        onSync={fetchChannels}
      />

      <ConfirmationModal 
        isOpen={confirmState.open}
        onClose={() => setConfirmState({ open: false, id: null })}
        onConfirm={() => handleDeleteChannel(confirmState.id)}
        title="Delete Group Hub?"
        message="This will permanently delete the hub and all associated message history. This action cannot be reversed."
      />
    </div>
  );
};

export default ChannelsManagement;
