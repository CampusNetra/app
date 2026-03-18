import React from 'react';
import LegalPageLayout from './LegalPageLayout';

const headingStyle = { margin: '0 0 0.5rem 0', fontSize: '1rem' };
const textStyle = { margin: 0, color: '#667085', lineHeight: 1.7 };

const TermsOfService = () => (
  <LegalPageLayout
    title="Terms of Service"
    subtitle="The usage terms for Campus Netra platform access and administration."
  >
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      <section>
        <h3 style={headingStyle}>1. Acceptance of Terms</h3>
        <p style={textStyle}>
          By using Campus Netra, authorized users agree to comply with these terms and institutional
          usage policies.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>2. Authorized Use</h3>
        <p style={textStyle}>
          Platform access is limited to approved administrators and must be used only for legitimate
          academic operations.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>3. Account Responsibility</h3>
        <p style={textStyle}>
          Users are responsible for maintaining account confidentiality and for actions performed through
          their accounts.
        </p>
      </section>

      <section>
        <h3 style={headingStyle}>4. Service Updates</h3>
        <p style={textStyle}>
          Campus Netra may update platform features and these terms as needed to improve reliability,
          security, and compliance.
        </p>
      </section>
    </div>
  </LegalPageLayout>
);

export default TermsOfService;