import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronRight, Search, Bell } from 'lucide-react';

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
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-slate-500">Admin</span>
          <ChevronRight size={16} className="text-slate-400" />
          <span className="font-semibold text-slate-800">{pageTitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden md:block">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students, faculty..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>

        <button className="relative text-slate-500 hover:text-slate-700 transition-colors p-2 rounded-full hover:bg-slate-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
