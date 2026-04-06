import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './student.css';

const StudentSplash = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(6);
  const [studentName, setStudentName] = useState('Student');

  useEffect(() => {
    const stored = localStorage.getItem('student_user');
    if (!stored) {
      navigate('/student/welcome', { replace: true });
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const name = parsed?.name || parsed?.entered_name || 'Student';
      setStudentName(name);
    } catch (e) {
      setStudentName('Student');
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12) + 6;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const next = setTimeout(() => navigate('/student/feed', { replace: true }), 350);
      return () => clearTimeout(next);
    }
    return undefined;
  }, [progress, navigate]);

  return (
    <div className="st-shell">
      <div className="st-mobile-frame">
        <main className="st-splash-main">
          <div className="st-logo-block">
            <div className="st-logo-chip">
              <GraduationCap size={52} />
            </div>
            <p className="st-logo-kicker">Campus Netra v1.0.0</p>
            <h1 className="st-logo-title">Communication, <br/>Simplified.</h1>
            <p className="st-splash-welcome">Welcome, {studentName}</p>
            <p className="st-logo-sub">Official Student Experience Portal <br/>Designed by Syntax Sinners</p>
          </div>
        </main>

        <div className="st-progress-wrap">
          <div className="st-progress-track">
            <div className="st-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="st-progress-label">Loading your campus workspace...</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSplash;