import React, { useEffect, useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const firstDayIdx = firstDay.getDay(); 
    
    // Padding from prev month
    for (let i = firstDayIdx; i > 0; i--) {
      const d = new Date(year, month, 1 - i);
      days.push({ date: d, otherMonth: true });
    }
    
    // Days in current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ date: new Date(year, month, i), otherMonth: false });
    }

    // Padding for next month to fill grid
    const remaining = 42 - days.length; // 6 rows of 7
    for (let i = 1; i <= remaining; i++) {
        days.push({ date: new Date(year, month + 1, i), otherMonth: true });
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
    <div className={isDesktop ? 'st-events-desktop-container' : 'st-mobile-frame feed-v2'}>
      <header className={isDesktop ? 'st-page-title-row' : 'st-feed-header-v2'}>
          <div className="st-header-content">
            {!isDesktop && (
              <button className="st-action-circle" onClick={() => navigate('/student/feed')}>
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="st-profile-meta" style={!isDesktop ? { textAlign: 'center', flex: 1} : {}}>
              <h2 style={{ fontSize: isDesktop ? '24px' : '18px', fontWeight: 800 }}>Event Calendar</h2>
              {!isDesktop && <p>Discover campus activities</p>}
            </div>
            
            <div className="st-view-toggle">
              <button 
                className={`st-toggle-btn ${viewMode === 'strip' ? 'active' : ''}`}
                onClick={() => setViewMode('strip')}
                title="Week view"
              >
                <Rows size={18} />
              </button>
              <button 
                className={`st-toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
                title="Month view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </header>

        <section className="st-calendar-section">
          {viewMode === 'strip' ? (
            <div className="st-calendar-strip-container">
               <div className="st-calendar-strip scroll-x custom-scrollbar-hide">
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
            </div>
          ) : (
            <div className="st-month-calendar">
                <div className="st-month-header">
                    <div className="st-month-title-group">
                      <h3 className="st-month-label">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                      <div className="st-month-nav">
                          <button className="st-month-nav-btn" onClick={() => changeMonth(-1)}>
                              <ChevronLeft size={18} />
                          </button>
                          <button className="st-month-nav-btn" onClick={() => changeMonth(1)}>
                              <ChevronRight size={18} />
                          </button>
                      </div>
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
                                    if (day.otherMonth) {
                                      setCurrentMonth(day.date);
                                    }
                                }}
                            >
                              <span className="cell-num">{day.date.getDate()}</span>
                              {hasEvent && <div className="st-cell-dot" />}
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </section>

        <main className="st-events-content">
          <div className="st-schedule-header">
             <h3>Schedule for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}</h3>
             {filteredEventsByDate.length > 0 && <span className="event-count">{filteredEventsByDate.length} Campus Events</span>}
          </div>

          {isLoading && (
            <div className="st-loading-state">
              <div className="shimmer-card" style={{ height: '80px', borderRadius: '16px' }}></div>
              <div className="shimmer-card" style={{ height: '80px', borderRadius: '16px' }}></div>
            </div>
          )}

          {!isLoading && filteredEventsByDate.length === 0 && (
            <div className="st-empty-state-v2">
              <div className="empty-icon-wrap">
                <Clock size={32} />
              </div>
              <h3>No events today</h3>
              <p>Select another date or discovered campus activities later.</p>
            </div>
          )}

          <div className="st-events-list">
            {!isLoading && filteredEventsByDate.map((event) => {
              const { main, period } = formatTimeMini(event.event_date);
              return (
                <div 
                  key={event.id} 
                  className="st-event-card-modern"
                  onClick={() => navigate(`/student/events/${event.id}`)}
                >
                  <div className="st-event-time-col">
                    <span className="time-val">{main}</span>
                    <span className="time-suffix">{period}</span>
                  </div>
                  <div className="st-event-main-col">
                    <h4 className="title">{event.title}</h4>
                    <div className="meta">
                      <div className="meta-item"><MapPin size={12} /> {event.event_location || 'Campus'}</div>
                      {event.source && <div className="meta-item"><Calendar size={12} /> {event.source}</div>}
                    </div>
                  </div>
                  <div className="st-event-action-col">
                    <ChevronRight size={20} />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="st-timezone-info">
             <p>All times are in IST (Local Time)</p>
          </div>
        </main>

        {!isDesktop && <StudentDock active="events" />}
      </div>
  );
};

export default StudentEventsPage;
