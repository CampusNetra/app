import React from 'react';
import { Database, BarChart3, Users, ShieldCheck } from 'lucide-react';
import LegalPageLayout from './LegalPageLayout';

const cardStyle = {
  padding: '1.25rem',
  borderRadius: '12px',
  border: '1px solid #e4e7ec',
  background: '#f9fafb',
};

const Platform = () => (
  <LegalPageLayout
    title="Platform"
    subtitle="Campus Netra helps departments manage academic operations with clarity and speed."
  >
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
      <div style={cardStyle}>
        <Users style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Admin Workspace</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Centralized controls for administrators to configure departments and workflows.
        </p>
      </div>

      <div style={cardStyle}>
        <Database style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Structured Records</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Store and organize institutional data with clear structures and reliable access.
        </p>
      </div>

      <div style={cardStyle}>
        <BarChart3 style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Operational Visibility</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Track key activities and decisions with dashboards designed for academic teams.
        </p>
      </div>

      <div style={cardStyle}>
        <ShieldCheck style={{ color: '#f97316', marginBottom: '0.75rem' }} />
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Secure by Default</h3>
        <p style={{ margin: 0, color: '#667085', lineHeight: 1.6 }}>
          Built-in role controls and protected admin access for department-level operations.
        </p>
      </div>
    </div>
  </LegalPageLayout>
);

export default Platform;