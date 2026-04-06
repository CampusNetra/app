import React, { useState, useEffect } from 'react';
import {
  Bell,
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  LayoutGrid,
  Menu,
  Megaphone,
  MessageCircle,
  Sparkles,
  UploadCloud,
  Users,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FacultyDock from './FacultyDock';
import FacultyDrawer from './FacultyDrawer';
import api from '../../api';
import '../student/student.css';

const quickActions = [
  {
    label: 'Post Announcement',
    sub: 'Share a class update',
    icon: Megaphone,
    color: 'bg-orange-50 text-orange-600',
    path: '/faculty/announcements/new'
  },
  {
    label: 'Create Assignment',
    sub: 'Add a new deliverable',
    icon: ClipboardCheck,
    color: 'bg-blue-50 text-blue-600',
    path: '/faculty/assignments/new'
  },
  {
    label: 'Upload Material',
    sub: 'Add notes or resources',
    icon: UploadCloud,
    color: 'bg-violet-50 text-violet-600',
    path: '/faculty/materials/new'
  },
  {
    label: 'Start Poll',
    sub: 'Collect feedback quickly',
    icon: BarChart3,
    color: 'bg-emerald-50 text-emerald-600',
    path: '/faculty/polls/new'
  }
];

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/faculty/dashboard');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const subjectSummary = data?.subjectSummary || [];
  const faculty = data?.profile;
  const uniqueSections = [...new Set(subjectSummary.map((subject) => subject.section_name))];
  const activeChannels = subjectSummary.filter((subject) => subject.channel_id).length;
  const classesCount = data?.classesToday || 0;

  const highlights = [
    {
      label: 'Classes',
      value: classesCount,
      icon: BookOpen,
      tone: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Sections',
      value: uniqueSections.length,
      icon: LayoutGrid,
      tone: 'bg-orange-50 text-orange-600'
    },
    {
      label: 'Live Channels',
      value: activeChannels,
      icon: MessageCircle,
      tone: 'bg-emerald-50 text-emerald-600'
    }
  ];

  const classMix = subjectSummary.slice(0, 4);

  if (loading) {
    return (
      <div className="st-shell">
        <div className="st-mobile-frame flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

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
            <button
              className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsDrawerOpen(true)}
            >
              <Menu size={24} strokeWidth={2.25} />
            </button>
          </div>
        </header>

        <FacultyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto px-6 pb-32 pt-6">
          <section className="mb-6 rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.06)] bg-white">
            <div className="px-6 pt-6 pb-5 bg-[linear-gradient(135deg,rgba(255,247,237,1)_0%,rgba(255,255,255,1)_55%,rgba(239,246,255,1)_100%)]">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-orange-100 text-[11px] font-semibold tracking-[0.12em] uppercase text-orange-600 mb-4">
                    <Sparkles size={13} />
                    Faculty Dashboard
                  </div>
                  <h2 className="text-[30px] leading-[1.05] text-slate-800 tracking-tight font-semibold">
                    {getGreeting()}, {faculty?.name || 'Professor'}
                  </h2>
                  <p className="text-[14px] leading-relaxed text-slate-500 font-medium mt-2 max-w-[250px]">
                    A polished overview of your teaching day, communication flow, and faculty essentials.
                  </p>
                </div>

                <div className="w-14 h-14 rounded-[20px] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 text-lg font-semibold">
                  {(faculty?.name || 'F')[0]}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[20px] bg-white/90 border border-slate-100 px-3 py-4">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center mb-3 ${item.tone}`}>
                        <Icon size={16} strokeWidth={2.2} />
                      </div>
                      <div className="text-[18px] leading-none text-slate-800 font-semibold">{item.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-[0.12em] font-semibold mt-2 leading-tight">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[18px] text-slate-800 tracking-tight font-semibold">Quick Actions</h3>
                <p className="text-[13px] text-slate-400 font-medium mt-1">Shortcuts for the things faculty do most often.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="bg-white border border-slate-100 rounded-[28px] p-5 text-left shadow-sm active:scale-[0.98] transition-all"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${action.color}`}>
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div className="text-[14px] text-slate-800 leading-tight font-semibold mb-1">{action.label}</div>
                    <div className="text-[12px] text-slate-400 font-medium leading-relaxed">{action.sub}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mb-6 rounded-[30px] bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[18px] text-slate-800 tracking-tight font-semibold">Class Mix</h3>
                <p className="text-[13px] text-slate-400 font-medium mt-1">A compact view of your current teaching portfolio.</p>
              </div>
              <button
                onClick={() => navigate('/faculty/subjects')}
                className="text-[11px] uppercase tracking-[0.14em] text-orange-600 font-semibold"
              >
                Open Subjects
              </button>
            </div>

            {classMix.length > 0 ? (
              <div className="space-y-3">
                {classMix.map((subject, index) => (
                  <button
                    key={subject.offering_id}
                    onClick={() => navigate('/faculty/subjects')}
                    className="w-full rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-4 flex items-center gap-4 text-left"
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      index % 3 === 0 ? 'bg-blue-50 text-blue-600' :
                      index % 3 === 1 ? 'bg-orange-50 text-orange-600' :
                      'bg-emerald-50 text-emerald-600'
                    }`}>
                      <BookOpen size={20} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] text-slate-800 font-semibold truncate">{subject.subject_name}</p>
                      <p className="text-[12px] text-slate-400 font-medium truncate mt-1">
                        {subject.section_name} {subject.channel_id ? '· Channel ready' : '· Channel pending'}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-slate-50 border border-dashed border-slate-200 px-5 py-8 text-center">
                <p className="text-[15px] text-slate-800 font-semibold mb-1">No subjects assigned yet</p>
                <p className="text-[13px] text-slate-400 font-medium">Your teaching allocations will appear here once they are mapped.</p>
              </div>
            )}
          </section>

          <section className="rounded-[30px] bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-[18px] text-slate-800 tracking-tight font-semibold">Faculty Essentials</h3>
                <p className="text-[13px] text-slate-400 font-medium mt-1">Useful entry points without repeating the full module pages.</p>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => navigate('/faculty/assignments')}
                className="rounded-[24px] bg-slate-50 border border-slate-100 px-4 py-4 flex items-center gap-4 text-left"
              >
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardCheck size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] text-slate-800 font-semibold">Assignments Workspace</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-1">Review created tasks and manage delivery expectations.</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button
                onClick={() => navigate('/faculty/messages')}
                className="rounded-[24px] bg-slate-50 border border-slate-100 px-4 py-4 flex items-center gap-4 text-left"
              >
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] text-slate-800 font-semibold">Student Communication</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-1">Jump into class messaging and student discussion channels.</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>

              <button
                onClick={() => navigate('/faculty/polls')}
                className="rounded-[24px] bg-slate-50 border border-slate-100 px-4 py-4 flex items-center gap-4 text-left"
              >
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BarChart3 size={20} strokeWidth={2.2} />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] text-slate-800 font-semibold">Feedback & Polls</p>
                  <p className="text-[12px] text-slate-400 font-medium mt-1">Capture class sentiment, check understanding, and collect responses.</p>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </button>
            </div>
          </section>
        </main>

        <FacultyDock active="home" />
      </div>
    </div>
  );
};

export default FacultyDashboard;
