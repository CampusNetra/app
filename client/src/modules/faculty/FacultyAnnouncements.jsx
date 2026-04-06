import React, { useState, useEffect } from 'react';
import { Megaphone, Search, Menu, Bell, Calendar, Send } from 'lucide-react';
import FacultyDrawer from './FacultyDrawer';
import FacultyDock from './FacultyDock';
import api from '../../api';
import '../student/student.css';

const FacultyAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [announcementsRes, profileRes] = await Promise.all([
        api.get('/faculty/announcements'),
        api.get('/faculty/dashboard')
      ]);
      setAnnouncements(announcementsRes.data);
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAudience = (announcement) => {
    if (announcement.target_sections) return announcement.target_sections;
    if (announcement.target_depts) return announcement.target_depts;
    if (announcement.visibility === 'department') return 'Department';
    if (announcement.visibility === 'section') return 'Selected sections';
    return 'All students';
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const haystack = [
      announcement.title,
      announcement.content,
      announcement.type,
      announcement.visibility,
      announcement.target_sections,
      announcement.target_depts
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
                Official <span className="text-orange-600">Announcements</span>
             </h2>
             <p className="text-[14px] font-medium text-slate-400 mt-1">Announcements created by you, with real targets and visibility from the database.</p>
          </section>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-3">
                   <Megaphone size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{announcements.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Published</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                   <Send size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">
                  {announcements.filter((announcement) => announcement.visibility === 'section').length}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Section Targeted</div>
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full h-13 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-medium text-sm text-slate-800 outline-none focus:border-orange-400 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-40 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : filteredAnnouncements.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Megaphone size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {announcements.length === 0 ? 'No announcements yet' : 'No matching announcements'}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 max-w-[220px] mx-auto">
                    {announcements.length === 0 ? 'Your faculty announcement history will appear here once you publish one.' : 'Try searching by title, audience, or visibility.'}
                  </p>
               </div>
            ) : (
               filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-start gap-3 mb-4">
                        <div className="flex flex-wrap gap-2">
                           <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-[0.14em] bg-orange-50 text-orange-600">
                              {announcement.type || 'normal'}
                           </span>
                           <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-semibold uppercase tracking-[0.14em]">
                              {announcement.visibility || 'all'}
                           </span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{new Date(announcement.created_at).toLocaleDateString()}</span>
                     </div>

                     <h4 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-snug mb-2">{announcement.title}</h4>
                     <p className="text-[13px] font-medium text-slate-500 leading-relaxed mb-4">{announcement.content}</p>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-3">
                        <div className="min-w-0">
                           <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1">Audience</p>
                           <p className="text-[12px] font-medium text-slate-700 truncate">{getAudience(announcement)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                           <Calendar size={12} strokeWidth={2.2} />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">
                             Posted
                           </span>
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

export default FacultyAnnouncements;
