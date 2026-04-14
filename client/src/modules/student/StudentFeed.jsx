import React, { useEffect, useMemo, useState } from 'react';
import {
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
  Clock,
  ClipboardCheck,
  BarChart3,
  Paperclip,
  BookOpen,
  FlaskConical,
  BellRing
} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../api';
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

const getPostMeta = (post) => {
  if (post.category === 'assignment') {
    return {
      label: 'Assignment',
      icon: ClipboardCheck,
      accent: 'assignment',
      description: post.subjects || post.sections || 'Coursework'
    };
  }

  if (post.category === 'poll') {
    return {
      label: 'Poll',
      icon: BarChart3,
      accent: 'poll',
      description: post.target_sections || 'Faculty feedback'
    };
  }

  return {
    label:
      post.announcementType === 'important'
        ? 'Priority Alert'
        : post.announcementType === 'event'
          ? 'Upcoming Event'
          : 'Announcement',
    icon: Megaphone,
    accent: post.announcementType === 'important' ? 'important' : post.announcementType === 'event' ? 'event' : 'announcement',
    description: post.target_sections || post.target_departments || post.source || 'Campus Netra'
  };
};

const StudentFeed = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  
  // Use context from StudentLayout if available
  const searchTerm = outletContext?.searchTerm || '';
  const setSearchTerm = outletContext?.setSearchTerm || (() => {});

  const [activeTab, setActiveTab] = useState('all');
  const [feedPosts, setFeedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [submittingPollId, setSubmittingPollId] = useState(null);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePollVote = async (pollId, optionIndex) => {
    const existingPoll = feedPosts.find((post) => post.category === 'poll' && post.id === pollId);
    if (existingPoll?.user_response !== null && existingPoll?.user_response !== undefined) {
      return;
    }

    try {
      setSubmittingPollId(pollId);
      const response = await api.post(`/student/polls/${pollId}/respond`, {
        option_index: optionIndex
      });

      setFeedPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.category === 'poll' && post.id === pollId
            ? {
                ...post,
                user_response: optionIndex,
                response_count: response?.data?.response_count ?? post.response_count,
                option_results: response?.data?.option_results ?? post.option_results
              }
            : post
        )
      );
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to submit vote.';
      setError(message);
    } finally {
      setSubmittingPollId(null);
    }
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

  const posts = useMemo(() => {
    let filtered = feedPosts;

    if (activeTab !== 'all') {
      filtered = filtered.filter((post) => {
        if (activeTab === 'important') return post.announcementType === 'important';
        if (activeTab === 'academics') return post.category === 'assignment' || post.category === 'poll';
        if (activeTab === 'research') return false; // Mock for now
        return post.category === activeTab;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((post) =>
        [
          post.title,
          post.content,
          post.subjects,
          post.sections,
          post.source,
          ...(post.options || [])
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }

    return filtered;
  }, [activeTab, feedPosts, searchTerm]);

  return (
    <div className={`st-feed-view ${!isDesktop ? 'st-mobile-frame feed-v2' : ''}`}>
      {/* Mobile Header */}
      {!isDesktop && (
        <header className="st-feed-header-v2">
          <div className="st-header-content">
            <div className="st-profile-meta">
              <h2>Good morning, {user?.name?.split(' ')[0] || 'Student'}</h2>
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
              placeholder="Search feed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
      )}

      {/* Categories Tabs */}
      <div className="st-categories-bar scroll-x custom-scrollbar-hide">
        <button className={`st-cat-pill ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          <LayoutGrid size={16} /> <span>All Updates</span>
        </button>
        <button className={`st-cat-pill ${activeTab === 'academics' ? 'active' : ''}`} onClick={() => setActiveTab('academics')}>
          <BookOpen size={16} /> <span>Academics</span>
        </button>
        <button className={`st-cat-pill ${activeTab === 'clubs' ? 'active' : ''}`} onClick={() => setActiveTab('clubs')}>
          <Users size={16} /> <span>Clubs & Societies</span>
        </button>
        <button className={`st-cat-pill ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>
          <FlaskConical size={16} /> <span>Research Projects</span>
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
                <p>No new faculty posts in this category.</p>
              </>
            )}
          </div>
        )}

        {!isLoading && !error && posts.map((post) => {
          const meta = getPostMeta(post);
          const MetaIcon = meta.icon;

          return (
            <article
              key={`${post.category}-${post.id}`}
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
                    {meta.label}
                  </div>
                  <span className="st-card-time">
                    <Clock size={12} /> {formatRelativeTime(post.createdAt)}
                  </span>
                </div>

                <h3 className="st-card-title">{post.title}</h3>

                <div className="st-event-meta-block">
                  <div className="st-meta-item">
                    <MetaIcon size={14} />
                    <span>{meta.description}</span>
                  </div>
                  {post.source && (
                    <div className="st-meta-item">
                      <GraduationCap size={14} />
                      <span>{post.source}</span>
                    </div>
                  )}
                  {post.category === 'assignment' && post.due_date && (
                    <div className="st-meta-item">
                      <Calendar size={14} />
                      <span>Due {formatDate(post.due_date)}</span>
                    </div>
                  )}
                  {post.category === 'poll' && (
                    <div className="st-meta-item">
                      <Users size={14} />
                      <span>{post.response_count || 0} responses so far</span>
                    </div>
                  )}
                  {post.announcementType === 'event' && post.event_date && (
                    <div className="st-meta-item">
                      <Calendar size={14} />
                      <span>{formatDate(post.event_date)}</span>
                    </div>
                  )}
                  {post.announcementType === 'event' && post.event_location && (
                    <div className="st-meta-item">
                      <MapPin size={14} />
                      <span>{post.event_location}</span>
                    </div>
                  )}
                </div>

                <p className="st-card-content">{post.content}</p>

                {post.category === 'poll' && (post.options || []).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                    {(post.option_results || []).slice(0, 4).map((result) => (
                      <button
                        key={result.option_index}
                        onClick={() => handlePollVote(post.id, result.option_index)}
                        disabled={submittingPollId === post.id || (post.user_response !== null && post.user_response !== undefined)}
                        style={{
                          background: '#f8fafc',
                          border: post.user_response === result.option_index ? '1px solid #fdba74' : '1px solid #e2e8f0',
                          borderRadius: 14,
                          padding: '12px 14px',
                          fontSize: 13,
                          color: post.user_response === result.option_index ? '#ea580c' : '#475569',
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: submittingPollId === post.id ? 'wait' : (post.user_response !== null && post.user_response !== undefined ? 'default' : 'pointer')
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                          <span>{result.option}</span>
                          {(post.user_response !== null && post.user_response !== undefined) && (
                            <span style={{ fontSize: 12, fontWeight: 700 }}>
                              {result.vote_count} • {result.percentage}%
                            </span>
                          )}
                        </div>
                        {(post.user_response !== null && post.user_response !== undefined) && (
                          <div style={{ height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${result.percentage}%`,
                                height: '100%',
                                background: post.user_response === result.option_index ? '#f97316' : '#94a3b8',
                                borderRadius: 999
                              }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {post.category === 'poll' && (
                  <div style={{ marginTop: 14, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    {post.user_response !== null && post.user_response !== undefined
                      ? 'Your vote has been recorded.'
                      : 'Tap an option to vote.'}
                  </div>
                )}

                {post.category === 'assignment' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                    {post.sections && (
                      <span className="st-banner-pill" style={{ background: '#fff7ed', color: '#ea580c' }}>{post.sections}</span>
                    )}
                    {post.attachment_url && (
                      <span className="st-banner-pill" style={{ background: '#eff6ff', color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Paperclip size={12} />
                        Attachment
                      </span>
                    )}
                  </div>
                )}

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

                {/* Desktop Interaction Bar */}
                {isDesktop && (
                  <div style={{ display: 'flex', gap: 24, marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                       <Zap size={16} /> 248
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                       <BarChart3 size={16} /> 32
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                       <ExternalLink size={16} /> Share
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </main>

      {/* Mobile-only Drawer */}
      {!isDesktop && isDrawerOpen && <div className="st-drawer-overlay-v2" onClick={() => setIsDrawerOpen(false)} />}
      {!isDesktop && (
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
             {[
               { id: 'alerts', label: 'Alerts', hint: 'Priority updates', icon: BellRing, path: '/student/alerts' },
               { id: 'announcements', label: 'Announcements', hint: 'Official notices', icon: Megaphone, path: '/student/announcements' },
               { id: 'clubs', label: 'Clubs', hint: 'Club updates', icon: Users, path: '/student/clubs' },
               { id: 'marketplace', label: 'Marketplace', hint: 'Buy & sell', icon: ShoppingBag, path: '/student/marketplace' }
             ].map((item) => (
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
            <button className="st-logout-full" onClick={() => {
               localStorage.clear();
               navigate('/student/welcome');
            }}>
              Logout System
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default StudentFeed;
