import React from "react";
import {
  X,
  Home,
  ClipboardList,
  Megaphone,
  Layers,
  BarChart2,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const FacultyDrawer = ({ isOpen, onClose, faculty }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      sub: "Overview & key metrics", 
      path: "/faculty/dashboard",
      color: "bg-blue-50 text-blue-600"
    },
    { 
      icon: ClipboardList, 
      label: "Assignments", 
      sub: "Manage tasks & submissions", 
      path: "/faculty/assignments",
      color: "bg-orange-50 text-orange-600"
    },
    { 
      icon: Megaphone, 
      label: "Announcements", 
      sub: "Broadcast official updates", 
      path: "/faculty/announcements",
      color: "bg-purple-50 text-purple-600"
    },
    { 
      icon: Layers, 
      label: "Materials", 
      sub: "Share resources & notes", 
      path: "/faculty/materials",
      color: "bg-indigo-50 text-indigo-600"
    },
    { 
      icon: BarChart2, 
      label: "Pollings", 
      sub: "Engage with live feedback", 
      path: "/faculty/polls",
      color: "bg-emerald-50 text-emerald-600"
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("faculty_token");
    localStorage.removeItem("faculty_user");
    navigate("/faculty/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-[340px] max-w-[85vw] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col pt-2 overflow-hidden">
          {/* Header Profile Section */}
          <div className="px-6 py-6 flex items-center justify-between border-b border-slate-50 mb-2">
             <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 bg-orange-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-100 ring-4 ring-white">
                  {faculty?.avatar_url ? (
                    <img src={faculty.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    faculty?.name ? faculty.name[0].toUpperCase() : "A"
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                   <h3 className="font-black text-[18px] text-slate-800 tracking-tight leading-tight mb-0.5 break-all">
                      {faculty?.name || "Faculty Member"}
                   </h3>
                   <span className="text-[12px] font-bold text-slate-400 break-all leading-snug">
                      {faculty?.email || "faculty@domain.com"}
                   </span>
                </div>
             </div>
             <button onClick={onClose} className="p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-slate-400 flex-shrink-0 ml-2">
                <X size={20} />
             </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-3 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-[24px] transition-all duration-300 ${
                    active ? "bg-slate-50/80 ring-1 ring-slate-100/50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-active:scale-95 ${item.color}`}>
                    <Icon size={20} className="stroke-[2.5]" />
                  </div>
                  
                  <div className="flex-1 text-left min-w-0">
                     <p className={`text-[14px] tracking-tight leading-tight mb-0.5 break-words ${active ? "font-black text-slate-800" : "font-bold text-slate-800"}`}>
                        {item.label}
                     </p>
                     <p className="text-[11px] font-bold text-slate-400 truncate">
                        {item.sub}
                     </p>
                  </div>

                  <ChevronRight size={16} className={`transition-all duration-300 flex-shrink-0 ${active ? "opacity-100 text-orange-600 translate-x-1" : "opacity-20 text-slate-400"}`} />
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="px-6 py-6 border-t border-slate-50 flex flex-col items-center gap-4">
            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 text-rose-600 h-16 rounded-[24px] flex items-center justify-center gap-2.5 font-black text-sm uppercase tracking-[1.5px] active:scale-[0.98] transition-all"
            >
              <LogOut size={18} className="stroke-[3]" />
              <span>Logout System</span>
            </button>

            <div className="flex flex-col items-center gap-0.5">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">CampusNetra v1.0.0</span>
               <p className="text-[10px] font-bold text-slate-400">
                  Built with <span className="text-rose-500 mx-0.5">❤️</span> by <span className="text-slate-800 font-black">Syntax Sinners</span>
               </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FacultyDrawer;
