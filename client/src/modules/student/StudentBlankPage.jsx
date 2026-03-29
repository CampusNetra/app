import React from 'react';
import { ArrowLeft, BellOff, Megaphone, ShoppingBag, Users, Calendar, MessageSquare, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StudentDock from './StudentDock';
import './student.css';

const iconMap = {
  alerts: BellOff,
  announcements: Megaphone,
  clubs: Users,
  marketplace: ShoppingBag,
  events: Calendar,
  chat: MessageSquare,
  profile: UserCircle
};

const StudentBlankPage = ({
  title,
  type,
  heading,
  message,
  actionLabel,
  dockActive = 'feed'
}) => {
  const navigate = useNavigate();
  const Icon = iconMap[type] || Megaphone;

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2">
        {/* V2 Header */}
        <header className="st-feed-header-v2">
          <div className="st-header-content">
            <button className="st-action-circle" onClick={() => navigate('/student/feed')}>
              <ArrowLeft size={20} />
            </button>
            <div className="st-profile-meta" style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '18px' }}>{title}</h2>
            </div>
            <div style={{ width: 44 }} /> {/* Spacer */}
          </div>
        </header>

        <main className="st-feed-main custom-scrollbar">
          <div className="st-blank-container">
            <div className="st-blank-icon">
              <Icon size={40} />
            </div>
            <h2 className="st-blank-title">{heading}</h2>
            <p className="st-blank-desc">{message}</p>
            {actionLabel && (
              <button className="st-card-action-btn" style={{ minWidth: '200px', background: '#0f172a', color: 'white', border: 'none' }}>
                {actionLabel}
              </button>
            )}
          </div>
        </main>

        <StudentDock active={dockActive} />
      </div>
    </div>
  );
};

export default StudentBlankPage;
