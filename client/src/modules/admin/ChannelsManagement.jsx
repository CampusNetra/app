import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChannelsManagement = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('section');

  useEffect(() => {
    fetchChannels();
  }, [activeTab]);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/admin/channels?type=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data);
    } catch (err) {
      console.error('Error fetching channels:', err);
      // Fallback mock data based on tab
      const mockData = {
        section: [
          { id: 1, name: 'CS101-Morning', type: 'Section', members: 124, createdAt: '2023-10-12T00:00:00Z', status: 'Active' },
          { id: 2, name: 'ENG202-Afternoon', type: 'Section', members: 82, createdAt: '2023-11-05T00:00:00Z', status: 'Active' },
          { id: 3, name: 'ARCH310-Design', type: 'Section', members: 45, createdAt: '2023-12-01T00:00:00Z', status: 'Draft' },
          { id: 4, name: 'MATH104-SectionB', type: 'Section', members: 156, createdAt: '2023-09-20T00:00:00Z', status: 'Disabled' },
        ],
        subject: [
          { id: 5, name: 'Data Structures Base', type: 'Subject', members: 350, createdAt: '2023-08-10T00:00:00Z', status: 'Active' },
          { id: 6, name: 'Calculus Discussion', type: 'Subject', members: 210, createdAt: '2023-08-12T00:00:00Z', status: 'Active' },
        ],
        announcement: [
          { id: 7, name: 'Campus Wide News', type: 'Announcement', members: 12450, createdAt: '2022-01-01T00:00:00Z', status: 'Active' },
          { id: 8, name: 'Computer Science Dept', type: 'Announcement', members: 850, createdAt: '2022-06-15T00:00:00Z', status: 'Active' },
        ]
      };
      setChannels(mockData[activeTab] || []);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Draft
          </span>
        );
      case 'disabled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Disabled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-background-light text-slate-900">
      <div className="max-w-7xl mx-auto w-full">
        {/* Page Title Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Channels</h2>
            <p className="text-slate-500 mt-1">Manage and monitor all communication channels across the campus.</p>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-xl text-sm font-bold shadow-sm shadow-primary/20 flex items-center justify-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Create New</span>
          </button>
        </div>

        {/* Tabs Navigation (Shadcn Style) */}
        <div className="w-full">
          <div className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500 mb-6">
            <button 
              onClick={() => setActiveTab('section')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm transition-all ${activeTab === 'section' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'font-medium hover:text-slate-900'}`}
            >
              Section Channels
            </button>
            <button 
              onClick={() => setActiveTab('subject')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm transition-all ${activeTab === 'subject' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'font-medium hover:text-slate-900'}`}
            >
              Subject Channels
            </button>
            <button 
              onClick={() => setActiveTab('announcement')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm transition-all ${activeTab === 'announcement' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'font-medium hover:text-slate-900'}`}
            >
              Announcement Channels
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-12">
            <div className="flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/50">
               <div className="relative">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                 <input className="pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64" placeholder="Search channels..." type="text"/>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Channel Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Members</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : channels.length > 0 ? (
                    channels.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-sm">{channel.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {channel.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-center font-medium">{channel.members}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(channel.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(channel.status)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors" title="View">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors" title="Manage Members">
                            <span className="material-symbols-outlined text-lg">group_add</span>
                          </button>
                          {channel.status?.toLowerCase() === 'disabled' ? (
                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors" title="Enable Channel">
                              <span className="material-symbols-outlined text-lg">check_circle</span>
                            </button>
                          ) : (
                            <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors" title="Disable Channel">
                              <span className="material-symbols-outlined text-lg">block</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500">No channels found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">Showing 1 to {channels.length} of {channels.length} channels</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 bg-primary text-white border border-primary rounded-lg text-xs font-bold">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>

          {/* Channel Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">forum</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">+12% vs LY</span>
              </div>
              <h4 className="text-slate-500 text-sm font-medium">Total Channels</h4>
              <p className="text-2xl font-black mt-1">124</p>
            </div>
            
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">+5% vs LY</span>
              </div>
              <h4 className="text-slate-500 text-sm font-medium">Total Memberships</h4>
              <p className="text-2xl font-black mt-1">12,450</p>
            </div>
            
            <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined">flash_on</span>
                </div>
                <span className="text-[10px] font-bold text-red-500 uppercase">-2% vs LY</span>
              </div>
              <h4 className="text-slate-500 text-sm font-medium">Daily Messages</h4>
              <p className="text-2xl font-black mt-1">45.2k</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ChannelsManagement;
