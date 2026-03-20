import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Users,
  UserSquare2,
  Grid2X2,
  PieChart,
  BookOpen,
  ClipboardCheck,
  Database,
  MessageSquare,
  Bell,
  ShieldAlert,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
} from 'lucide-react';

const DashboardSidebar = ({ collapsed, setCollapsed, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { label: 'MANAGEMENT', type: 'label' },
    { label: 'Students', icon: Users, path: '/admin/students' },
    { label: 'Faculty', icon: UserSquare2, path: '/admin/faculty' },
    { label: 'Branches', icon: Grid2X2, path: '/admin/branches' },
    { label: 'Sections', icon: PieChart, path: '/admin/sections' },
    { label: 'Subjects', icon: BookOpen, path: '/admin/subjects' },
    { label: 'Faculty Assignments', icon: ClipboardCheck, path: '/admin/faculty-assignments' },
    { label: 'Academic Terms', icon: Database, path: '/admin/terms' },
    { label: 'COMMUNICATION', type: 'label' },
    { label: 'Channels', icon: MessageSquare, path: '/admin/channels' },
    { label: 'Clubs', icon: Bell, path: '/admin/clubs' },
    { label: 'Moderation', icon: ShieldAlert, path: '/admin/moderation' },
    { label: 'SYSTEM', type: 'label' },
    { label: 'Data Import', icon: Database, path: '/admin/data-import' },
    { label: 'Analytics', icon: PieChart, path: '/admin/analytics' },
    { label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <aside
      className="bg-white border-r border-slate-200 h-screen shrink-0"
      style={{ width: collapsed ? '82px' : '280px', transition: 'width 0.2s ease' }}
    >
      <div className="h-[72px] px-5 border-b border-slate-200 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <ShieldAlert size={17} />
            </div>
            <span className="font-black text-[20px] tracking-tight text-slate-900">CampusNetra</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
            <ShieldAlert size={17} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-slate-700"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="h-[calc(100vh-72px)] flex flex-col">
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {menuItems.map((item, i) => {
            if (item.type === 'label') {
              return !collapsed ? (
                <div key={`label-${i}`} className="text-[10px] font-black text-slate-400 tracking-wider px-4 py-3">
                  {item.label}
                </div>
              ) : null;
            }

            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : ''}
                className={`flex items-center gap-3 rounded-xl text-sm font-bold mb-1 transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '12px 0' : '12px 16px',
                }}
              >
                <Icon size={19} />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3 hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() : 'AU'}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@campusnetra.com'}</p>
              </div>
            ) : null}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-500 transition-colors shrink-0 ml-auto"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
