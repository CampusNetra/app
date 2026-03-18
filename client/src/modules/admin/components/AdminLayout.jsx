import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  return (
    <div className="flex min-h-screen font-sans text-slate-900" style={{ background: '#fcfdfe' }}>
      <DashboardSidebar collapsed={isSidebarOpen} setCollapsed={setIsSidebarOpen} user={user} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen transition-all duration-300">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
