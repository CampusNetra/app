import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserSquare2,
  Grid2X2,
  BookOpen,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  Club,
  ShieldAlert,
  Upload,
  TrendingUp,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@campusnetra.com' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser({ name: 'Admin User', email: 'admin@campusnetra.com' });
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const getInitials = (name) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };
  const menuGroups = [
    {
      label: null,
      items: [
        { name: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' }
      ]
    },
    {
      label: 'MANAGEMENT',
      items: [
        { name: 'Students', icon: Users, path: '/admin/students' },
        { name: 'Faculty', icon: UserSquare2, path: '/admin/faculty' },
        { name: 'Branches', icon: Grid2X2, path: '/admin/branches' },
        { name: 'Sections', icon: Grid2X2, path: '/admin/sections' },
        { name: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
        { name: 'Faculty Assignments', icon: ClipboardCheck, path: '/admin/assignments' },
        { name: 'Academic Terms', icon: Calendar, path: '/admin/terms' }
      ]
    },
    {
      label: 'COMMUNICATION',
      items: [
        { name: 'Channels', icon: MessageSquare, path: '/admin/channels' },
        { name: 'Clubs', icon: Club, path: '/admin/clubs' },
        { name: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Data Import', icon: Upload, path: '/admin/import' },
        { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' }
      ]
    }
  ];

  if (!isOpen) {
    return (
      <aside className="w-20 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 transition-all duration-300 relative z-20">
        <div className="h-16 flex items-center justify-center border-b border-slate-200">
           <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">C</div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar flex flex-col items-center gap-2">
           {menuGroups.map((group, groupIdx) => (
             <React.Fragment key={groupIdx}>
               {group.items.map((item) => {
                 const Icon = item.icon;
                 return (
                   <NavLink
                     key={item.name}
                     to={item.path}
                     className={({ isActive }) =>
                       `w-12 h-12 flex items-center justify-center rounded-xl mb-1 transition-all ${
                         isActive
                           ? 'bg-primary/10 text-primary'
                           : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                       }`
                     }
                     title={item.name}
                   >
                     <Icon size={22} />
                   </NavLink>
                 );
               })}
               {groupIdx < menuGroups.length - 1 && <div className="w-8 h-px bg-slate-200 my-2"></div>}
             </React.Fragment>
           ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 transition-all duration-300 relative z-20">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-lg">C</div>
          <span className="font-bold text-xl tracking-tight text-slate-900">CampusConnect</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        {menuGroups.map((group, index) => (
          <div key={index} className={index > 0 ? 'mt-8' : ''}>
            {group.label && (
              <h3 className="text-xs font-bold text-slate-400 mb-3 ml-3 tracking-wider">{group.label}</h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`
                      }
                    >
                      <Icon size={20} />
                      {item.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 hover:bg-slate-100 transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{user.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 truncate">{user.email || 'admin@campusnetra.com'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
