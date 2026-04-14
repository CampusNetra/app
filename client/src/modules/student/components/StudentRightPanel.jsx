import React from 'react';
import { FileText, Headphones, Map, ShieldAlert, ChevronRight } from 'lucide-react';

const StudentRightPanel = () => {
  const trending = [
    { tag: '#ACADEMIC_LIFE', title: 'Midterm Survival Guide 2024', count: '1.2k people discussing' },
    { tag: '#RESEARCH', title: 'Quantum Computing Ethics', count: '840 people discussing' },
    { tag: '#CAMPUS_EVENTS', title: 'Spring Gala Tickets Released', count: '3k people discussing' },
  ];

  const events = [
    { date: 'OCT 12', title: 'AI Ethics Symposium', location: 'Main Auditorium • 2PM' },
    { date: 'OCT 15', title: 'Career Fair: Tech', location: 'Grand Ballroom • 10AM' },
  ];

  const quickLinks = [
    { label: 'Campus Library Portal', icon: FileText },
    { label: 'Student Services', icon: Headphones },
    { label: 'Interactive Campus Map', icon: Map },
    { label: 'Emergency Support', icon: ShieldAlert },
  ];

  return (
    <aside className="st-desktop-right-panel">
      <div className="right-panel-section">
        <h3>TRENDING NOW</h3>
        <div className="trending-list">
          {trending.map((item, idx) => (
            <div key={idx} className="trending-item">
              <span className="tag">{item.tag}</span>
              <h4>{item.title}</h4>
              <span className="count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="right-panel-section">
        <h3>UPCOMING EVENTS</h3>
        <div className="events-list">
          {events.map((item, idx) => (
            <div key={idx} className="event-mini-card">
              <div className="event-date-badge">
                <span className="month">{item.date.split(' ')[0]}</span>
                <span className="day">{item.date.split(' ')[1]}</span>
              </div>
              <div className="event-info">
                <h4>{item.title}</h4>
                <p>{item.location}</p>
              </div>
            </div>
          ))}
          <button className="view-all-btn">View All Events</button>
        </div>
      </div>

      <div className="right-panel-section">
        <h3>QUICK LINKS</h3>
        <div className="links-list">
          {quickLinks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button key={idx} className="quick-link-btn">
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="st-desktop-footer">
        <p>© 2026 CampusConnect Editorial. All scholarly contributions are protected.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Academic Integrity</a>
          <span>•</span>
          <a href="#">Help</a>
        </div>
      </footer>
    </aside>
  );
};

export default StudentRightPanel;
