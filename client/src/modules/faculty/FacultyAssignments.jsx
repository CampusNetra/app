import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Filter, Search, Clock, FileText, ChevronRight, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import FacultyDrawer from './FacultyDrawer';
import '../student/student.css';

const FacultyAssignments = () => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/faculty/assignments');
      setAssignments(res.data);
      const profileRes = await api.get('/faculty/dashboard');
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
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
             <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
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
                Manage <span className="text-orange-600">Assignments</span>
             </h2>
             <p className="text-[14px] font-bold text-slate-400 mt-1">Review and track student submissions.</p>
          </section>

          {/* Search & Filter */}
          <div className="flex gap-3 mb-8">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   placeholder="Search assignments..." 
                   className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-bold text-sm text-slate-800 outline-none focus:border-orange-500 transition-all shadow-sm shadow-slate-200/50"
                />
            </div>
            <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm">
                <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
               <div className="flex flex-col gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-slate-100 rounded-[32px] animate-pulse"></div>
                  ))}
               </div>
            ) : assignments.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FileText size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-2">No Assignments Yet</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto">Create your first task to see it listed here.</p>
               </div>
            ) : (
               assignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm shadow-slate-200/50 group active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 overflow-hidden">
                           <h4 className="text-[17px] font-black text-slate-800 tracking-tight leading-tight truncate mb-1">{assignment.title}</h4>
                           <div className="flex items-center gap-2 overflow-hidden">
                              <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-lg truncate">
                                 {assignment.subjects || 'General'}
                              </span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                                 {assignment.sections}
                              </span>
                           </div>
                        </div>
                        <div className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${getStatusColor(assignment.due_date)}`}>
                           {new Date(assignment.due_date) < new Date() ? 'Past Due' : 'Active'}
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Calendar size={14} />
                              <span className="text-[11px] font-bold">{new Date(assignment.due_date).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock size={14} />
                              <span className="text-[11px] font-bold">24 Submissions</span>
                           </div>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
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

export default FacultyAssignments;
