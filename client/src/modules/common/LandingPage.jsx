import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Calendar, FileText, Zap, Target, X, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './landing.css';

const LandingPage = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing sessions and redirect
    if (localStorage.getItem('token')) {
      navigate('/admin/dashboard');
    } else if (localStorage.getItem('student_token')) {
      navigate('/student/feed');
    } else if (localStorage.getItem('faculty_token')) {
      navigate('/faculty/dashboard');
    }
  }, [navigate]);

  const handleRoleSelect = (role) => {
    setOpenLoginModal(false);
    if (role === 'admin') navigate('/admin/login');
    if (role === 'student') navigate('/student/welcome');
    if (role === 'faculty') navigate('/faculty/login');
  };

  return (
    <div className="lp-page">
      <div className="lp-bg-orb lp-bg-orb-a" />
      <div className="lp-bg-orb lp-bg-orb-b" />
      <div className="lp-bg-orb lp-bg-orb-c" />

      {/* Header */}
      <header className="lp-header">
        <div className="lp-header-wrap">
          <div className="lp-brand">
            <span className="lp-brand-logo">⊙</span>
            <span>Campus Netra</span>
          </div>
          <nav className="lp-nav">
            <a href="#platform">Platform</a>
            <a href="#resources">Resources</a>
            <a href="#support">Support</a>
          </nav>
          <button className="lp-login-btn" onClick={() => setOpenLoginModal(true)}>
            Login <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main className="lp-main">
        {/* Hero Section */}
        <section className="lp-hero">
          <div className="lp-hero-content">
            <p className="lp-kicker">BUILT BY SYNTAX-SINNERS FOR GALGOTIAS UNIVERSITY</p>
            <h1>Replace fragmented communication with one structured platform</h1>
            <p className="lp-subtitle">
              Campus Netra unifies announcements, academics, groups, and events into a single 
              communication layer built for universities. No more WhatsApp noise, scattered notices, 
              or missed updates—just clear, role-based communication that works.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-cta-primary" onClick={() => setOpenLoginModal(true)}>
                Choose Your Role <ArrowRight size={18} />
              </button>
              <button className="lp-cta-secondary">Learn More</button>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="lp-problem">
          <h2>The Problem</h2>
          <p className="lp-section-desc">
            Universities rely on unstructured communication methods that create information chaos.
          </p>
          <div className="lp-problem-grid">
            <div className="lp-problem-item">
              <div className="lp-problem-icon">❌</div>
              <h3>Information Fragmentation</h3>
              <p>Students monitor WhatsApp groups, Instagram pages, notice boards, and emails separately—missing critical updates.</p>
            </div>
            <div className="lp-problem-item">
              <div className="lp-problem-icon">❌</div>
              <h3>Important Information Loss</h3>
              <p>Announcements about exam schedules and assignment deadlines get buried under casual messages.</p>
            </div>
            <div className="lp-problem-item">
              <div className="lp-problem-icon">❌</div>
              <h3>No Official Channels</h3>
              <p>Departments lack a unified official communication system, leaving informal networks as the default.</p>
            </div>
            <div className="lp-problem-item">
              <div className="lp-problem-icon">❌</div>
              <h3>Poor Event Visibility</h3>
              <p>Many students remain unaware of workshops, clubs, and campus opportunities entirely.</p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="lp-features">
          <h2>What Campus Netra Provides</h2>
          <p className="lp-section-desc">
            A comprehensive communication infrastructure designed for modern universities.
          </p>
          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><MessageSquare size={28} /></div>
              <h3>Unified Campus Feed</h3>
              <p>Personalized announcements, club updates, and academic posts all in one place. Stay informed without the noise.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><Users size={28} /></div>
              <h3>Structured Group Chats</h3>
              <p>Subject channels, section groups, and club communities—organized by academic hierarchy for clarity.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><FileText size={28} /></div>
              <h3>Academic Materials</h3>
              <p>Faculty share assignments, lecture notes, and course materials directly within channels.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><Calendar size={28} /></div>
              <h3>Event Notifications</h3>
              <p>Discover workshops, club meetings, and campus activities as they're announced in real-time.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><Zap size={28} /></div>
              <h3>Real-Time Communication</h3>
              <p>Instant messaging, thread discussions, and live updates across the platform using Socket.io.</p>
            </div>
            <div className="lp-feature-card">
              <div className="lp-feature-icon"><Target size={28} /></div>
              <h3>Role-Based Control</h3>
              <p>Admin configures departments and channels; faculty posts; students engage—all with clear permissions.</p>
            </div>
          </div>
        </section>

        {/* Value by Role */}
        <section className="lp-roles">
          <h2>Built for Every Campus Stakeholder</h2>
          <p className="lp-section-desc">
            Each role gets a purpose-built interface tailored to their needs.
          </p>
          <div className="lp-roles-grid">
            <div className="lp-role-card">
              <div className="lp-role-header">
                <div className="lp-role-emoji">📱</div>
                <h3>Students</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">✓ Mobile-first feed with personalized updates</div>
                <div className="lp-benefit">✓ Track assignments and deadlines in one place</div>
                <div className="lp-benefit">✓ Join clubs and discover campus events</div>
                <div className="lp-benefit">✓ Participate in subject and section discussions</div>
                <div className="lp-benefit">✓ Access course materials and notes</div>
              </div>
            </div>

            <div className="lp-role-card">
              <div className="lp-role-header">
                <div className="lp-role-emoji">👨‍🏫</div>
                <h3>Faculty</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">✓ Post announcements to multiple sections at once</div>
                <div className="lp-benefit">✓ Share assignments and materials with organized channels</div>
                <div className="lp-benefit">✓ Moderate subject discussions and student questions</div>
                <div className="lp-benefit">✓ View engagement and student interactions</div>
                <div className="lp-benefit">✓ Pin important notices for visibility</div>
              </div>
            </div>

            <div className="lp-role-card">
              <div className="lp-role-header">
                <div className="lp-role-emoji">⚙️</div>
                <h3>Administration</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">✓ Import and manage student and faculty records</div>
                <div className="lp-benefit">✓ Configure departments, sections, and subjects</div>
                <div className="lp-benefit">✓ Assign faculty to courses automatically</div>
                <div className="lp-benefit">✓ Monitor platform activity and analytics</div>
                <div className="lp-benefit">✓ Manage terms and academic calendar</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="lp-how-it-works">
          <h2>How It Works</h2>
          <div className="lp-how-grid">
            <div className="lp-how-item">
              <div className="lp-how-number">1</div>
              <h3>Admin Imports Data</h3>
              <p>Load student records, faculty assignments, and academic structure through CSV import.</p>
            </div>
            <div className="lp-how-item">
              <div className="lp-how-number">2</div>
              <h3>System Auto-Creates Channels</h3>
              <p>Channels for sections, subjects, and clubs are automatically generated from structure data.</p>
            </div>
            <div className="lp-how-item">
              <div className="lp-how-number">3</div>
              <h3>Faculty Posts Updates</h3>
              <p>Faculty share announcements, assignments, and updates to their sections and subjects.</p>
            </div>
            <div className="lp-how-item">
              <div className="lp-how-number">4</div>
              <h3>Students Stay Informed</h3>
              <p>Students see their personalized feed with updates from all their subjects and sections.</p>
            </div>
          </div>
        </section>

        {/* Highlight */}
        <section className="lp-highlight">
          <div className="lp-highlight-content">
            <h2>Built to Scale</h2>
            <p>
              Campus Netra is designed as a <strong>department-scoped foundation</strong> that grows 
              with your university. Start with one department, expand to the entire institution. 
              Each role gets a clear interface—no confusion, just structured communication.
            </p>
            <div className="lp-highlight-badge">
              ✓ Launch-ready • Modular • Scalable • Real-time
            </div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      {openLoginModal && (
        <div className="lp-modal-backdrop" onClick={() => setOpenLoginModal(false)}>
          <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="lp-modal-close" onClick={() => setOpenLoginModal(false)}>
              <X size={20} />
            </button>
            <h3>Continue as</h3>
            <p className="lp-modal-desc">Select your role to access the platform</p>
            <div className="lp-role-grid-modal">
              <button className="lp-role-btn" onClick={() => handleRoleSelect('admin')}>
                <div className="lp-role-icon">⚙️</div>
                <div className="lp-role-label">Admin</div>
                <div className="lp-role-description">Manage departments and configure the system</div>
              </button>
              <button className="lp-role-btn" onClick={() => handleRoleSelect('student')}>
                <div className="lp-role-icon">📱</div>
                <div className="lp-role-label">Student</div>
                <div className="lp-role-description">Access your feed and connect with peers</div>
              </button>
              <button className="lp-role-btn" onClick={() => handleRoleSelect('faculty')}>
                <div className="lp-role-icon">👨‍🏫</div>
                <div className="lp-role-label">Faculty</div>
                <div className="lp-role-description">Communicate with your sections</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-footer-content">
          <div className="lp-footer-section">
            <h4>Project</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="/terms-of-service">Terms</a></li>
              <li><a href="/privacy-policy">Privacy</a></li>
            </ul>
          </div>

          <div className="lp-footer-section">
            <h4>Built By</h4>
            <ul>
              <li><a href="https://syntax-sinners.github.io/web" target="_blank" rel="noopener noreferrer" className="lp-highlight-link">Syntax-Sinners</a></li>
              <li><a href="https://github.com/CampusNetra/app" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>

          <div className="lp-footer-section">
            <h4>For</h4>
            <ul>
              <li>Galgotias University</li>
            </ul>
          </div>
        </div>

        <div className="lp-footer-divider"></div>

        <div className="lp-footer-bottom">
          <div className="lp-footer-copyright">
            <p>&copy; 2026 Campus Netra. Built by Syntax-Sinners for Galgotias University.</p>
          </div>
          <Link to="/changelog" className="lp-version-badge">
            <span className="lp-version-dot" />
            alpha-0.58.9
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
