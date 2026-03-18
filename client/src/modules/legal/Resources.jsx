import React from 'react';
import { BookOpen, FileText, Lightbulb } from 'lucide-react';
import LegalPageLayout from './LegalPageLayout';

const sectionStyle = {
  padding: '1.25rem',
  borderRadius: '12px',
  border: '1px solid #e4e7ec',
  background: '#f9fafb',
};

const linkStyle = {
  color: '#f97316',
  fontWeight: 600,
  textDecoration: 'none',
};

const Resources = () => (
  <LegalPageLayout
    title="Resources"
    subtitle="Guides and references to help your team use Campus Netra effectively."
  >
    <div style={{ display: 'grid', gap: '1rem' }}>
      <section style={sectionStyle}>
        <BookOpen style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Getting Started</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Learn the basics of onboarding admins, configuring terms, and preparing your dashboard.
        </p>
        <a href="#" style={linkStyle}>View onboarding guide</a>
      </section>

      <section style={sectionStyle}>
        <FileText style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Documentation</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Access workflow references, technical notes, and updates for your admin team.
        </p>
        <a href="#" style={linkStyle}>Open documentation</a>
      </section>

      <section style={sectionStyle}>
        <Lightbulb style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Best Practices</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Explore practical recommendations to improve adoption and ensure clean operational data.
        </p>
        <a href="#" style={linkStyle}>Read best practices</a>
      </section>
    </div>
  </LegalPageLayout>
);

export default Resources;