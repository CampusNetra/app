import React, { useState, useEffect } from 'react';
import { Calendar, Search, FileText, Menu, Bell, Paperclip } from 'lucide-react';
import api from '../../api';
import FacultyDrawer from './FacultyDrawer';
import FacultyDock from './FacultyDock';
import '../student/student.css';

const FacultyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const [assignmentsRes, profileRes] = await Promise.all([
        api.get('/faculty/assignments'),
        api.get('/faculty/dashboard')
      ]);
      setAssignments(assignmentsRes.data);
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (dueDate) => {
    if (!dueDate) return 'No Due Date';
    return new Date(dueDate) < new Date() ? 'Past Due' : 'Active';
  };

  const getStatusColor = (dueDate) => {
    if (!dueDate) return 'bg-slate-50 text-slate-500 border-slate-100';
    return new Date(dueDate) < new Date()
      ? 'bg-rose-50 text-rose-600 border-rose-100'
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const haystack = [
      assignment.title,
      assignment.subjects,
      assignment.sections,
      assignment.description
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/50">
        <header className="st-topbar px-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">CN</div>
             <h1 className="text-[18px] font-semibold text-slate-800 tracking-tight">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors relative">
                <Bell size={22} strokeWidth={2.25} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} strokeWidth={2.25} />
             </button>
          </div>
        </header>

        <FacultyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          <section className="mb-6">
             <h2 className="text-[28px] font-semibold leading-tight text-slate-800">
                Manage <span className="text-orange-600">Assignments</span>
             </h2>
             <p className="text-[14px] font-medium text-slate-400 mt-1">Real assignment records with due dates, sections, and attachment state.</p>
          </section>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-3">
                   <FileText size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{assignments.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Assignments</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                   <Calendar size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">
                  {assignments.filter((assignment) => assignment.due_date && new Date(assignment.due_date) >= new Date()).length}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Active</div>
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assignments..."
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-medium text-sm text-slate-800 outline-none focus:border-orange-400 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
               [1, 2, 3].map((i) => <div key={i} className="h-40 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : filteredAssignments.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <FileText size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {assignments.length === 0 ? 'No assignments yet' : 'No matching assignments'}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 max-w-[220px] mx-auto">
                    {assignments.length === 0 ? 'Create your first assignment to see it here.' : 'Try searching by subject, title, or section.'}
                  </p>
               </div>
            ) : (
               filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex-1 overflow-hidden">
                           <h4 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-tight mb-2">{assignment.title}</h4>
                           <div className="flex flex-wrap gap-2">
                              {assignment.subjects ? (
                                <span className="text-[10px] font-semibold text-orange-600 uppercase tracking-[0.14em] bg-orange-50 px-2 py-1 rounded-lg">
                                   {assignment.subjects}
                                </span>
                              ) : null}
                              {assignment.sections ? (
                                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.14em] bg-slate-50 px-2 py-1 rounded-lg">
                                   {assignment.sections}
                                </span>
                              ) : null}
                           </div>
                        </div>
                        <div className={`px-2.5 py-1.5 rounded-xl border text-[9px] font-semibold uppercase tracking-[0.14em] ${getStatusColor(assignment.due_date)}`}>
                           {getStatusLabel(assignment.due_date)}
                        </div>
                     </div>

                     {assignment.description ? (
                       <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-4">{assignment.description}</p>
                     ) : null}

                     <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Due Date</p>
                           <p className="text-[13px] font-medium text-slate-800">
                             {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'Not scheduled'}
                           </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-4 py-3">
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Submission</p>
                           <p className="text-[13px] font-medium text-slate-800">
                             {assignment.allow_submission ? 'Enabled' : 'Disabled'}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
                        <div className="flex items-center gap-2 text-slate-400 min-w-0">
                           <Paperclip size={13} strokeWidth={2.2} />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em] truncate">
                             {assignment.attachment_url ? 'Attachment linked' : 'No attachment'}
                           </span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 shrink-0">
                          {new Date(assignment.created_at).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               ))
            )}
          </div>
        </main>

        <FacultyDock active="" />
      </div>
    </div>
  );
};

export default FacultyAssignments;
