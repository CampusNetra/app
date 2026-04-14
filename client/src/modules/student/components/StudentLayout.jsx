import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import StudentTopBar from './StudentTopBar';
import StudentRightPanel from './StudentRightPanel';
import StudentDock from '../StudentDock';
import '../student.css';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const studentUser = JSON.parse(localStorage.getItem('student_user') || '{}');
    setUser(studentUser);

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    localStorage.removeItem('student_login');
    navigate('/student/welcome', { replace: true });
  };

  return (
    <div className="st-app-container">
      {/* Desktop Sidebar */}
      {!isMobile && <StudentSidebar user={user} onLogout={handleLogout} />}

      <div className="st-main-layout">
        {/* Desktop TopBar */}
        {!isMobile && (
          <StudentTopBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        )}

        <div className="st-content-wrapper">
          <main className="st-page-content">
             {/* Pass searchTerm to Outlet context if needed, or handle it via local storage/state management */}
            <Outlet context={{ searchTerm, setSearchTerm }} />
          </main>

          {/* Desktop Right Panel */}
          {!isMobile && <StudentRightPanel />}
        </div>

        {/* Mobile Bottom Dock */}
        {isMobile && <StudentDock active="feed" />}
      </div>
    </div>
  );
};

export default StudentLayout;
