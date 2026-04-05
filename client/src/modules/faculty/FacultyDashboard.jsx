import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ChevronRight, 
  Database, 
  Terminal, 
  ClipboardCheck, 
  UploadCloud, 
  BarChart3,
  Clock,
  MessageCircle,
  Megaphone,
  Menu,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FacultyDock from './FacultyDock';
import FacultyDrawer from './FacultyDrawer';
import api from '../../api';
import '../student/student.css'; // Using the shell styles

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
      const res = await api.get('/faculty/dashboard', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('faculty_token')}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      if (err.response?.status === 401) navigate('/faculty/login');
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

  if (loading) return (
    <div className="st-shell">
      <div className="st-mobile-frame flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );

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
          faculty={data?.profile}
        />

        <main className="flex-1 overflow-y-auto px-6 pb-32 pt-6">
          {/* Greeting */}
          <section className="mb-8">
             <h2 className="text-[28px] font-black leading-tight text-slate-800">
                {getGreeting()}, <span className="text-blue-600">{data?.profile?.name || 'Professor'}</span>
             </h2>
             <p className="text-[14px] font-bold text-slate-400 mt-1">You have {data?.classesToday || 0} classes today.</p>
          </section>

          {/* Subject Summary */}
          <section className="mb-8">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[17px] font-black text-slate-800 tracking-tight">Subject Summary</h3>
                <button onClick={() => navigate('/faculty/subjects')} className="text-[12px] font-black text-blue-600 uppercase tracking-widest">View All</button>
             </div>
             <div className="space-y-3">
                {data?.subjectSummary?.map((subject) => (
                   <div key={subject.offering_id} className="bg-white border border-slate-100 rounded-[24px] p-4 flex items-center gap-4 shadow-sm hover:translate-x-1 transition-transform">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                         {subject.subject_name.toLowerCase().includes('dbms') ? <Database size={24} /> : <Terminal size={24} />}
                      </div>
                      <div className="flex-1">
                         <div className="font-black text-slate-800 text-[15px] leading-tight mb-1">{subject.subject_name} – {subject.section_name}</div>
                         <div className="flex items-center gap-1.5 text-slate-400">
                            <MessageCircle size={14} className="fill-slate-400 opacity-20" />
                            <span className="text-[11px] font-black uppercase tracking-widest">Tap to open chat</span>
                         </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200" />
                   </div>
                ))}
             </div>
          </section>

          {/* Quick Actions */}
          <section className="mb-8">
             <h3 className="text-[17px] font-black text-slate-800 tracking-tight mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/faculty/announcements/new')}
                  className="bg-white border border-slate-100 rounded-[28px] p-6 flex flex-col items-center text-center shadow-sm"
                >
                   <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mb-4">
                      <Megaphone size={24} />
                   </div>
                   <span className="text-[13px] font-black text-slate-800 leading-tight">Post<br/>Announcement</span>
                </button>
                <button 
                  onClick={() => navigate('/faculty/assignments/new')}
                  className="bg-white border border-slate-100 rounded-[28px] p-6 flex flex-col items-center text-center shadow-sm"
                >
                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                      <ClipboardCheck size={24} />
                   </div>
                   <span className="text-[13px] font-black text-slate-800 leading-tight">Create<br/>Assignment</span>
                </button>
                 <button 
                    onClick={() => navigate('/faculty/materials/new')}
                    className="bg-white border border-slate-100 rounded-[28px] p-6 flex flex-col items-center text-center shadow-sm"
                 >
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
                       <UploadCloud size={24} />
                    </div>
                    <span className="text-[13px] font-black text-slate-800 leading-tight">Upload<br/>Material</span>
                 </button>
                 <button 
                    onClick={() => navigate('/faculty/polls/new')}
                    className="bg-white border border-slate-100 rounded-[28px] p-6 flex flex-col items-center text-center shadow-sm"
                 >
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-4">
                       <BarChart3 size={24} />
                    </div>
                    <span className="text-[13px] font-black text-slate-800 leading-tight">Start<br/>Poll</span>
                 </button>
             </div>
          </section>

          {/* Recent Activity */}
          <section className="mb-0">
             <h3 className="text-[17px] font-black text-slate-800 tracking-tight mb-4">Recent Activity</h3>
             <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                {(data?.recentActivity || []).length > 0 ? (
                   data.recentActivity.map((activity, idx) => (
                      <div key={idx} className={`p-5 flex gap-4 ${idx !== data.recentActivity.length - 1 ? 'border-b border-slate-50' : ''}`}>
                         <div className="relative">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                               {activity.sender_avatar ? (
                                  <img src={activity.sender_avatar} alt="Sender" className="w-full h-full object-cover" />
                               ) : (
                                  <div className={`w-full h-full flex items-center justify-center text-white font-black text-sm ${activity.activity_type === 'message' ? 'bg-blue-600' : 'bg-orange-500'}`}>
                                     {activity.sender_name[0]}
                                  </div>
                               )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-white flex items-center justify-center overflow-hidden">
                               {activity.activity_type === 'message' ? <MessageCircle size={10} className="text-blue-600" /> : <Megaphone size={10} className="text-orange-500" />}
                            </div>
                         </div>
                         <div className="flex-1">
                            <p className="text-[13px] font-bold text-slate-500 leading-normal">
                               <span className="font-black text-slate-800">{activity.sender_name}</span> {activity.activity_type === 'message' ? 'sent a message in' : 'posted an'} <span className="text-blue-600">{activity.channel_name || activity.content}</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-slate-300">
                               <Clock size={12} strokeWidth={3} />
                               <span className="text-[10px] font-black uppercase tracking-wider">{new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </div>
                      </div>
                   ))
                ) : (
                   <div className="p-10 text-center">
                      <p className="text-slate-400 font-bold text-sm">No recent activity found.</p>
                   </div>
                )}
             </div>
          </section>
        </main>

        <FacultyDock active="home" />
      </div>
    </div>
  );
};

export default FacultyDashboard;
