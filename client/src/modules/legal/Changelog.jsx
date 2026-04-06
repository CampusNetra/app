import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  FileText, 
  Zap, 
  Target, 
  ArrowRight, 
  Database, 
  Shield, 
  Rocket, 
  Code,
  Globe
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../common/landing.css";

const Changelog = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // Premium reveal animation for progress bar
    const timer = setTimeout(() => setPercent(85), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="lp-page">
      <style>{`
        @media (max-width: 768px) {
          .cl-hero-title { font-size: 2.25rem !important; }
          .cl-hero-card { margin: 0 10px 32px !important; padding: 20px !important; }
          .cl-log-card { padding: 24px !important; border-radius: 16px !important; }
          .cl-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cl-footer-main { grid-template-columns: 1fr !important; gap: 32px !important; text-align: center !important; }
          .cl-footer-brand { margin-left: 0 !important; display: flex; flex-direction: column; align-items: center; }
          .cl-footer-links { justify-content: center !important; text-align: center; }
          .cl-footer-col { align-items: center !important; }
        }
      `}</style>

      <div className="lp-bg-orb lp-bg-orb-a" />
      <div className="lp-bg-orb lp-bg-orb-b" />
      <div className="lp-bg-orb lp-bg-orb-c" />

      {/* Header */}
      <header className="lp-header">
        <div className="lp-header-wrap">
          <Link to="/" className="lp-brand">
            <span className="lp-brand-logo">⊙</span>
            <span>Campus Netra</span>
          </Link>
          <nav className="lp-nav">
            <Link to="/">Platform</Link>
            <Link to="/">Resources</Link>
            <Link to="/">Support</Link>
          </nav>
          <Link to="/" className="lp-login-btn" style={{ textDecoration: 'none' }}>
            Home <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="lp-main">
        {/* HERO SECTION */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <p className="lp-kicker">TRACKING THE EVOLUTION TOWARDS GALGOTIAS PRODUCTION</p>
            <h1 className="cl-hero-title" style={{ marginBottom: '16px', fontSize: '3.5rem' }}>Nexus Evolution Log</h1>
            <p className="lp-subtitle" style={{ maxWidth: '700px', margin: '0 auto 40px' }}>
              Transparency matters. Follow our journey as we scale from limited Alpha to 
              University-wide Beta phase. Building the next generation of campus communication.
            </p>

            {/* ALPHA STATUS & PROGRESS */}
            <div className="cl-hero-card" style={{
              maxWidth: '500px',
              margin: '0 auto 48px',
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(244, 94, 18, 0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{
                  background: 'rgba(217, 45, 32, 0.08)',
                  padding: '6px 16px',
                  borderRadius: '100px',
                  color: '#d92d20',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(217, 45, 32, 0.1)'
                }}>
                  <div style={{ width: 6, height: 6, background: '#d92d20', borderRadius: '50%', boxShadow: '0 0 10px #d92d20' }} />
                  CURRENT STATUS: ALPHA
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                <span>Phase I: Ecosystem Stabilization</span>
                <span style={{ color: '#f45e12' }}>{percent}% to Beta</span>
              </div>
              
              <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden', padding: '3px' }}>
                <div style={{ 
                  width: `${percent}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #f45e12 0%, #ff8a3d 100%)',
                  borderRadius: '100px',
                  boxShadow: '0 0 15px rgba(244, 94, 18, 0.4)',
                  transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />
              </div>
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#475569', fontWeight: 500 }}>
                Next Major Milestone: <strong>Public Beta Entrance</strong> (Est. 1 Week)
              </p>
            </div>

            <div className="lp-hero-actions">
              <a href="#logs" className="lp-cta-primary" style={{ textDecoration: 'none' }}>Explore Builds</a>
              <Link to="/" className="lp-cta-secondary" style={{ textDecoration: 'none' }}>Platform Details</Link>
            </div>
          </div>
        </section>

        {/* LOGS SECTION */}
        <section id="logs" style={{ padding: '4rem 0 8rem' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
            
            {/* AURORA v0.62.1 */}
            <div className="cl-log-card" style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '40px', 
              border: '1px solid #e2e8f0',
              marginBottom: '3rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ background: '#f45e12', color: 'white', padding: '4px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>LATEST BUILD</span>
                <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>7th April 2026</span>
                <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>12 PATCHES SHIPPED</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>v0.62.1 "Aurora"</h2>
              
              <div className="cl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f45e12' }}>
                    <MessageSquare size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Faculty Delivery Layer</h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <li style={{ marginBottom: '12px' }}>• Faculty dashboard, subjects, announcements, assignments, materials, polls, and profile were refreshed for the mobile-first faculty workflow.</li>
                    <li>• Missing faculty announcement APIs were wired so faculty posts now save correctly instead of dying at route level.</li>
                  </ul>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f45e12' }}>
                    <Database size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Feed & Poll Integrity</h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <li style={{ marginBottom: '12px' }}>• Student feed now merges faculty announcements, assignments, and polls through section and department targeting.</li>
                    <li>• Polls now support one-time voting, student-side result visibility, and faculty-side percentage breakdowns per option.</li>
                  </ul>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f45e12' }}>
                    <Zap size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Release Notes</h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <li style={{ marginBottom: '12px' }}>• Login and landing release markers were bumped to the 62 line for this iteration.</li>
                    <li>• Beta completion has been raised to 85% as the faculty-student communication loop is now largely connected.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SOLARIS v0.58.6 */}
            <div className="cl-log-card" style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '40px', 
              border: '1px solid #e2e8f0',
              marginBottom: '3rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>PREVIOUS RELEASE</span>
                <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>6th April 2026</span>
                <a 
                  href="https://github.com/CampusNetra/app/commit/5c6011068c6cc484adb4b0be5e31cb62966550af"
                  target="_blank"
                  rel="noopener"
                  style={{ 
                    color: '#f45e12', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    fontFamily: 'JetBrains Mono, monospace',
                    textDecoration: 'none',
                    background: 'rgba(244, 94, 18, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >commit: 5c60110</a>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#334155', marginBottom: '32px' }}>v0.58.6 "Solaris"</h2>
              
              <div className="cl-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f45e12' }}>
                    <Shield size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Session Resilience</h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <li style={{ marginBottom: '12px' }}>• Advanced LocalStorage migration for session persistence.</li>
                    <li>• Smart route guards preventing unauthorized dashboard access.</li>
                  </ul>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#f45e12' }}>
                    <Database size={20} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Structural Integrity</h3>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <li style={{ marginBottom: '12px' }}>• Unified D1 production schema synchronization.</li>
                    <li>• Dialect-aware SQL translation for D1 stability.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* QUANTUM SYNC v0.52.5 */}
            <div className="cl-log-card" style={{ 
              background: 'white', 
              borderRadius: '24px', 
              padding: '40px', 
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em' }}>PREVIOUS RELEASE</span>
                <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' }}>6th April 2026</span>
                <a 
                  href="https://github.com/CampusNetra/app/commit/3ef7e2b8977b36763dfaa06163f05742b0b50c9c"
                  target="_blank"
                  rel="noopener"
                  style={{ 
                    color: '#f45e12', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    fontFamily: 'JetBrains Mono, monospace',
                    textDecoration: 'none',
                    background: 'rgba(244, 94, 18, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >node: 3ef7e2b</a>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#334155', marginBottom: '40px' }}>v0.52.5 "Quantum Sync"</h2>
              
              <div className="cl-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#101828' }}>
                    <Database size={20} style={{ color: '#f45e12' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Database Infrastructure</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475467', fontSize: '14px', lineHeight: 1.6 }}>
                    <li><strong>Unified D1 Schema:</strong> Completely merged/optimized SQLite schema for Cloudflare.</li>
                    <li><strong>Constraint Evolution:</strong> Re-indexed channels for department-wide broadcast logic.</li>
                    <li><strong>Dialect-Aware SQL:</strong> Deep-translation layer for complex MySQL sorting patterns.</li>
                  </ul>
                </section>

                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#101828' }}>
                    <Shield size={20} style={{ color: '#f45e12' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Identity & Security</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475467', fontSize: '14px', lineHeight: 1.6 }}>
                    <li><strong>Persistent Sessions:</strong> Hardened login model with multi-role LocalStorage persistency.</li>
                    <li><strong>Role-Based Guards:</strong> New global route protection for Student/Faculty/Admin dashboards.</li>
                    <li><strong>Smart Authentication:</strong> Session-aware entry points that automatically bypass landing.</li>
                  </ul>
                </section>

                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#101828' }}>
                    <MessageSquare size={20} style={{ color: '#f45e12' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Communication Suite</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475467', fontSize: '14px', lineHeight: 1.6 }}>
                    <li><strong>Optimized Group Chat:</strong> Corrected message sorting and owner-attribution logic.</li>
                    <li><strong>Full Modules Activation:</strong> Integrated Clubs, Assignments, Materials, and Announcements.</li>
                    <li><strong>Read Tracking:</strong> Enhanced read-status markers for section-based groups.</li>
                  </ul>
                </section>

                <section>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#101828' }}>
                    <Zap size={20} style={{ color: '#f45e12' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Design & UX</h3>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#475467', fontSize: '14px', lineHeight: 1.6 }}>
                    <li><strong>Performance Badges:</strong> New striking version tracking badge on global landing.</li>
                    <li><strong>Unified Styles:</strong> Synchronized student/faculty UI components for cohesive experience.</li>
                    <li><strong>Motion Transitions:</strong> Improved route transitions and entrance animations.</li>
                  </ul>
                </section>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="lp-footer" style={{ borderTop: '1px solid #e2e8f0', background: 'var(--color-slate)', padding: '80px 0 0' }}>
        <div className="lp-footer-wrap">
          <div className="cl-footer-main" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.5fr 1fr 1fr', 
            gap: '40px', 
            paddingBottom: '60px',
            maxWidth: '1280px',
            margin: '0 auto'
          }}>
            <div className="cl-footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                <span style={{ color: '#f45e12', fontSize: '28px' }}>⊙</span>
                <span>Campus Netra</span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', lineHeight: 1.6, maxWidth: '320px' }}>
                The unified communication ecosystem for modern universities. 
                Built for clarity, speed, and institutional harmony.
              </p>
            </div>
            
            <div className="cl-footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'white', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '14px' }}>Dashboard</Link>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '14px' }}>Academics</Link>
              <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '14px' }}>Resources</Link>
            </div>

            <div className="cl-footer-col" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'white', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
              <Link to="/privacy-policy" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '14px' }}>Privacy Policy</Link>
              <Link to="/terms-of-service" style={{ color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', fontSize: '14px' }}>Terms of Service</Link>
              <Link to="/changelog" style={{ color: '#f45e12', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Changelog</Link>
            </div>
          </div>

          <div className="lp-footer-bottom" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '32px 0', 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: '1280px',
            margin: '0 auto'
          }}>
            <div className="lp-footer-copyright">
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>&copy; 2026 Campus Netra. Built by Syntax-Sinners for Galgotias University.</p>
            </div>
            <Link to="/changelog" className="lp-version-badge" style={{ textDecoration: 'none', background: 'rgba(255, 255, 255, 0.05)' }}>
              <span className="lp-version-dot" />
              alpha-0.62.1
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Changelog;
