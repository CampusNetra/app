import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, Users, UserSquare2, Grid2X2, PieChart, 
  BookOpen, ClipboardCheck, Database, MessageSquare, 
  Bell, ShieldAlert, Settings, ChevronLeft, ChevronRight 
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@campusnetra.com' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { label: 'MANAGEMENT', type: 'label' },
    { label: 'Students', icon: Users, path: '/admin/students' },
    { label: 'Faculty', icon: UserSquare2, path: '/admin/faculty' },
    { label: 'Branches', icon: Grid2X2, path: '/admin/branches' },
    { label: 'Sections', icon: PieChart, path: '/admin/sections' },
    { label: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
    { label: 'Faculty Assignments', icon: ClipboardCheck, path: '/admin/assignments' },
    { label: 'Academic Terms', icon: Database, path: '/admin/terms' },
    { label: 'COMMUNICATION', type: 'label' },
    { label: 'Channels', icon: MessageSquare, path: '/admin/channels' },
    { label: 'Clubs', icon: Bell, path: '/admin/clubs' },
    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
    { label: 'SYSTEM', type: 'label' },
    { label: 'Data Import', icon: Database, path: '/admin/import' },
    { label: 'Analytics', icon: PieChart, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside className="sidebar" style={{ width: collapsed ? '80px' : 'var(--sidebar-w)' }}>
      <div className="sidebar-header">
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '32px', height: '32px', background: 'var(--primary)', 
              borderRadius: '8px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: 'white' 
            }}>
              <ShieldAlert size={18} />
            </div>
            <span style={{ fontWeight: '900', fontSize: '19px', color: 'var(--text-main)', letterSpacing: '-0.03em' }}>CampusNetra</span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--text-muted)'
          }}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.type === 'label') {
            return !collapsed && (
              <div key={index} className="nav-label">{item.label}</div>
            );
          }

          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`nav-link ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
              style={{ 
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '14px 0' : '14px 24px'
              }}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '48px', height: '48px', background: '#f8fafc', borderRadius: '50%', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
            border: '2px solid var(--border-color)'
          }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f172a&color=fff&bold=true&size=128`} 
              alt={user.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <p style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
              <p style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email || 'admin@gu.in'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
