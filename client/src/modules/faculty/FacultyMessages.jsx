import React, { useState, useEffect } from "react";
import {
  Search,
  Menu,
  Edit,
  Users,
  Bell,
  MoreVertical,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyDrawer from "./FacultyDrawer";
import FacultyDock from "./FacultyDock";
import api from "../../api";
import "../student/student.css";

const FacultyMessages = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faculty/chat/channels");
      setChannels(res.data || []);
      
      const profileRes = await api.get("/faculty/dashboard");
      setFaculty(profileRes.data.profile);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["All", "Subjects", "Departments", "Clubs"];

  const filteredChannels = channels.filter(c => {
    if (activeTab === "All") return true;
    if (activeTab === "Subjects") return c.type === 'subject';
    if (activeTab === "Departments") return ['branch', 'section', 'department'].includes(c.type);
    if (activeTab === "Clubs") return c.type === 'club';
    return true;
  });

  const subjects = filteredChannels.filter(c => c.type === 'subject');
  const departments = filteredChannels.filter(c => ['branch', 'section', 'department'].includes(c.type));
  const clubs = filteredChannels.filter(c => c.type === 'club');

  const formatTime = (time) => {
    if (!time) return '';
    const date = new Date(time);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderConversation = (conv) => (
    <div 
      key={conv.id} 
      onClick={() => navigate(`/faculty/messages/${conv.id}`)}
      className="flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer border-b border-slate-50/50"
    >
      <div className="relative">
         <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center">
            {['branch', 'section', 'department'].includes(conv.type) ? (
               <div className="w-full h-full bg-orange-600 flex items-center justify-center text-white">
                  <Users size={24} />
               </div>
            ) : conv.avatar_url ? (
               <img src={conv.avatar_url} alt={conv.name} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                  {conv.name?.[0]}
               </div>
            )}
         </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
         <div className="flex justify-between items-center mb-1">
            <h4 className="text-[16px] font-black text-slate-800 tracking-tight truncate pr-2">
               {conv.name}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap uppercase">
               {formatTime(conv.last_message_time)}
            </span>
         </div>
         <div className="flex justify-between items-center">
            <p className="text-[13px] font-bold text-slate-500 truncate pr-4">
               {conv.last_sender ? `${conv.last_sender}: ` : ''}{conv.last_message || 'No messages yet'}
            </p>
            {Number(conv.unread_count || 0) > 0 && (
               <div className="bg-orange-600 text-white text-[10px] font-black min-w-[20px] h-5 rounded-full flex items-center justify-center px-1.5 shadow-md shadow-orange-100">
                  {conv.unread_count}
               </div>
            )}
         </div>
      </div>
    </div>
  );

  return (
    <div className="st-shell">
      <div className="st-mobile-frame bg-white flex flex-col h-full">
        {/* Fixed Header Layout */}
        <header className="bg-white border-b border-slate-50 sticky top-0 z-[100] w-full flex flex-col">
           {/* Row 1: Icons and Title */}
           <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <button className="p-1 -ml-1 text-slate-800" onClick={() => setIsDrawerOpen(true)}>
                 <Menu size={24} />
              </button>
              <h1 className="text-[22px] font-black text-slate-800 tracking-tight">Chats</h1>
              <button className="p-1 -mr-1 text-slate-800">
                 <Edit size={22} />
              </button>
           </div>

           {/* Row 2: Search Bar */}
           <div className="px-6 mb-4">
              <div className="relative w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                    placeholder="Search conversations"
                    className="w-full h-11 bg-slate-50 border-none rounded-2xl pl-11 pr-4 font-bold text-[13px] text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all outline-none"
                 />
              </div>
           </div>

           {/* Row 3: Tabs */}
           <div className="px-6 flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
              {tabs.map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[15px] font-black pb-3 relative whitespace-nowrap transition-colors ${
                     activeTab === tab ? 'text-orange-600' : 'text-slate-400'
                  }`}
                 >
                    {tab}
                    {activeTab === tab && (
                       <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600 rounded-full"></div>
                    )}
                 </button>
              ))}
           </div>
        </header>

        <FacultyDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          faculty={faculty}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar pb-32 bg-white w-full">
           {loading ? (
              <div className="p-10 text-center"><div className="w-8 h-8 border-4 border-slate-50 border-t-orange-600 rounded-full animate-spin mx-auto"></div></div>
           ) : (
              <div className="py-2">
                 {subjects.length > 0 && (activeTab === 'All' || activeTab === 'Subjects') && (
                    <section className="mb-2">
                       <div className="px-6 py-2.5 bg-slate-50/50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subjects</h3>
                       </div>
                       {subjects.map(renderConversation)}
                    </section>
                 )}

                 {departments.length > 0 && (activeTab === 'All' || activeTab === 'Departments') && (
                    <section className="mb-2">
                       <div className="px-6 py-2.5 bg-slate-50/50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departments</h3>
                       </div>
                       {departments.map(renderConversation)}
                    </section>
                 )}

                 {clubs.length > 0 && (activeTab === 'All' || activeTab === 'Clubs') && (
                    <section className="mb-2">
                       <div className="px-6 py-2.5 bg-slate-50/50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clubs</h3>
                       </div>
                       {clubs.map(renderConversation)}
                    </section>
                 )}

                 {filteredChannels.length === 0 && (
                    <div className="py-20 text-center w-full">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Activity size={32} className="text-slate-200" />
                       </div>
                       <p className="text-sm font-bold text-slate-300">No signals found in this category.</p>
                    </div>
                 )}
              </div>
           )}
        </main>

        <FacultyDock active="messages" />
      </div>
    </div>
  );
};

export default FacultyMessages;
