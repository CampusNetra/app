import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModerationDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages'); // messages, posts, users

  useEffect(() => {
    fetchReports();
  }, [activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Mock API call
      // const res = await axios.get(`/api/admin/moderation?type=${activeTab}`, {
      //  headers: { Authorization: `Bearer ${token}` }
      // });
      // setReports(res.data);
      
      // Fallback data
      setTimeout(() => {
        setReports([
          {
            id: 1,
            reporter: {
              name: 'Sarah Jenkins',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9U03F4Dz_HWHZNAHxK7wDTAQreqNSzUc_JC_rPpGVZyDjNWvsCOjYN9TVGl9J-CLQBvEryixbe8QqMhWFJtr1VHUQ0oqOYMumviVl-I33BXXo29xLhCJiWurfYgugk65X3wJg8UxjbzsbUYTak5y8EMm79EaKhyE6QOnngMDFM79369R9gCJpS5EWI2Fc61nn6JKA5SItbWiYxx3nfb6G7BOyg3fbBNVtdzJb0pRX5PxfGNrkVtn-XnwA25gHJtRKB9oTlPvJeS4'
            },
            reportedUser: {
              name: 'Mike Thompson',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83-IUpEvIz78u3xTKtEqVmzdMuZoTNRrRW3rmNCDM590lYwqK4RYw5oWizgyDjBSI5C4Db42_MwNZzkb_kT2n8Gva_YM1VvxE2I-_SO9Es3rAUMv40EdZUeT_YqZxM4FCeDfdHURt9VTHXF3o6WrWXbAv9PZHcpmFTuX0CAroWUmO-vOEqcQgSCTALTe7prZso_0efZQKBpfM0P1tecoG3hcwpCyhXxI46PDMNT0THrZGUTTZPllJ7zn2w3AF6SzVMzkiS2hTd3o'
            },
            messagePreview: '"You guys are absolutely useless in this project..."',
            channel: '#cs-101-study',
            reportCount: 7,
            severity: 'orange'
          },
          {
            id: 2,
            reporter: {
              name: 'Emily Chen',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe-RIvehQkflFzEyWjy7PoRZELvmKr3Xy6tI7v0PmGR5i5jCNl3XWMafzq86gIHUBCkYQf6pErCeLYZEPJk7-MKNdVV46gjXKiYf4y8UUUeJbOv3Yluho0hAGQebUscj7V7njY-7r2A4XNuTMO4dQPcY1DH89vNHPxHod52A-7WnJWk61F_mMP3_vNqa2Hewi-NX6ZrV_bSxfgLlRKninhfHCP7kVUeQrtVO3XwLfDSE0q6-ghu9ilxGuOqw3388evFrwSrZ74sok'
            },
            reportedUser: {
              name: 'David Miller',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY-mRaiqiwqrK-fclr8Bkr0ZX7WmnRPb7a6xdU0u3Nh3dlDk5BmCnw76hWBDDOmlD38REOWcIeDnc1zd9LMiTxpjJbQaJdEj3jFIj3XBNZzTySNfMxLuztJPc6RBOViaOr1PrLz7HRZr8XCHnEL6N52I_iKhiBWLM0XKKCwe6nWIBmo5hyGxeRoG0hYcLE9qWA-_fRHCczlYaf9XZzRDNoOrHjGj9RsnHbnQaTx0_SPqwHO7T89kiKadjMUO0eDuXAL58gXYnJ5Pg'
            },
            messagePreview: '"Stop spamming the link every 2 minutes!"',
            channel: '#general',
            reportCount: 2,
            severity: 'slate'
          },
          {
            id: 3,
            reporter: {
              name: 'Jessica Wu',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzLlcXiUNeOClrPLHG3ws7cQZACsQvrXNjYuCxKETEGi7v9cLitWv8BSVfXa7QLN8f92a7Xgvfs9ilBRpnQwu6DuseERywv-6uqb1qjEW705YjhtVnLkd16wsa1jAXowW22Zjt3l3qaCTkABPVub03qFOuj8NPLg-LlkWAkSqjHLt7vqEAT6n8mSsCL3jTsr4MouR2mRIozfReEKcaVTyDBQITvwP1wifa6jnPH3VsTPs8Cy9ZILmLLmDQbzCfy9gIE8Fn0AMg0J8'
            },
            reportedUser: {
              name: 'Leo Garcia',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4qYT-zVYeE0im0vgRCbMB_okdoKeFwwreRT4YSuevhz5XyChg-zdXZj6RxXVO9sF0BM2trLvN0Yq4RtUCeUF66wdGTTjQAqaWvquSgwOEQWXhLoZHQdV8jLv1DkeuXdvTBnitd4sA0MHX7j-r2HH4loq9qffjnzXMDLLxTT6GRDLMJAIvifI7OPwU7wkhufseI1SPDj6KdSmC20ZWraDJ5w7RB7G5thmWdaeNk770Ynd0rYHGzk_lv-wJDkQgKjcbgBQL2zpKEMI'
            },
            messagePreview: '"I have the exam answers for $50, DM me..."',
            channel: '#market-place',
            reportCount: 14,
            severity: 'rose'
          },
          {
            id: 4,
            reporter: {
              name: 'Prof. Higgins',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaBA54amYvR9LhUWUV1kMCIfKuytTokkyBFMUF3fZus3rEJNslGTcL6MuC_fa-kysNjjx7X5xK0lSgRv5cO-MDFYw76VU-YHBXjL3wwKgZnh23NHGN512Rz5KVqq-PXA0Za9ilXLyyFTGVvRSooVUcdpXCvH-NmS3yTL3a_tq7vcu8bqey-5k3sIJPbxeGOZskitzgc9l40HOQo8QAQKMYPS22dCTUV5tJwZwRWID8OVrXkzrmc_Jhc2Hi4swxodn-RjAfUuKpb3U'
            },
            reportedUser: {
              name: 'Ryan Peters',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD62qsHTtq_wqQpShmLukUmPxjrv1jt9523O9BmDfXkJWfkBRVVfAKo8v-pyRSRCStVT0nKnCXsVCvwHSu-uZbudXX_niWKHKKQ7U_v-QLtVBQuiKIXXN9fK7JnBvVw45hSua1m47N86Z3tFANCnWHGbGx_2m2eaDX3KemLCiK5ZtXOoBpuP2_YHmMVWDiUI9JxPUyoSf4krcAY5zqP7RxAPeTFeshJp4hWPDutODGla3OCgw4cVIzYaQNH4kwaOyV2-ckjEe_26rM'
            },
            messagePreview: '"Is anyone else thinking the homework is rigged?"',
            channel: '#calc-2',
            reportCount: 1,
            severity: 'slate'
          }
        ]);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setLoading(false);
    }
  };

  const getSeverityClasses = (severity) => {
    switch (severity) {
      case 'rose':
        return 'bg-rose-100 text-rose-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background-light text-slate-900 custom-scrollbar">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Action Row (optional, based on design needs) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
           <div>
             <h2 className="text-3xl font-extrabold tracking-tight">Moderation</h2>
             <p className="text-slate-500 mt-1">Review reported content and manage community safety.</p>
           </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Pending Messages</span>
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined">chat_error</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">24</span>
              <span className="text-xs font-semibold text-emerald-500 mb-1.5 flex items-center">
                <span className="material-symbols-outlined text-xs">trending_up</span> 12%
              </span>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Flagged Posts</span>
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <span className="material-symbols-outlined">article</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">12</span>
              <span className="text-xs font-semibold text-orange-500 mb-1.5 flex items-center">
                <span className="material-symbols-outlined text-xs">trending_down</span> 5%
              </span>
            </div>
          </div>
          
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Suspensions</span>
              <div className="p-2 rounded-lg bg-slate-500/10 text-slate-500">
                <span className="material-symbols-outlined">person_off</span>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">5</span>
              <span className="text-xs font-semibold text-slate-400 mb-1.5">0% change</span>
            </div>
          </div>
        </div>

        {/* Main Moderation Tabs & Content */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 flex gap-8">
            <button 
              onClick={() => setActiveTab('messages')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${activeTab === 'messages' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Reported Messages
            </button>
            <button 
              onClick={() => setActiveTab('posts')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${activeTab === 'posts' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Reported Posts
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-4 border-b-2 text-sm font-bold transition-colors ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              Suspended Users
            </button>
          </div>

          {/* Reported Messages Table Section */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Reporter</th>
                    <th className="px-6 py-4">Reported User</th>
                    <th className="px-6 py-4">Message Preview</th>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4 text-center">Reports</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : reports.length > 0 ? (
                    reports.map((report) => (
                      <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden">
                              <img src={report.reporter.avatar} alt={report.reporter.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium">{report.reporter.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden">
                              <img src={report.reportedUser.avatar} alt={report.reportedUser.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-sm font-medium">{report.reportedUser.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-600 truncate max-w-[200px]">{report.messagePreview}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tighter">
                            {report.channel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${getSeverityClasses(report.severity)}`}>
                            {report.reportCount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">Review</button>
                            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">Warn</button>
                            <button className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-slate-500">No reports found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer / Pagination */}
            <div className="px-6 py-4 flex items-center justify-between bg-slate-50 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Showing {reports.length} of {Math.max(24, reports.length)} pending reports</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Moderated Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pb-12">
          {/* Recent Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              Recent Actions
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-rose-500">do_not_disturb_on</span>
                  <div>
                    <p className="text-sm font-semibold">Message Deleted</p>
                    <p className="text-xs text-slate-500">Reported by 3 users in #announcements</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400">2m ago</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">warning</span>
                  <div>
                    <p className="text-sm font-semibold">Warning Issued</p>
                    <p className="text-xs text-slate-500">Sent to @user_192 for inappropriate language</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-slate-400">15m ago</span>
              </div>
            </div>
          </div>

          {/* Report Trends */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Report Trends
            </h3>
            <div className="h-32 w-full bg-white border border-slate-200 rounded-xl relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 flex items-end px-4 pb-2 gap-1 justify-around">
                <div className="w-full bg-primary/20 rounded-t-sm h-[40%]"></div>
                <div className="w-full bg-primary/20 rounded-t-sm h-[60%]"></div>
                <div className="w-full bg-primary/40 rounded-t-sm h-[30%]"></div>
                <div className="w-full bg-primary/60 rounded-t-sm h-[80%]"></div>
                <div className="w-full bg-primary/30 rounded-t-sm h-[50%]"></div>
                <div className="w-full bg-primary rounded-t-sm h-[90%] group-hover:h-[95%] transition-all"></div>
                <div className="w-full bg-primary/40 rounded-t-sm h-[40%]"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80 bg-white/80 px-2 py-1 rounded">7 Day Report Frequency</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModerationDashboard;
