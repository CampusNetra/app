import React, { useState, useEffect } from 'react';
import { Plus, BarChart2, Search, Filter, ChevronRight, Menu, Info, Users, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FacultyDrawer from './FacultyDrawer';
import api from '../../api';
import '../student/student.css';

const FacultyPolls = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/faculty/polls');
      setPolls(res.data);
      const profileRes = await api.get('/faculty/dashboard');
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
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
             <button className="p-2.5 text-slate-400 hover:text-emerald-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-600 rounded-full border-2 border-white"></span>
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
                Live <span className="text-emerald-600">Pollings</span>
             </h2>
             <p className="text-[14px] font-bold text-slate-400 mt-1">Gather instant feedback from students.</p>
          </section>

          {/* Search bar */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   placeholder="Search polls..." 
                   className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-sm text-slate-800 outline-none focus:border-emerald-500 transition-all shadow-sm"
                />
            </div>
            <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
                [1,2,3].map(i => <div key={i} className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : polls.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <BarChart2 size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">No active polls</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto">Get some feedback from your students! Start a live poll.</p>
               </div>
            ) : (
               polls.map((poll) => (
                  <div key={poll.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm group active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                           <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                              <BarChart2 size={16} />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {new Date(poll.created_at).toLocaleDateString()}
                           </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                           <Users size={12} strokeWidth={3} />
                           <span className="text-[10px] font-black uppercase tracking-widest">{poll.response_count} Voted</span>
                        </div>
                     </div>

                     <h4 className="text-[16px] font-black text-slate-800 tracking-tight leading-snug mb-4">{poll.question}</h4>
                     
                     <div className="space-y-2 mb-6">
                        {poll.options.map((opt, i) => (
                           <div key={i} className="h-10 bg-slate-50/50 rounded-xl border border-slate-50 flex items-center px-4">
                              <span className="text-[12px] font-bold text-slate-600">{opt}</span>
                           </div>
                        ))}
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-400">
                           <Info size={12} />
                           <span className="text-[10px] font-black uppercase tracking-wider">Live & Active</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
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

export default FacultyPolls;
