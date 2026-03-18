import React, { useState } from 'react';

const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, 90days

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background-light text-slate-900 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Title Section */}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">System Analytics</h3>
            <p className="text-slate-500 text-sm mt-1">Real-time performance metrics across the campus network.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1 border border-slate-200 rounded-lg shadow-sm">
            <button 
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timeRange === '7days' ? 'bg-slate-100 font-semibold' : 'font-medium text-slate-500 hover:text-slate-900'}`}
            >
              Last 7 days
            </button>
            <button 
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timeRange === '30days' ? 'bg-slate-100 font-semibold' : 'font-medium text-slate-500 hover:text-slate-900'}`}
            >
              30 days
            </button>
            <button 
              onClick={() => setTimeRange('90days')}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors ${timeRange === '90days' ? 'bg-slate-100 font-semibold' : 'font-medium text-slate-500 hover:text-slate-900'}`}
            >
              90 days
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <span className="material-symbols-outlined text-slate-400">groups</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h4 className="text-2xl font-bold">12,482</h4>
              <span className="text-xs font-medium text-emerald-500 flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                12%
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Daily Active</p>
              <span className="material-symbols-outlined text-slate-400">bolt</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h4 className="text-2xl font-bold">8,210</h4>
              <span className="text-xs font-medium text-emerald-500 flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                4.3%
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Club Events</p>
              <span className="material-symbols-outlined text-slate-400">event</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h4 className="text-2xl font-bold">156</h4>
              <span className="text-xs font-medium text-emerald-500 flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                18%
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total Reach</p>
              <span className="material-symbols-outlined text-slate-400">visibility</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h4 className="text-2xl font-bold">45.2k</h4>
              <span className="text-xs font-medium text-rose-500 flex items-center">
                <span className="material-symbols-outlined text-[14px]">trending_down</span>
                2.1%
              </span>
            </div>
          </div>
        </div>

        {/* Main Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Active Users - Line Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="font-bold text-sm">Daily Active Users (DAU)</h5>
                <p className="text-xs text-slate-500">Peak activity usually occurs on Wednesdays</p>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>
            <div className="flex-1 min-h-[240px] flex flex-col justify-between">
              <svg className="w-full h-48 overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="chart-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ec5b13" stopOpacity="0.2"></stop>
                    <stop offset="100%" stopColor="#ec5b13" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {/* Area */}
                <path fill="url(#chart-gradient)" d="M0,80 C20,70 40,90 60,60 C80,30 100,40 120,20 C140,0 160,50 180,40 C200,30 220,70 240,65 C260,60 280,30 300,40 C320,50 340,10 360,20 C380,30 400,20 400,20 L400,100 L0,100 Z"></path>
                {/* Line */}
                <path d="M0,80 C20,70 40,90 60,60 C80,30 100,40 120,20 C140,0 160,50 180,40 C200,30 220,70 240,65 C260,60 280,30 300,40 C320,50 340,10 360,20 C380,30 400,20 400,20" fill="none" stroke="#ec5b13" strokeWidth="2.5"></path>
              </svg>
              <div className="flex justify-between mt-4 px-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day} className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{day}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Messages Sent - Bar Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="font-bold text-sm">Messages Sent</h5>
                <p className="text-xs text-slate-500">Volume of student interactions per day</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Direct
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> Group
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-h-[240px] flex items-end justify-between gap-4 px-2">
              {[
                { day: 'Mon', h: 'h-24', inner: 'h-[60%]' },
                { day: 'Tue', h: 'h-32', inner: 'h-[80%]' },
                { day: 'Wed', h: 'h-40', inner: 'h-[95%]' },
                { day: 'Thu', h: 'h-36', inner: 'h-[75%]' },
                { day: 'Fri', h: 'h-28', inner: 'h-[40%]' },
                { day: 'Sat', h: 'h-16', inner: 'h-[20%]' },
                { day: 'Sun', h: 'h-12', inner: 'h-[15%]' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col flex-1 items-center gap-2">
                  <div className={`w-full bg-primary/20 rounded-t-md relative group ${item.h}`}>
                    <div className={`absolute bottom-0 w-full bg-primary rounded-t-md ${item.inner} transition-all group-hover:bg-primary/90`}></div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Club Engagement - Donut Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col mb-8">
              <h5 className="font-bold text-sm">Engagement by Club Type</h5>
              <p className="text-xs text-slate-500">Distribution of active memberships</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-slate-100" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                  <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3"></circle>
                  <circle className="stroke-slate-400" cx="18" cy="18" fill="none" r="16" strokeDasharray="15, 100" strokeDashoffset="-75" strokeLinecap="round" strokeWidth="3"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">128</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Total Clubs</span>
                </div>
              </div>
              
              <div className="w-full mt-8 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="text-xs font-medium">Academic</span>
                  </div>
                  <span className="text-xs text-slate-500">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="text-xs font-medium">Sports</span>
                  </div>
                  <span className="text-xs text-slate-500">30%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="text-xs font-medium">Arts &amp; Culture</span>
                  </div>
                  <span className="text-xs text-slate-500">25%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Posted - Feed Style */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="font-bold text-sm">Recent Announcements</h5>
                <p className="text-xs text-slate-500">Reach and impact of campus-wide updates</p>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline">View all</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase">Announcement</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase">Views</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase">CTR</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">Spring Semester Registration</span>
                        <span className="text-[10px] text-slate-500">Posted 2h ago by Admin</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs">2,410</td>
                    <td className="py-4 text-xs">12.5%</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[85%]"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">Career Fair 2024 Schedule</span>
                        <span className="text-[10px] text-slate-500">Posted 5h ago by Career Office</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs">1,890</td>
                    <td className="py-4 text-xs">8.2%</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[60%]"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">Campus Cafeteria - New Menu</span>
                        <span className="text-[10px] text-slate-500">Posted Yesterday by Services</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs">4,200</td>
                    <td className="py-4 text-xs">24.1%</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[95%]"></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">Maintenance Notice: Wing B</span>
                        <span className="text-[10px] text-slate-500">Posted 2 days ago by Facilities</span>
                      </div>
                    </td>
                    <td className="py-4 text-xs">950</td>
                    <td className="py-4 text-xs">4.2%</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[30%]"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemAnalytics;
