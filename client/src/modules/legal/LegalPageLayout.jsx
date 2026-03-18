import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import '../admin/auth.css';

const LegalPageLayout = ({ title, subtitle, children }) => (
  <div className="cn-auth-page">
    <header className="cn-auth-topbar">
      <Link to="/" className="cn-auth-brandmark">
        <div className="cn-auth-brandmark-icon">
          <Shield size={18} strokeWidth={2.5} />
        </div>
        <span className="cn-auth-brandmark-text">Campus Netra</span>
      </Link>

      <nav className="cn-auth-topnav">
        <Link to="/platform">Platform</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/support">Support</Link>
      </nav>
    </header>

    <main className="cn-auth-main" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>
      <div className="cn-auth-shell" style={{ maxWidth: '920px' }}>
        <div className="cn-auth-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h1 className="cn-auth-heading">{title}</h1>
          {subtitle ? <p className="cn-auth-subtext">{subtitle}</p> : null}
        </div>

        <div className="cn-auth-card" style={{ padding: '2rem' }}>
          {children}
        </div>
      </div>
    </main>

    <footer className="cn-auth-bottom">
      <div className="cn-auth-bottom-nav">
        <Link to="/platform">Platform</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/support">Support</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-of-service">Terms of Service</Link>
      </div>

      <div className="cn-auth-bottom-legal">
        <p className="cn-auth-copyright">
          © {new Date().getFullYear()} Campus Netra. Proudly serving Galgotias University.
        </p>
        <a
          href="https://syntax-sinners.github.io/web/"
          target="_blank"
          rel="noreferrer"
          className="cn-auth-badge"
        >
          Built by <span>Syntax Sinners</span>
        </a>
      </div>
    </footer>
  </div>
);

export default LegalPageLayout;