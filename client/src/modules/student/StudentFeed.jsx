import React, { useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  ChevronRight,
  GraduationCap,
  Megaphone,
  Menu,
  ShoppingBag,
  Users,
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Search,
  LayoutGrid,
  Zap,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import StudentDock from './StudentDock';
import './student.css';

const formatRelativeTime = (value) => {
  if (!value) return 'now';
  const dt = new Date(value);
  const diffSec = Math.max(0, Math.floor((Date.now() - dt.getTime()) / 1000));

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StudentFeed = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const drawerItems = [
    { id: 'alerts', label: 'Alerts', hint: 'Priority updates and reminders', icon: BellRing, path: '/student/alerts' },
    { id: 'announcements', label: 'Announcements', hint: 'Official notices from campus', icon: Megaphone, path: '/student/announcements' },
    { id: 'clubs', label: 'Clubs', hint: 'Club updates and member activity', icon: Users, path: '/student/clubs' },
    { id: 'marketplace', label: 'Marketplace', hint: 'Buy, sell, and exchange on campus', icon: ShoppingBag, path: '/student/marketplace' }
  ];

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    
    // Clear persistent login cache
    localStorage.removeItem('student_login');
    
    navigate('/student/welcome', { replace: true });
  };

  useEffect(() => {
    const studentUser = JSON.parse(localStorage.getItem('student_user') || '{}');
    setUser(studentUser);

    const loadFeed = async () => {
      const token = localStorage.getItem('student_token');
      if (!token) {
        navigate('/student/welcome', { replace: true });
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const response = await api.get('/student/feed');
        setFeedPosts(response?.data?.posts || []);
      } catch (err) {
        const errorMsg = err?.response?.data?.error || err?.message || 'Unable to load feed.';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeed();
  }, [navigate]);

  const [searchTerm, setSearchTerm] = useState('');

  const posts = useMemo(() => {
    let filtered = feedPosts;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter((post) => (post.announcementType || 'normal') === activeTab);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title?.toLowerCase().includes(term) ||
          post.content?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [activeTab, feedPosts, searchTerm]);

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2">
        {/* Header V2 */}
        <header className="st-feed-header-v2">
          <div className="st-header-content">
            <div className="st-profile-meta">
              <h2>Good morning, {user?.name?.split(' ')[0] || 'Student'}</h2>
              <p>Check out what's happening today</p>
            </div>
            <div className="st-header-actions">
              <button className="st-action-circle" onClick={() => setIsDrawerOpen(true)}>
                <Menu size={20} />
              </button>
            </div>
          </div>
          
          <div className="st-feed-search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Categories Bar */}
        <div className="st-categories-bar scroll-x custom-scrollbar-hide">
          <button 
            className={`st-cat-pill ${activeTab === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            <LayoutGrid size={16} /> <span>All</span>
          </button>
          <button 
            className={`st-cat-pill ${activeTab === 'important' ? 'important active' : ''}`} 
            onClick={() => setActiveTab('important')}
          >
            <Zap size={16} /> <span>Important</span>
          </button>
          <button 
            className={`st-cat-pill ${activeTab === 'event' ? 'event active' : ''}`} 
            onClick={() => setActiveTab('event')}
          >
            <Calendar size={16} /> <span>Events</span>
          </button>
        </div>

        <main className="st-feed-main custom-scrollbar">
          {isLoading && (
            <div className="st-loading-state">
              <div className="shimmer-card"></div>
              <div className="shimmer-card"></div>
            </div>
          )}
          
          {!isLoading && error && <p className="st-feed-error">{error}</p>}
          
          {!isLoading && !error && posts.length === 0 && (
            <div className="st-empty-state">
              <div className="empty-icon-wrap">
                <Search size={42} style={{ color: '#cbd5e1' }} />
              </div>
              {searchTerm.trim() ? (
                <>
                  <h3>No matches found</h3>
                  <p>We couldn't find anything matching "{searchTerm}". Try a different keyword.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="st-card-action-btn"
                    style={{ background: '#0f172a', color: 'white', border: 'none', marginTop: '16px' }}
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h3>Quiet for now</h3>
                  <p>No new announcements in this category.</p>
                </>
              )}
            </div>
          )}

          {!isLoading && !error && posts.map((post) => (
            <article 
              key={post.id} 
              className={`st-feed-card ${post.announcementType === 'important' ? 'is-urgent' : ''} ${post.announcementType === 'event' ? 'is-event' : ''}`}
            >
              {post.image_url && (
                <div className="st-card-image">
                  <img src={post.image_url} alt={post.title} />
                  <div className="st-image-overlay">
                     {post.announcementType === 'event' && <span className="st-banner-pill">EVENT</span>}
                  </div>
                </div>
              )}
              
              <div className="st-card-body">
                <div className="st-card-header">
                  <div className="st-card-type">
                    <span className="type-dot"></span>
                    {post.announcementType === 'important' ? 'Priority Alert' : 
                     post.announcementType === 'event' ? 'Upcoming Event' : 'Campus News'}
                  </div>
                  <span className="st-card-time">
                    <Clock size={12} /> {formatRelativeTime(post.createdAt)}
                  </span>
                </div>

                <h3 className="st-card-title">{post.title}</h3>
                
                {post.announcementType === 'event' && (
                  <div className="st-event-meta-block">
                    {post.event_date && (
                      <div className="st-meta-item">
                        <Calendar size={14} />
                        <span>{formatDate(post.event_date)}</span>
                      </div>
                    )}
                    {post.event_location && (
                      <div className="st-meta-item">
                        <MapPin size={14} />
                        <span>{post.event_location}</span>
                      </div>
                    )}
                  </div>
                )}

                <p className="st-card-content">{post.content}</p>

                {post.event_registration_url && (
                  <a 
                    href={post.event_registration_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="st-card-action-btn"
                  >
                    <span>Register Now</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </main>

        <StudentDock active="feed" />

        {/* Drawer V2 */}
        {isDrawerOpen && <div className="st-drawer-overlay-v2" onClick={() => setIsDrawerOpen(false)} />}
        <aside className={`st-drawer-v2 ${isDrawerOpen ? 'open' : ''}`}>
          <div className="st-drawer-top">
            <div className="st-drawer-user">
              <div className="st-user-avatar">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="st-user-info">
                <h4>{user?.name || 'Student Name'}</h4>
                <p>{user?.email || 'student@domain.com'}</p>
              </div>
            </div>
            <button className="st-close-btn" onClick={() => setIsDrawerOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="st-drawer-nav">
            {drawerItems.map((item) => (
              <button
                key={item.id}
                className="st-nav-link"
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate(item.path);
                }}
              >
                <div className="nav-icon-box"><item.icon size={20} /></div>
                <div className="nav-text">
                  <h5>{item.label}</h5>
                  <p>{item.hint}</p>
                </div>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
            ))}
          </div>

          <div className="st-drawer-bottom">
            <button className="st-logout-full" onClick={handleLogout}>
              Logout System
            </button>
            <p className="st-app-version" style={{ marginBottom: 0, marginTop: '20px' }}>CampusNetra v1.0.0</p>
            <p className="st-brand-link">Built with ❤️ by <a href="https://syntax-sinners.github.io/web/" target="_blank" rel="noopener noreferrer">Syntax Sinners</a></p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentFeed;