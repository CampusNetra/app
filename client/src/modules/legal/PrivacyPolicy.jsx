import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const headingStyle = { margin: '0 0 0.5rem 0', fontSize: '1rem' };
const textStyle = { margin: 0, color: '#667085', lineHeight: 1.7 };

const PrivacyPolicy = () => (
  <LegalPageLayout
    title="Privacy Policy"
    subtitle="How Campus Netra handles, protects, and uses your institutional data."
  >
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <section>
        <h3 style={headingStyle}>1. Information We Collect</h3>
        <p style={textStyle}>
          We collect account and operational data needed to provide platform functionality, including
          administrator details and workflow records.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>2. How We Use Data</h3>
        <p style={textStyle}>
          Data is used only to operate, maintain, and improve Campus Netra services for authorized
          institutional users.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>3. Security</h3>
        <p style={textStyle}>
          We apply technical and organizational safeguards to protect data against unauthorized access,
          loss, or misuse.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>4. Contact</h3>
        <p style={textStyle}>
          For privacy-related questions, contact support@campusnetra.com.
        </p>
      </section>
    </div>
  </LegalPageLayout>
);

export default PrivacyPolicy;