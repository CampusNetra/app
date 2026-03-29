import React from 'react';
import { CalendarDays, Home, MessageSquare, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDock = ({ active = 'feed' }) => {
  const navigate = useNavigate();

  const items = [
    { key: 'feed', label: 'FEED', icon: Home, path: '/student/feed' },
    { key: 'events', label: 'EVENTS', icon: CalendarDays, path: '/student/events' },
    { key: 'chat', label: 'CHAT', icon: MessageSquare, path: '/student/chat' },
    { key: 'profile', label: 'PROFILE', icon: UserCircle2, path: '/student/profile' }
  ];

  return (
    <nav className="st-bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;

        return (
          <button
            key={item.key}
            type="button"
            className={`st-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <Icon size={22} style={{ margin: '0 auto 4px' }} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};

export default StudentDock;
