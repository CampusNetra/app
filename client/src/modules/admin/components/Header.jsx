import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  
  // Format pathname into a readable title (e.g., /admin/dashboard -> Dashboard)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const currentPath = pathParts[pathParts.length - 1] || 'dashboard';
  const pageTitle = currentPath.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="text-slate-500 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-500">Admin</span>
          <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
          <span className="font-semibold text-slate-800">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
          <input 
            type="text" 
            placeholder="Search students, faculty..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <button className="relative text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">System Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white cursor-pointer hover:ring-slate-100 transition-all">
            AU
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
