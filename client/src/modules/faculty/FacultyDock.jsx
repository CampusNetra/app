import React from 'react';
import { Home, BookOpen, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FacultyDock = ({ active = 'home' }) => {
  const navigate = useNavigate();

  const items = [
    { key: 'home', icon: Home, label: 'HOME', path: '/faculty/dashboard' },
    { key: 'subjects', icon: BookOpen, label: 'SUBJECTS', path: '/faculty/subjects' },
    { key: 'messages', icon: MessageSquare, label: 'MESSAGES', path: '/faculty/messages' },
    { key: 'profile', icon: User, label: 'PROFILE', path: '/faculty/profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-8 py-4 flex items-center justify-between z-[100] shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        
        return (
          <button 
            key={item.key}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
              isActive ? 'text-orange-600' : 'text-slate-300'
            }`}
          >
            <div className={`transition-all ${isActive ? 'scale-105 drop-shadow-[0_0_8px_rgba(249,115,22,0.18)]' : 'opacity-70'}`}>
               <Icon size={24} strokeWidth={isActive ? 1.9 : 1.7} />
            </div>
            <span className={`text-[10px] font-black tracking-[0.05em] transition-colors ${
               isActive ? 'text-orange-600' : 'text-slate-400'
            }`}>
               {item.label}
            </span>
            {isActive && (
               <div className="absolute -top-1 w-1 h-1 bg-orange-500 rounded-full animate-pulse"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default FacultyDock;
