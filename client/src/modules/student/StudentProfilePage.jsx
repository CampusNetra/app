import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Settings, 
  ChevronRight, 
  User, 
  Shield, 
  LogOut, 
  Code, 
  Cpu, 
  Info,
  Hash,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import StudentDock from './StudentDock';
import './student.css';

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/profile');
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    localStorage.removeItem('student_login');
    navigate('/student/splash');
  };

  if (loading) {
    return (
      <div className="st-shell">
        <div className="st-mobile-frame flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Combine dept and section for "show it once" request
  const academicInfo = `${profile?.dept_name}${profile?.section_name ? ` (${profile.section_name})` : ''}`;

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-slate-50/50">
        <header className="st-topbar bg-white border-none px-6">
          <button className="st-icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">Profile</h1>
          <button className="st-icon-btn">
            <Settings size={22} className="text-slate-500" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar pb-32">
          {/* Hero Section - Removed Pencil Icon as requested */}
          <section className="st-profile-hero flex flex-col items-center pt-8 pb-6 px-6">
            <div className="st-profile-avatar-wrap relative mb-5">
              <div className="w-28 h-28 rounded-full border border-slate-100 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-slate-300">{getInitials(profile?.name)}</span>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{profile?.name || 'Loading Name...'}</h2>
            <div className="text-[14px] font-black text-orange-500 uppercase tracking-widest mb-3">{profile?.reg_no || '---'}</div>
            <div className="text-[15px] font-bold text-slate-500">{academicInfo}</div>
          </section>

          {/* My Clubs - Added empty state message */}
          <section className="px-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[17px] font-black text-slate-800 tracking-tight">My Clubs</h3>
              <button className="text-[12px] font-black text-orange-500 uppercase tracking-widest">SEE ALL</button>
            </div>
            {profile?.clubs?.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar-hide">
                {profile.clubs.map(club => (
                  <div key={club.id} className="min-w-[160px] flex-1 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                      {club.category === 'technical' ? <Code size={20} /> : <Cpu size={20} />}
                    </div>
                    <div className="font-black text-slate-800 text-[14px] leading-tight mb-1">{club.name}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{club.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-white border border-slate-100 rounded-2xl text-center">
                 <div className="mb-3 text-slate-300 flex justify-center"><Info size={28} /></div>
                 <p className="text-[13px] text-slate-400 font-bold leading-relaxed">You haven't followed any clubs yet.</p>
                 <button className="mt-3 text-[11px] font-black text-orange-500 uppercase tracking-widest border border-orange-100 px-4 py-2 rounded-full">Explore Clubs</button>
              </div>
            )}
          </section>

          {/* Joined Groups - Now fetching and showing real joined groups */}
          <section className="px-6 mb-8">
            <h3 className="text-[17px] font-black text-slate-800 tracking-tight mb-4">Joined Groups</h3>
            <div className="grid grid-cols-1 gap-3">
              {(profile?.joinedGroups || []).length > 0 ? (
                profile.joinedGroups.map((group) => (
                  <div key={group.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:translate-x-1 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <Hash size={18} strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-700 text-sm">{group.name}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{group.type} • {group.role}</div>
                    </div>
                    <button className="p-2 text-slate-200">
                      <ArrowRight size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-white/50 border border-slate-100 border-dashed rounded-2xl text-center text-slate-400 font-bold text-sm">
                  No joined groups found.
                </div>
              )}
            </div>
          </section>

          {/* Account */}
          <section className="px-6 mb-12">
            <h3 className="text-[17px] font-black text-slate-800 tracking-tight mb-4">Account</h3>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <User size={20} fill="currentColor" className="opacity-20 translate-x-[-1px]" />
                  <User size={20} className="absolute" />
                </div>
                <span className="flex-1 text-left font-bold text-slate-700">Personal Information</span>
                <ChevronRight size={18} className="text-slate-200" />
              </button>

              <button className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <Shield size={20} />
                </div>
                <span className="flex-1 text-left font-bold text-slate-700">Privacy & Security</span>
                <ChevronRight size={18} className="text-slate-200" />
              </button>

              <button 
                onClick={handleLogout}
                className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:bg-red-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                  <LogOut size={20} />
                </div>
                <span className="flex-1 text-left font-bold text-red-500">Log Out</span>
              </button>
            </div>
          </section>
        </main>

        <StudentDock active="profile" />
      </div>
    </div>
  );
};

export default StudentProfilePage;
