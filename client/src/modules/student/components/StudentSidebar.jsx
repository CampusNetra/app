import React from 'react';
import { 
  Home, 
  Rss, 
  MessageSquare, 
  ShoppingBag, 
  Users, 
  Calendar, 
  UserCircle2,
  LogOut
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const StudentSidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/student/feed' },
    { id: 'feed', label: 'Feed', icon: Rss, path: '/student/feed' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/student/chat' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, path: '/student/marketplace' },
    { id: 'clubs', label: 'Clubs', icon: Users, path: '/student/clubs' },
    { id: 'events', label: 'Events', icon: Calendar, path: '/student/events' },
    { id: 'profile', label: 'Profile', icon: UserCircle2, path: '/student/profile' },
  ];

  return (
    <aside className="st-desktop-sidebar">
      <div className="st-sidebar-header">
        <div className="st-logo-wrap">
          <div className="st-logo-icon">
            <Home size={24} color="white" fill="white" />
          </div>
          <div className="st-logo-text">
            <h1>CampusConnect</h1>
            <span>Academic Workspace</span>
          </div>
        </div>
      </div>

      <nav className="st-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`st-sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="st-sidebar-footer">
        <div className="st-user-card-mini">
          <div className="st-user-avatar-small">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="st-user-details-small">
            <span className="user-name">{user?.name || 'Student Name'}</span>
            <span className="user-role">{user?.role || 'Senior Fellow'}</span>
          </div>
          <button className="st-sidebar-logout" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
