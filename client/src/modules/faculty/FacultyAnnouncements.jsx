import React, { useState, useEffect } from 'react';
import { Plus, Megaphone, Filter, Search, Calendar, ChevronRight, Menu, Bell, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FacultyDrawer from './FacultyDrawer';
import api from '../../api';
import '../student/student.css';

const FacultyAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/faculty/announcements');
      setAnnouncements(res.data);
      const profileRes = await api.get('/faculty/dashboard');
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/50">
        <header className="st-topbar px-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm">CN</div>
             <h1 className="text-[18px] font-black text-slate-800 tracking-tighter">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-purple-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} strokeWidth={2.5} />
             </button>
          </div>
        </header>

        <FacultyDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          {/* Header Title in Main */}
          <section className="mb-8">
             <h2 className="text-[28px] font-black leading-tight text-slate-800">
                Official <span className="text-purple-600">Announcements</span>
             </h2>
             <p className="text-[14px] font-bold text-slate-400 mt-1">Broadcast updates to your sections.</p>
          </section>

          {/* Search bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   placeholder="Search history..." 
                   className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-sm text-slate-800 outline-none focus:border-purple-500 transition-all shadow-sm"
                />
            </div>
            <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
                [1,2,3].map(i => <div key={i} className="h-36 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : announcements.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Megaphone size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">No Broadcasts Yet</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto">Your announcement history will appear here.</p>
               </div>
            ) : (
               announcements.map((ann) => (
                  <div key={ann.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-wrap gap-2">
                           <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                              ann.priority === 'Serious' ? 'bg-rose-50 text-rose-600' :
                              ann.priority === 'Important' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                           }`}>
                              {ann.priority}
                           </span>
                           <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden max-w-[120px] truncate">
                              {ann.sections || 'General'}
                           </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300">{new Date(ann.created_at).toLocaleDateString()}</span>
                     </div>
                     
                     <h4 className="text-[16px] font-black text-slate-800 tracking-tight leading-snug mb-2">{ann.title}</h4>
                     <p className="text-[13px] font-medium text-slate-500 line-clamp-2 mb-4">{ann.content}</p>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Info size={12} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Sent to all students</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                           <ChevronRight size={18} />
                        </button>
                     </div>
                  </div>
               ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyAnnouncements;
