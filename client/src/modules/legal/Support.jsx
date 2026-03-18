import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, BookOpen } from 'lucide-react';
import LegalPageLayout from './LegalPageLayout';

const cardStyle = {
  padding: '1.5rem',
  borderRadius: '12px',
  background: '#f9fafb',
  border: '1px solid #e4e7ec',
};

const linkStyle = {
  color: '#f97316',
  fontWeight: 600,
  textDecoration: 'none',
  display: 'block',
  marginTop: '1rem',
};

const Support = () => (
  <LegalPageLayout
    title="Support Center"
    subtitle="Need help? Our team is here to ensure your department runs smoothly."
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      <div style={cardStyle}>
        <Mail style={{ color: '#f97316', marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>Email Support</h3>
        <p style={{ fontSize: '0.9rem', color: '#667085', lineHeight: 1.6, margin: 0 }}>
          Send us an email and we will get back to you within 24 hours.
        </p>
        <a href="mailto:support@campusnetra.com" style={linkStyle}>support@campusnetra.com</a>
      </div>

      <div style={cardStyle}>
        <BookOpen style={{ color: '#f97316', marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>Documentation</h3>
        <p style={{ fontSize: '0.9rem', color: '#667085', lineHeight: 1.6, margin: 0 }}>
          Learn how to manage terms, faculty, and student records efficiently.
        </p>
        <Link to="/resources" style={linkStyle}>Browse resources</Link>
      </div>

      <div style={cardStyle}>
        <MessageSquare style={{ color: '#f97316', marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>Live Chat</h3>
        <p style={{ fontSize: '0.9rem', color: '#667085', lineHeight: 1.6, margin: 0 }}>
          Available 10 AM - 6 PM for immediate administrative assistance.
        </p>
        <button
          type="button"
          style={{
            background: '#f97316',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginTop: '1rem',
            fontWeight: 600,
          }}
        >
          Start Chat
        </button>
      </div>
    </div>
  </LegalPageLayout>
);

export default Support;
