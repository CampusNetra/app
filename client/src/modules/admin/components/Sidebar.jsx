import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuGroups = [
    {
      label: null,
      items: [
        { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' }
      ]
    },
    {
      label: 'MANAGEMENT',
      items: [
        { name: 'Students', icon: 'school', path: '/admin/students' },
        { name: 'Faculty', icon: 'person', path: '/admin/faculty' },
        { name: 'Branches', icon: 'category', path: '/admin/branches' },
        { name: 'Sections', icon: 'groups', path: '/admin/sections' },
        { name: 'Subjects', icon: 'local_library', path: '/admin/subjects' },
        { name: 'Faculty Assignments', icon: 'assignment_ind', path: '/admin/assignments' },
        { name: 'Academic Terms', icon: 'calendar_today', path: '/admin/terms' }
      ]
    },
    {
      label: 'COMMUNICATION',
      items: [
        { name: 'Channels', icon: 'forum', path: '/admin/channels' },
        { name: 'Clubs', icon: 'card_membership', path: '/admin/clubs' },
        { name: 'Moderation', icon: 'gavel', path: '/admin/moderation' }
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { name: 'Data Import', icon: 'upload_file', path: '/admin/import' },
        { name: 'Analytics', icon: 'trending_up', path: '/admin/analytics' },
        { name: 'Settings', icon: 'settings', path: '/admin/settings' }
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
               {group.items.map((item) => (
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
                   <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                 </NavLink>
               ))}
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
              {group.items.map((item) => (
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
                    <span className={`material-symbols-outlined text-[22px] ${
                      ({ isActive }) => isActive ? 'text-primary' : 'text-slate-400'
                    }`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=1e293b&color=fff" alt="Admin" className="w-10 h-10 rounded-full bg-slate-200"/>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@campusconnect.edu</p>
          </div>
          <button className="text-slate-400 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
