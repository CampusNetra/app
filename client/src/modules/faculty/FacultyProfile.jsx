import React, { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  ClipboardCheck,
  LogOut,
  Megaphone,
  Menu,
  Radio,
  Shield,
  User,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import FacultyDrawer from './FacultyDrawer';
import FacultyDock from './FacultyDock';
import '../student/student.css';

const FacultyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [dashboardRes, subjectsRes, assignmentsRes, announcementsRes, pollsRes] = await Promise.all([
        api.get('/faculty/dashboard'),
        api.get('/faculty/subjects'),
        api.get('/faculty/assignments'),
        api.get('/faculty/announcements'),
        api.get('/faculty/polls')
      ]);

      setProfile(dashboardRes.data.profile);
      setSubjects(subjectsRes.data);
      setAssignments(assignmentsRes.data);
      setAnnouncements(announcementsRes.data);
      setPolls(pollsRes.data);
    } catch (err) {
      console.error('Failed to fetch faculty profile data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'F';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('faculty_token');
    localStorage.removeItem('faculty_user');
    navigate('/faculty/login');
  };

  const totalStudents = subjects.reduce((sum, subject) => sum + Number(subject.student_count || 0), 0);
  const totalChannels = subjects.filter((subject) => subject.channel_id).length;

  const statCards = [
    {
      label: 'Subjects',
      value: subjects.length,
      icon: BookOpen,
      tone: 'bg-orange-50 text-orange-600'
    },
    {
      label: 'Students',
      value: totalStudents,
      icon: Users,
      tone: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Assignments',
      value: assignments.length,
      icon: ClipboardCheck,
      tone: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Announcements',
      value: announcements.length,
      icon: Megaphone,
      tone: 'bg-amber-50 text-amber-600'
    }
  ];

  if (loading) {
    return (
      <div className="st-shell">
        <div className="st-mobile-frame flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
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
             <button className="p-2.5 text-slate-800 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={24} strokeWidth={2.25} />
             </button>
          </div>
        </header>

        <FacultyDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          faculty={profile}
        />

        <main className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar pb-32">
          <section className="mb-6 rounded-[32px] bg-white border border-slate-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-[28px] bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl font-semibold text-orange-600 overflow-hidden shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile?.name || 'Faculty'} className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile?.name)
                )}
              </div>

              <div className="min-w-0">
                <h2 className="text-[26px] font-semibold text-slate-800 tracking-tight leading-tight">{profile?.name || 'Faculty Member'}</h2>
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-orange-600 mt-2">
                  {profile?.role || 'faculty'}
                </p>
                <p className="text-[14px] font-medium text-slate-500 mt-3 leading-relaxed">
                  Your faculty account summary with teaching load, publishing activity, and institutional details.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3 mb-6">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${card.tone}`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{card.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{card.label}</div>
                </div>
              );
            })}
          </section>

          <section className="rounded-[30px] bg-white border border-slate-100 p-5 shadow-sm mb-6">
            <h3 className="text-[18px] font-semibold text-slate-800 tracking-tight mb-4">Faculty Details</h3>
            <div className="space-y-4">
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Email</p>
                <p className="text-[14px] font-medium text-slate-800 break-all">{profile?.email || 'Not available'}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Office Location</p>
                <p className="text-[14px] font-medium text-slate-800">{profile?.office_location || 'Not updated yet'}</p>
              </div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Live Channels</p>
                <p className="text-[14px] font-medium text-slate-800">{totalChannels} linked teaching channels</p>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] bg-white border border-slate-100 p-5 shadow-sm mb-6">
            <h3 className="text-[18px] font-semibold text-slate-800 tracking-tight mb-4">Academic Activity</h3>
            <div className="space-y-3">
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <BookOpen size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{subjects.length} active subject offerings</p>
                  <p className="text-[12px] font-medium text-slate-400">Currently mapped to your faculty account</p>
                </div>
              </div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ClipboardCheck size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{assignments.length} assignments published</p>
                  <p className="text-[12px] font-medium text-slate-400">Across your teaching sections</p>
                </div>
              </div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Megaphone size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{announcements.length} announcements broadcast</p>
                  <p className="text-[12px] font-medium text-slate-400">Using your faculty account</p>
                </div>
              </div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Radio size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">{polls.length} polls created</p>
                  <p className="text-[12px] font-medium text-slate-400">For class feedback and quick checks</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] bg-white border border-slate-100 p-5 shadow-sm mb-12">
            <h3 className="text-[18px] font-semibold text-slate-800 tracking-tight mb-4">Account</h3>
            <div className="space-y-3">
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <User size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">Personal Information</p>
                  <p className="text-[12px] font-medium text-slate-400">Faculty profile details shown above</p>
                </div>
              </div>

              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <Shield size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-slate-800">Session Security</p>
                  <p className="text-[12px] font-medium text-slate-400">Logout when you finish using the faculty workspace</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-white border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:bg-rose-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                  <LogOut size={18} strokeWidth={2.2} />
                </div>
                <span className="flex-1 text-left font-semibold text-rose-500">Log Out</span>
              </button>
            </div>
          </section>
        </main>

        <FacultyDock active="profile" />
      </div>
    </div>
  );
};

export default FacultyProfile;
