import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Users,
  MessageCircle,
  ChevronRight,
  Menu,
  Bell,
  MoreVertical,
  Activity,
  Calendar,
  Layers,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyDrawer from "./FacultyDrawer";
import FacultyDock from "./FacultyDock";
import api from "../../api";
import "../student/student.css";

const FacultySubjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/faculty/subjects");
      setSubjects(res.data);
      const profileRes = await api.get("/faculty/dashboard");
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/30">
        <header className="st-topbar px-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-sm">CN</div>
             <h1 className="text-[17px] font-black text-slate-800 tracking-tighter">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors relative">
                <Bell size={20} strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-orange-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={22} strokeWidth={2.5} />
             </button>
          </div>
        </header>

        <FacultyDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar pb-32">
          {/* Header Title in Main */}
          <section className="mb-6">
             <h2 className="text-[26px] font-black leading-tight text-slate-800 tracking-tight">
                My <span className="text-blue-600">Subjects</span>
             </h2>
             <p className="text-[13px] font-bold text-slate-400 leading-snug">Review your assigned classes, semesters and student counts.</p>
          </section>

          {/* Stats Summary Row - More Tighter */}
          <div className="flex gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[28px] p-4 flex-1 shadow-sm shadow-slate-200/30">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                   <BookOpen size={18} />
                </div>
                <div className="text-[20px] font-black text-slate-800 leading-none mb-1">{subjects.length}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Classes</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[28px] p-4 flex-1 shadow-sm shadow-slate-200/30">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                   <Users size={18} />
                </div>
                <div className="text-[20px] font-black text-slate-800 leading-none mb-1">
                   {subjects.reduce((sum, s) => sum + s.student_count, 0)}
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Students</div>
             </div>
          </div>

          {/* Search bar - Refined height */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                   placeholder="Search subjects..." 
                   className="w-full h-12 bg-white border border-slate-100 rounded-[20px] pl-11 pr-4 font-bold text-xs text-slate-800 outline-none focus:border-blue-500 transition-all shadow-sm"
                />
            </div>
            <button className="w-12 h-12 bg-white border border-slate-100 rounded-[20px] flex items-center justify-center text-slate-400 shadow-sm">
                <Activity size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
                [1,2].map(i => <div key={i} className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : subjects.length === 0 ? (
               <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <BookOpen size={30} className="text-slate-200" />
                  </div>
                  <h3 className="text-md font-black text-slate-800 mb-1">No subjects assigned</h3>
                  <p className="text-xs font-bold text-slate-400">Classes will appear here once assigned.</p>
               </div>
            ) : (
               subjects.map((sub) => (
                  <div key={sub.offering_id} className="bg-white border border-slate-100 rounded-[30px] p-5 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-3.5">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                              <BookOpen size={24} />
                           </div>
                           <div className="flex flex-col">
                              <h4 className="text-[17px] font-black text-slate-800 tracking-tight leading-none mb-2">{sub.subject_name}</h4>
                              <div className="flex items-center gap-1.5">
                                 <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md leading-tight">
                                    {sub.section_name}
                                 </span>
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Layers size={9} />
                                    {sub.term_name || '2023_FALL'}
                                 </span>
                              </div>
                           </div>
                        </div>
                        <button className="p-1 -mt-1 text-slate-200">
                           <MoreVertical size={18} />
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-slate-50/60 rounded-2xl p-3 flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Users size={12} strokeWidth={2.5} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Enrollment</span>
                           </div>
                           <div className="flex items-baseline gap-1">
                              <span className="text-[16px] font-black text-slate-800 leading-none">{sub.student_count}</span>
                              <span className="text-[9px] font-bold text-slate-400 lowercase">students</span>
                           </div>
                        </div>
                        <div className="bg-slate-50/60 rounded-2xl p-3 flex flex-col gap-1">
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock size={12} strokeWidth={2.5} />
                              <span className="text-[8px] font-black uppercase tracking-widest">Engagement</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="w-[75%] h-full bg-emerald-500 rounded-full"></div>
                              </div>
                              <span className="text-[9px] font-black text-emerald-600 leading-none">High</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-slate-300">
                           <Calendar size={12} strokeWidth={2.5} />
                           <span className="text-[9px] font-black uppercase tracking-widest">
                              Assigned {new Date(sub.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        <button 
                           onClick={() => navigate(`/student/chat/${sub.channel_id}`)}
                           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-md shadow-blue-100 active:scale-95 transition-all"
                        >
                           <MessageCircle size={14} strokeWidth={3} />
                           Open Channel
                           <ChevronRight size={12} strokeWidth={3} />
                        </button>
                     </div>
                  </div>
               ))
            )}
          </div>
        </main>
        <FacultyDock active="subjects" />
      </div>
    </div>
  );
};

export default FacultySubjects;
