import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Share2,
  Bookmark
} from 'lucide-react';
import api from '../../api';
import './student.css';

const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StudentEventDetailsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        // We'll fetch the feed and find the item by ID for now, 
        // as there might not be a dedicated single-fetch endpoint yet
        const response = await api.get('/student/feed');
        const found = (response?.data?.posts || []).find(p => String(p.id) === String(eventId));
        setEvent(found);
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="st-shell">
        <div className="st-mobile-frame">
          <div className="st-loading-state" style={{ padding: '40px' }}>
            <div className="shimmer-card" style={{ height: '300px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="st-shell">
        <div className="st-mobile-frame feed-v2">
          <header className="st-feed-header-v2">
             <button className="st-action-circle" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
          </header>
          <div className="st-empty-state">
             <h3>Event not found</h3>
             <p>This event may have been removed or expired.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="st-shell">
      <div className="st-mobile-frame feed-v2 custom-scrollbar" style={{ overflowY: 'auto' }}>
        <div className="st-details-hero">
          <img src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'} alt={event.title} />
          <div className="st-details-back-bar">
            <button className="st-action-circle" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
               <button className="st-action-circle"><Bookmark size={20} /></button>
               <button className="st-action-circle"><Share2 size={20} /></button>
            </div>
          </div>
        </div>

        <div className="st-details-sheet">
          <span className="st-details-badge">Official Campus Event</span>
          <h1 className="st-details-title">{event.title}</h1>

          <div className="st-info-grid">
             <div className="st-info-box">
                <p className="st-info-label">Date</p>
                <p className="st-info-val">{formatFullDate(event.event_date)}</p>
             </div>
             <div className="st-info-box">
                <p className="st-info-label">Time</p>
                <p className="st-info-val">{formatTime(event.event_date)}</p>
             </div>
             <div className="st-info-box" style={{ gridColumn: 'span 2' }}>
                <p className="st-info-label">Location</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <MapPin size={14} style={{ color: 'var(--st-primary)' }} />
                   <p className="st-info-val">{event.event_location || 'Campus Main Hall'}</p>
                </div>
             </div>
          </div>

          <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '12px' }}>About Event</h4>
          <p className="st-details-content">{event.content}</p>

          {event.event_registration_url && (
            <a 
              href={event.event_registration_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="st-card-action-btn"
              style={{ background: '#0f172a', color: 'white', padding: '20px', fontSize: '16px', borderRadius: '20px' }}
            >
              <span>RSVP & Register Now</span>
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEventDetailsPage;
