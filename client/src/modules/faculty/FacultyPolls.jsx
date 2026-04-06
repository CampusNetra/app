import React, { useState, useEffect } from 'react';
import { BarChart2, Search, Menu, Users, Bell, ListChecks } from 'lucide-react';
import FacultyDrawer from './FacultyDrawer';
import FacultyDock from './FacultyDock';
import api from '../../api';
import '../student/student.css';

const FacultyPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pollsRes, profileRes] = await Promise.all([
        api.get('/faculty/polls'),
        api.get('/faculty/dashboard')
      ]);
      setPolls(pollsRes.data);
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolls = polls.filter((poll) => {
    const haystack = [poll.question, ...(poll.options || [])].join(' ').toLowerCase();
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
                Live <span className="text-orange-600">Polls</span>
             </h2>
             <p className="text-[14px] font-medium text-slate-400 mt-1">Poll questions and response counts from your actual faculty records.</p>
          </section>

          <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-3">
                   <BarChart2 size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">{polls.length}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Polls</div>
             </div>
             <div className="bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3">
                   <Users size={18} strokeWidth={2.2} />
                </div>
                <div className="text-[20px] font-semibold text-slate-800 leading-none mb-1">
                  {polls.reduce((sum, poll) => sum + Number(poll.response_count || 0), 0)}
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Responses</div>
             </div>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search polls..."
              className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 font-medium text-sm text-slate-800 outline-none focus:border-orange-400 transition-all shadow-sm"
            />
          </div>

          <div className="space-y-4">
            {loading ? (
                [1, 2, 3].map((i) => <div key={i} className="h-44 bg-slate-100 rounded-[32px] animate-pulse"></div>)
            ) : filteredPolls.length === 0 ? (
               <div className="py-20 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <BarChart2 size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {polls.length === 0 ? 'No polls yet' : 'No matching polls'}
                  </h3>
                  <p className="text-sm font-medium text-slate-400 max-w-[220px] mx-auto">
                    {polls.length === 0 ? 'Create a poll to collect class feedback.' : 'Try searching by question or option text.'}
                  </p>
               </div>
            ) : (
               filteredPolls.map((poll) => (
                  <div key={poll.id} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm active:scale-[0.98] transition-all">
                     <div className="flex justify-between items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-9 h-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                              <BarChart2 size={16} strokeWidth={2.2} />
                           </div>
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                              {new Date(poll.created_at).toLocaleDateString()}
                           </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                           <Users size={12} strokeWidth={2.4} />
                           <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{poll.response_count} voted</span>
                        </div>
                     </div>

                     <h4 className="text-[17px] font-semibold text-slate-800 tracking-tight leading-snug mb-4">{poll.question}</h4>

                     <div className="space-y-3 mb-4">
                        {(poll.option_results || []).map((result) => (
                           <div key={result.option_index} className="min-h-10 bg-slate-50/70 rounded-xl border border-slate-100 px-4 py-3">
                              <div className="flex items-center justify-between gap-3 mb-2">
                                 <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-semibold shrink-0">
                                      {result.option_index + 1}
                                    </div>
                                    <span className="text-[13px] font-medium text-slate-600 truncate">{result.option}</span>
                                 </div>
                                 <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                                   {result.vote_count} • {result.percentage}%
                                 </span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-orange-500"
                                  style={{ width: `${result.percentage}%` }}
                                />
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="pt-4 border-t border-slate-50 flex items-center gap-2 text-slate-400">
                        <ListChecks size={13} strokeWidth={2.2} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">{poll.options.length} options configured</span>
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

export default FacultyPolls;
