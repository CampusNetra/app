import React from 'react';
import LegalPageLayout from './LegalPageLayout';
import { Layers, Database, Shield, Zap, MessageSquare, Bell } from 'lucide-react';

const sectionStyle = {
  marginBottom: '2rem',
  padding: '1.5rem',
  background: '#fcfcfd',
  borderRadius: '16px',
  border: '1px solid #f2f4f7'
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '1rem',
  color: '#101828'
};

const iconStyle = {
  color: '#ff5e3a',
  background: 'rgba(255, 94, 58, 0.1)',
  padding: '8px',
  borderRadius: '10px'
};

const listStyle = {
  margin: 0,
  paddingLeft: '1.25rem'
};

const listItemStyle = {
  fontSize: '0.9rem',
  color: '#475467',
  marginBottom: '0.5rem',
  lineHeight: '1.6'
};

const Changelog = () => (
  <LegalPageLayout
    title="Release Notes"
    subtitle="Tracking the evolution of Campus Netra: Features, Fixes & Infrastructure."
  >
    <div style={{ padding: '0.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 800, 
          color: '#ff5e3a', 
          background: 'rgba(255, 94, 58, 0.08)',
          padding: '4px 12px',
          borderRadius: '100px',
          letterSpacing: '0.1em'
        }}>LATEST RELEASE</span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '0.5rem' }}>v0.52.5 "Quantum Sync"</h2>
      </div>

      {/* Production Migration */}
      <section style={sectionStyle}>
        <div style={headerStyle}>
          <Database size={24} style={iconStyle} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Database Infrastructure</h3>
        </div>
        <ul style={listStyle}>
          <li style={listItemStyle}><strong>Unified D1 Schema:</strong> Completely merged and optimized SQLite schema for Cloudflare Workers.</li>
          <li style={listItemStyle}><strong>Constraint Evolution:</strong> Re-indexed all communication channels to support advanced department-wide broadcast logic.</li>
          <li style={listItemStyle}><strong>Dialect-Aware SQL:</strong> Implemented a deep-translation layer for complex MySQL sorting and conflict patterns on D1.</li>
        </ul>
      </section>

      {/* Persistent Sessions */}
      <section style={sectionStyle}>
        <div style={headerStyle}>
          <Shield size={24} style={iconStyle} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Identity & Security</h3>
        </div>
        <ul style={listStyle}>
          <li style={listItemStyle}><strong>Persistent Sessions:</strong> Hardened login model with multi-role LocalStorage persistency.</li>
          <li style={listItemStyle}><strong>Role-Based Guards:</strong> New global route protection for authenticated Student, Faculty, and Admin dashboards.</li>
          <li style={listItemStyle}><strong>Smart Authentication:</strong> Session-aware entry points that automatically bypass landing pages if authenticated.</li>
        </ul>
      </section>

      {/* Core Communication */}
      <section style={sectionStyle}>
        <div style={headerStyle}>
          <MessageSquare size={24} style={iconStyle} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Communication Suite</h3>
        </div>
        <ul style={listStyle}>
          <li style={listItemStyle}><strong>Optimized Group Chat:</strong> Corrected message sorting and owner-attribution logic for Faculty channels.</li>
          <li style={listItemStyle}><strong>Full Modules Activation:</strong> Integrated Clubs, Assignments, Materials, and Announcements into the production environment.</li>
          <li style={listItemStyle}><strong>Read Tracking:</strong> Enhanced read-status markers for section-based student groups.</li>
        </ul>
      </section>

      {/* Design System */}
      <section style={sectionStyle}>
        <div style={headerStyle}>
          <Zap size={24} style={iconStyle} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Design & UX</h3>
        </div>
        <ul style={listStyle}>
          <li style={listItemStyle}><strong>Performance Badges:</strong> New "Striking" version tracking badge on the global landing page.</li>
          <li style={listItemStyle}><strong>Unified Styles:</strong> Synchronized student and faculty UI components for a more cohesive platform experience.</li>
          <li style={listItemStyle}><strong>Motion Transitions:</strong> Improved route transitions and entrance animations in the student portal.</li>
        </ul>
      </section>

      <footer style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.85rem', color: '#98a2b3' }}>
        Next Update: Project "Nexus" coming late April 2026.
      </footer>
    </div>
  </LegalPageLayout>
);

export default Changelog;
