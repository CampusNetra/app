import React, { useEffect, useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  Rows,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import StudentDock from './StudentDock';
import './student.css';

const formatTimeMini = (dateStr) => {
  if (!dateStr) return { main: '--', period: '--' };
  const date = new Date(dateStr);
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const [main, period] = timeStr.split(' ');
  return { main, period };
};

const StudentEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('strip'); // 'strip' | 'month'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate 7 days for the calendar strip
  const dateStrip = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  // Generate month grid
  const monthGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    // Padding for first week
    const firstDayIdx = firstDay.getDay(); 
    for (let i = 0; i < firstDayIdx; i++) {
      const d = new Date(year, month, i - firstDayIdx + 1);
      days.push({ date: d, otherMonth: true });
    }
    
    // Days in current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), otherMonth: false });
    }
    
    return days;
  }, [currentMonth]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/student/feed');
        const filtered = (response?.data?.posts || []).filter(
          (post) => (post.announcementType || 'normal') === 'event'
        );
        setEvents(filtered);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredEventsByDate = useMemo(() => {
    return events.filter(e => {
      if (!e.event_date) return false;
      const d = new Date(e.event_date);
      return d.toDateString() === selectedDate.toDateString();
    });
  }, [events, selectedDate]);

  const changeMonth = (offset) => {
      const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
      setCurrentMonth(next);
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2">
        <header className="st-feed-header-v2">
          <div className="st-header-content">
            <button className="st-action-circle" onClick={() => navigate('/student/feed')}>
              <ArrowLeft size={20} />
            </button>
            <div className="st-profile-meta" style={{ textAlign: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '18px' }}>Event Calendar</h2>
              <p>Discover campus activities</p>
            </div>
            
            <div className="st-view-toggle">
              <button 
                className={`st-toggle-btn ${viewMode === 'strip' ? 'active' : ''}`}
                onClick={() => setViewMode('strip')}
              >
                <Rows size={16} />
              </button>
              <button 
                className={`st-toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Date Views */}
        {viewMode === 'strip' ? (
          <div className="st-calendar-strip custom-scrollbar-hide">
            {dateStrip.map((date, idx) => {
              const isActive = date.toDateString() === selectedDate.toDateString();
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = date.getDate();
              const hasEvent = events.some(e => e.event_date && new Date(e.event_date).toDateString() === date.toDateString());
              
              return (
                <div 
                  key={idx} 
                  className={`st-date-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="st-date-day">{dayName}</span>
                  <span className="st-date-num">{dayNum}</span>
                  {hasEvent && <div className="st-date-dot" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="st-month-calendar">
              <div className="st-month-header">
                  <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  <div className="st-month-nav">
                      <button className="st-action-circle" style={{ width: 32, height: 32 }} onClick={() => changeMonth(-1)}>
                          <ChevronLeft size={16} />
                      </button>
                      <button className="st-action-circle" style={{ width: 32, height: 32 }} onClick={() => changeMonth(1)}>
                          <ChevronRight size={16} />
                      </button>
                  </div>
              </div>
              <div className="st-calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="st-day-label">{d}</div>)}
                  {monthGrid.map((day, idx) => {
                      const isActive = day.date.toDateString() === selectedDate.toDateString();
                      const isToday = day.date.toDateString() === new Date().toDateString();
                      const hasEvent = events.some(e => e.event_date && new Date(e.event_date).toDateString() === day.date.toDateString());
                      
                      return (
                          <div 
                              key={idx} 
                              className={`st-day-cell ${day.otherMonth ? 'other-month' : ''} ${isActive ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                              onClick={() => {
                                  setSelectedDate(day.date);
                                  if (day.otherMonth) setCurrentMonth(day.date);
                              }}
                          >
                            {day.date.getDate()}
                            {hasEvent && <div className="st-cell-dot" />}
                          </div>
                      );
                  })}
              </div>
          </div>
        )}

        <main className="st-feed-main custom-scrollbar">
          <div style={{ padding: '24px 20px 12px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Schedule for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</h3>
          </div>

          {isLoading && (
            <div className="st-loading-state">
              <div className="shimmer-card" style={{ height: '80px' }}></div>
              <div className="shimmer-card" style={{ height: '80px' }}></div>
            </div>
          )}

          {!isLoading && filteredEventsByDate.length === 0 && (
            <div className="st-empty-state" style={{ padding: '40px 24px' }}>
              <div className="empty-icon-wrap" style={{ width: '60px', height: '60px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Clock size={24} style={{ color: '#94a3b8' }} />
              </div>
              <h3 style={{ fontSize: '16px' }}>No events today</h3>
              <p style={{ fontSize: '13px' }}>Select another date or check back later.</p>
            </div>
          )}

          {!isLoading && filteredEventsByDate.map((event) => {
            const { main, period } = formatTimeMini(event.event_date);
            return (
              <div 
                key={event.id} 
                className="st-event-row"
                onClick={() => navigate(`/student/events/${event.id}`)}
              >
                <div className="st-event-time-col">
                  <span className="st-event-time-main">{main}</span>
                  <span className="st-event-time-period">{period}</span>
                </div>
                <div className="st-event-info-col">
                  <h4 className="st-event-title-mini">{event.title}</h4>
                  <div className="st-event-loc-mini">
                    <MapPin size={12} />
                    <span>{event.event_location || 'Campus'}</span>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: '#cbd5e1' }} />
              </div>
            );
          })}
          
          <div style={{ padding: '40px 20px' }}>
             <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>All times are in IST (Local Time)</p>
          </div>
        </main>

        <StudentDock active="events" />
      </div>
    </div>
  );
};

export default StudentEventsPage;
