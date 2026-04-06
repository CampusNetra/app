import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Users,
  MessageCircle,
  ChevronRight,
  Menu,
  Bell,
  Calendar,
  Layers,
  ClipboardCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyDrawer from "./FacultyDrawer";
import FacultyDock from "./FacultyDock";
import api from "../../api";
import "../student/student.css";

const FacultySubjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subjectsRes, profileRes] = await Promise.all([
        api.get("/faculty/subjects"),
        api.get("/faculty/dashboard")
      ]);
      setSubjects(subjectsRes.data);
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const haystack = [
      subject.subject_name,
      subject.section_name,
      subject.term_name,
      subject.channel_name
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.trim().toLowerCase());
  });

  const totalStudents = subjects.reduce((sum, subject) => sum + Number(subject.student_count || 0), 0);
  const totalChannels = subjects.filter((subject) => subject.channel_id).length;

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/30">
        <header className="st-topbar px-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-[90]">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">CN</div>
             <h1 className="text-[17px] font-semibold text-slate-800 tracking-tight">CampusNetra</h1>
          </div>

          <div className="flex items-center gap-1">
             <button className="p-2.5 text-slate-400 hover:text-orange-600 transition-colors relative">
                <Bell size={20} strokeWidth={2.25} />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-orange-600 rounded-full border-2 border-white"></span>
             </button>
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={22} strokeWidth={2.25} />
             </button>
          </div>
        </header>

        <FacultyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar pb-32">
          <section className="mb-6">
             <h2 className="text-[26px] font-semibold leading-tight text-slate-800 tracking-tight">
                My <span className="text-orange-600">Subjects</span>
             </h2>
             <p className="text-[13px] font-medium text-slate-400 leading-snug">Review your assigned classes with actual channel, assignment, and message data.</p>
          </section>

          <div className="grid grid-cols-3 gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm shadow-slate-200/20">
                <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                   <BookOpen size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[19px] font-semibold text-slate-800 leading-none mb-1">{subjects.length}</div>
                <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.14em]">Classes</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm shadow-slate-200/20">
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                   <Users size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[19px] font-semibold text-slate-800 leading-none mb-1">{totalStudents}</div>
                <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.14em]">Students</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm shadow-slate-200/20">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                   <MessageCircle size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[19px] font-semibold text-slate-800 leading-none mb-1">{totalChannels}</div>
                <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.14em]">Channels</div>
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subjects, sections, terms..."
              className="w-full h-12 bg-white border border-slate-100 rounded-[20px] pl-11 pr-4 font-medium text-sm text-slate-800 outline-none focus:border-orange-400 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
                [1, 2].map((i) => <div key={i} className="h-56 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : filteredSubjects.length === 0 ? (
               <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <BookOpen size={30} className="text-slate-200" />
                  </div>
                  <h3 className="text-md font-semibold text-slate-800 mb-1">
                    {subjects.length === 0 ? "No subjects assigned" : "No matching subjects"}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    {subjects.length === 0 ? "Classes will appear here once assigned." : "Try a different search term."}
                  </p>
               </div>
            ) : (
               filteredSubjects.map((subject, index) => (
                  <div key={subject.offering_id} className="bg-white border border-slate-100 rounded-[30px] p-5 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex items-start gap-3.5 mb-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          index % 3 === 0 ? "bg-orange-50 text-orange-600" :
                          index % 3 === 1 ? "bg-blue-50 text-blue-600" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                           <BookOpen size={22} strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-tight mb-2">{subject.subject_name}</h4>
                           <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[9px] font-semibold text-orange-600 uppercase tracking-[0.14em] bg-orange-50 px-2 py-1 rounded-md leading-tight">
                                 {subject.section_name}
                              </span>
                              {subject.term_name ? (
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-[0.14em] bg-slate-50 px-2 py-1 rounded-md flex items-center gap-1">
                                   <Layers size={9} />
                                   {subject.term_name}
                                </span>
                              ) : null}
                              {subject.channel_name ? (
                                <span className="text-[9px] font-semibold text-blue-600 uppercase tracking-[0.14em] bg-blue-50 px-2 py-1 rounded-md">
                                  {subject.channel_name}
                                </span>
                              ) : null}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-slate-50/70 rounded-2xl p-3">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                              <Users size={12} strokeWidth={2.3} />
                              <span className="text-[8px] font-semibold uppercase tracking-[0.14em]">Enrollment</span>
                           </div>
                           <div className="text-[16px] font-semibold text-slate-800 leading-none">{subject.student_count || 0}</div>
                           <div className="text-[10px] font-medium text-slate-400 mt-1">students in section</div>
                        </div>
                        <div className="bg-slate-50/70 rounded-2xl p-3">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                              <ClipboardCheck size={12} strokeWidth={2.3} />
                              <span className="text-[8px] font-semibold uppercase tracking-[0.14em]">Assignments</span>
                           </div>
                           <div className="text-[16px] font-semibold text-slate-800 leading-none">{subject.assignment_count || 0}</div>
                           <div className="text-[10px] font-medium text-slate-400 mt-1">active tasks linked</div>
                        </div>
                        <div className="bg-slate-50/70 rounded-2xl p-3">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                              <MessageCircle size={12} strokeWidth={2.3} />
                              <span className="text-[8px] font-semibold uppercase tracking-[0.14em]">Messages</span>
                           </div>
                           <div className="text-[16px] font-semibold text-slate-800 leading-none">{subject.message_count || 0}</div>
                           <div className="text-[10px] font-medium text-slate-400 mt-1">channel posts so far</div>
                        </div>
                        <div className="bg-slate-50/70 rounded-2xl p-3">
                           <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                              <Users size={12} strokeWidth={2.3} />
                              <span className="text-[8px] font-semibold uppercase tracking-[0.14em]">Members</span>
                           </div>
                           <div className="text-[16px] font-semibold text-slate-800 leading-none">{subject.member_count || 0}</div>
                           <div className="text-[10px] font-medium text-slate-400 mt-1">
                             {subject.channel_id ? "in linked channel" : "no live channel"}
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
                        <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
                           <Calendar size={12} strokeWidth={2.3} />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em] truncate">
                              Assigned {new Date(subject.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                           </span>
                        </div>
                        {subject.channel_id ? (
                          <button
                             onClick={() => navigate(`/faculty/messages/${subject.channel_id}`)}
                             className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-xl font-semibold text-[10px] uppercase tracking-[0.14em] shadow-md shadow-orange-100 active:scale-95 transition-all shrink-0"
                          >
                             <MessageCircle size={14} strokeWidth={2.8} />
                             Open Channel
                             <ChevronRight size={12} strokeWidth={2.8} />
                          </button>
                        ) : (
                          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 shrink-0">
                            Channel pending
                          </div>
                        )}
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
