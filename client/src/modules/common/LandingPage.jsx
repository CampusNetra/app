import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquare, Users, Calendar, FileText, Zap, Target, X, ArrowRight, ChevronDown, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useScroll, useTransform, useSpring } from 'framer-motion';
import './landing.css';

/* ─── Intersection Observer hook for scroll reveals ─── */
const useScrollReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    // Note: Intersection Observer removed in favor of Framer Motion whileInView/useInView for better performance
  }, []);

  return ref;
};

/* ─── Floating Particles Component ─── */
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 2,
    duration: Math.random() * 10 + 8,
    delay: Math.random() * 8,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '#ff6129' : '#6c5ce7',
  }));

  return (
    <div className="lp-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="lp-particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
};

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const start = 0;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(start + (end - start) * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};
/* ─── Framer Motion Redesign Components ─── */
const customEase = [0.16, 1, 0.3, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: customEase } }
};

const StaggeredEntrance = ({ children, className }) => (
  <motion.div 
    variants={staggerContainer} 
    initial="hidden" 
    whileInView="show" 
    viewport={{ once: true, margin: "-100px" }}
    className={className}
  >
    {React.Children.map(children, child => (
      <motion.div variants={staggerItem}>{child}</motion.div>
    ))}
  </motion.div>
);

const RevealItem = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, ease: customEase, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const GeometricCampusMap = ({ scrollProgress }) => {
  const y = useTransform(scrollProgress, [0, 1], [0, -200]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, 15]);

  return (
    <motion.div 
      className="lp-geometric-campus"
      style={{
        y, rotate,
        position: 'relative', width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
      }}
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle cx="200" cy="200" r="140" stroke="var(--cn-primary)" strokeWidth="1" strokeDasharray="4 8" opacity="0.3"
            animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }} />
          <motion.circle cx="200" cy="200" r="100" stroke="var(--cn-primary)" strokeWidth="1.5" opacity="0.5"
            animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }} />
          
          <motion.path d="M200 80 L300 140 L300 260 L200 320 L100 260 L100 140 Z" fill="rgba(203, 150, 77, 0.03)" stroke="var(--cn-primary)" strokeWidth="1.5" 
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: customEase, delay: 0.2 }} />
          <motion.path d="M200 80 L200 200 L300 140 M200 200 L300 260 M200 200 L200 320 M200 200 L100 260 M200 200 L100 140" stroke="var(--cn-primary)" strokeWidth="1" opacity="0.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: customEase, delay: 0.5 }} />
          
          <circle cx="200" cy="200" r="8" fill="var(--cn-primary)" style={{ filter: 'drop-shadow(0 0 12px var(--cn-primary))' }} />
          <circle cx="200" cy="80" r="4" fill="var(--cn-primary)" />
          <circle cx="300" cy="140" r="4" fill="var(--cn-primary)" />
          <circle cx="300" cy="260" r="4" fill="var(--cn-primary)" />
          <circle cx="200" cy="320" r="4" fill="var(--cn-primary)" />
          <circle cx="100" cy="260" r="4" fill="var(--cn-primary)" />
          <circle cx="100" cy="140" r="4" fill="var(--cn-primary)" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const CampusActivityChart = ({ scrollProgress }) => {
  const y = useTransform(scrollProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollProgress, [0, 0.3], [0.15, 0]);

  return (
    <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none', opacity, y }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 400" fill="none">
        <motion.path d="M0 350 Q 150 250 250 150 T 500 120 T 800 220 T 1000 80" stroke="var(--cn-primary)" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: customEase, delay: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 10px var(--cn-primary))' }} />
        <motion.path d="M0 380 Q 200 320 300 270 T 600 220 T 900 170 T 1000 120" stroke="var(--cn-primary)" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, ease: customEase, delay: 0.5 }} />
      </svg>
    </motion.div>
  );
};

/* ─── Main Landing Page ─── */
const LandingPage = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cn-theme');
    return saved ? saved === 'dark' : true; // default dark
  });
  const navigate = useNavigate();
  const containerRef = useScrollReveal();

  // Persist theme preference
  const toggleTheme = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('cn-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

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

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = openLoginModal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [openLoginModal]);

  // Mouse move follower hook
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY + window.scrollY);
  };

  const handleRoleSelect = (role) => {
    setOpenLoginModal(false);
    if (role === 'admin') navigate('/admin/login');
    if (role === 'student') navigate('/student/welcome');
    if (role === 'faculty') navigate('/faculty/login');
  };

  return (
    <div className={`lp-page ${darkMode ? '' : 'lp-light'}`} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Background effects */}
      <div className="lp-bg-grid" />

      {/* ─── Header ─── */}
      <header className={`lp-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="lp-header-wrap">
          <div className="lp-brand">
            <span className="lp-brand-logo">⊙</span>
            <span>Campus Netra</span>
          </div>
          <nav className="lp-nav">
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#support">Support</a>
          </nav>
          <button className="lp-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="lp-login-btn" onClick={() => setOpenLoginModal(true)}>
            Get Started <ArrowRight size={15} />
          </button>
        </div>
      </header>

      <div className="lp-hero-wrapper">
        <section className="lp-hero">
          <CampusActivityChart scrollProgress={smoothProgress} />
          
          <motion.div 
            className="lp-mouse-glow"
            style={{
              x: mouseX, y: mouseY,
              position: 'absolute', top: -200, left: -200, width: 400, height: 400,
              borderRadius: '50%', background: 'radial-gradient(circle, var(--cn-primary-glow) 0%, transparent 70%)',
              pointerEvents: 'none', zIndex: 1, filter: 'blur(50px)'
            }}
          />

          <div className="lp-hero-orb-container">
            <GeometricCampusMap scrollProgress={smoothProgress} />
          </div>

          <FloatingParticles />

          <StaggeredEntrance className="lp-hero-content">
            <h1 className="lp-hero-title">
              The Campus<br />Operating System
            </h1>
            <p className="lp-hero-subtitle-new">
              The centralized communication operating system for modern universities.<br />
              Replace fragmented WhatsApp groups with structured, official campus feeds.
            </p>
            <div className="lp-hero-actions-new">
              <button className="lp-cta-solid" onClick={() => setOpenLoginModal(true)}>
                Sign Up & Connect
              </button>
            </div>
          </StaggeredEntrance>

        <div className="lp-hero-content" style={{ marginTop: '40px', position: 'relative', zIndex: 2 }}>
          {/* Floating Glass Cards */}
          <motion.div 
            className="lp-glass-card lp-card-left"
            style={{ y: useTransform(smoothProgress, [0, 0.5], [0, -120]) }}
          >
            <div className="lp-glass-card-header">
              <span>Active Campuses</span>
              <div className="lp-card-icon-wrap"><ArrowUpRight size={14} /></div>
            </div>
            <div className="lp-glass-card-body">
              <h4>Unparalleled</h4>
              <h4>Network Access</h4>
              <div className="lp-glass-card-stat">
                 <AnimatedCounter end={96} suffix="%" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lp-glass-card lp-card-right"
            style={{ y: useTransform(smoothProgress, [0, 0.5], [0, -180]) }}
          >
            <div className="lp-glass-card-header">
              <span>Total Users</span>
              <div className="lp-card-icon-wrap"><ArrowUpRight size={14} /></div>
            </div>
            <div className="lp-glass-card-body lp-card-body-large">
              <h2>
                 <AnimatedCounter end={98} suffix="%" />
              </h2>
              <div className="lp-progress-bar">
                <div className="lp-progress-fill"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>

    <main className="lp-main">

        {/* ─── Problem Section ─── */}
        <section className="lp-problem" id="platform">
          <RevealItem className="lp-reveal-header" style={{ textAlign: 'center' }}>
            <span className="lp-section-label">The Problem</span>
            <h2 className="lp-section-title">Communication is broken on campus</h2>
            <p className="lp-section-desc">
              Universities rely on unstructured methods that create information chaos.
              Critical updates get lost in the noise.
            </p>
          </RevealItem>
          <div className="lp-problem-grid">
            {[
              {
                icon: '📡',
                title: 'Information Fragmentation',
                desc: 'Important updates like exam schedules and class changes are scattered across WhatsApp, Instagram, and informal chats.',
              },
              {
                icon: '📉',
                title: 'Critical Information Loss',
                desc: 'Assignment deadlines and policy updates get buried under thousands of casual messages in unstructured groups.',
              },
              {
                icon: '🔇',
                title: 'Lack of Official Channels',
                desc: 'Faculty and departments lack a dedicated, noise-free infrastructure to reach students officially and reliably.',
              },
              {
                icon: '👁️',
                title: 'Poor Event Discoverability',
                desc: 'Students miss out on workshops, club activities, and campus-wide opportunities due to poor announcement visibility.',
              },
            ].map((item, i) => (
              <RevealItem key={i} className="lp-problem-item" delay={i * 0.1}>
                <div className="lp-problem-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </RevealItem>
            ))}
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section className="lp-features" id="features">
          <RevealItem style={{ textAlign: 'center' }}>
            <span className="lp-section-label">Core Features</span>
            <h2 className="lp-section-title">What Campus Netra Provides</h2>
            <p className="lp-section-desc">
              A comprehensive communication infrastructure designed for modern universities.
            </p>
          </RevealItem>
          <div className="lp-features-grid">
            {[
              {
                Icon: MessageSquare,
                title: 'Structured Threaded Feed',
                desc: 'Faculty post root announcements; students respond in organized threads. No more cluttered subject chats or buried info.',
              },
              {
                Icon: Users,
                title: 'Privacy-First Section Chats',
                desc: 'Dedicated, student-only spaces for private section-level coordination. Zero faculty or admin oversight for true peer-to-peer freedom.',
              },
              {
                Icon: FileText,
                title: 'Academic Material Analytics',
                desc: 'Track engagement with lecture notes and assignments. Faculty see view counts and material downloads in real-time.',
              },
              {
                Icon: Calendar,
                title: 'Lifecycle Automation',
                desc: 'From Year 1 admission to Alumni status—the system handles student promotions and semester transitions (2025_ODD) automatically.',
              },
              {
                Icon: Zap,
                title: 'Multi-Section Broadcasting',
                desc: 'Faculty teaching multiple sections can broadcast a single announcement to all assigned groups with one-click efficiency.',
              },
              {
                Icon: Target,
                title: 'Identity-Linked Security',
                desc: 'Institutional email auth (OTP-based) ensures only verified campus members can access secure department channels.',
              },
            ].map(({ Icon, title, desc }, i) => (
              <RevealItem key={i} className="lp-feature-card" delay={(i % 3) * 0.1}>
                <div className="lp-feature-icon">
                  <Icon size={26} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </RevealItem>
            ))}
          </div>
        </section>

        {/* ─── Roles Section ─── */}
        <section className="lp-roles" id="roles">
          <RevealItem style={{ textAlign: 'center' }}>
            <span className="lp-section-label">Built for Everyone</span>
            <h2 className="lp-section-title">Every Campus Stakeholder</h2>
            <p className="lp-section-desc">
              Each role gets a purpose-built interface tailored to their unique needs.
            </p>
          </RevealItem>
          <div className="lp-roles-grid">
            <RevealItem className="lp-role-card" delay={0.1}>
              <div className="lp-role-header">
                <div className="lp-role-emoji">📱</div>
                <h3>Students</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">Access "MCA Section 4" private student channels</div>
                <div className="lp-benefit">Follow campus clubs and register for alumni mentorship</div>
                <div className="lp-benefit">Participate in threaded subject discussions (DBMS, OS)</div>
                <div className="lp-benefit">Verified institutional profile with lifecycle tracking</div>
                <div className="lp-benefit">Real-time alerts for critical institutional notices</div>
              </div>
            </RevealItem>

            <RevealItem className="lp-role-card" delay={0.2}>
              <div className="lp-role-header">
                <div className="lp-role-emoji">👨‍🏫</div>
                <h3>Faculty</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">Broadcast announcements to 10+ sections simultaneously</div>
                <div className="lp-benefit">Upload assignment archives with engagement analytics</div>
                <div className="lp-benefit">Channel moderation (Pin, Archive, Global Lock)</div>
                <div className="lp-benefit">Instant OTP-based web and mobile dashboard access</div>
                <div className="lp-benefit">Automated student enrollment via subject offering sync</div>
              </div>
            </RevealItem>

            <RevealItem className="lp-role-card" delay={0.3}>
              <div className="lp-role-header">
                <div className="lp-role-emoji">⚙️</div>
                <h3>Administration</h3>
              </div>
              <div className="lp-role-benefits">
                <div className="lp-benefit">Initialize academic terms (e.g., 2025_ODD) in seconds</div>
                <div className="lp-benefit">Automated "Student Promotion" across semesters</div>
                <div className="lp-benefit">Bulk ERP sync for batch deployments (2025–2027)</div>
                <div className="lp-benefit">Platform-wide governance and moderation audit logs</div>
                <div className="lp-benefit">Unified alumni network conversion post-graduation</div>
              </div>
            </RevealItem>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="lp-how-it-works" id="support">
          <RevealItem style={{ textAlign: 'center' }}>
            <span className="lp-section-label">Simple Process</span>
            <h2 className="lp-section-title">How It Works</h2>
          </RevealItem>
          
          <motion.div 
            className="lp-how-timeline"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.3 }
              }
            }}
          >
            {[
              {
                num: 1,
                title: 'ERP Data Import',
                desc: 'Admins import student and faculty records via CSV file to establish the institutional hierarchy.',
              },
              {
                num: 2,
                title: 'Auto-Channel Sync',
                desc: 'The system automatically generates structured channels for departments, sections, and subjects.',
              },
              {
                num: 3,
                title: 'Faculty Engagement',
                desc: 'Faculty begin posting announcements, assignments, and materials to their designated section feeds.',
              },
              {
                num: 4,
                title: 'Personalized Delivery',
                desc: 'Students receive real-time, personalized updates based on their specific section and enrolled subjects.',
              },
            ].map((item, i, arr) => (
              <div key={i} className="lp-how-step">
                {/* Connector before card (except first) */}
                {i > 0 && (
                  <motion.div 
                    className="lp-how-connector"
                    variants={{
                      hidden: { opacity: 0, scaleX: 0 },
                      show: { opacity: 1, scaleX: 1, transition: { duration: 0.5, ease: customEase } }
                    }}
                    style={{ transformOrigin: 'left' }}
                  >
                    <div className="lp-how-connector-inner">
                      <div className="lp-how-connector-line" />
                      <div className="lp-how-connector-glow" />
                      <div className="lp-how-connector-arrow" />
                    </div>
                  </motion.div>
                )}
                {/* Step card */}
                <motion.div 
                  className="lp-how-item"
                  variants={{
                    hidden: { opacity: 0, y: 40, scale: 0.95 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: customEase } }
                  }}
                  style={{ opacity: 1, transform: 'none' }} // Override legacy CSS opacity:0
                >
                  <div className="lp-how-number">{item.num}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ─── Highlight / CTA ─── */}
        <section className="lp-highlight">
          <RevealItem className="lp-highlight-content">
            <h2>The Future of Campus Life</h2>
            <p>
              Campus Netra is more than a chat app—it's a <strong>Campus Operating System</strong> that digitizes every institutional interaction.
              From assignment management to a student-centric marketplace, we're building the unified foundation for the digital university.
            </p>
            <div className="lp-highlight-badge">
              ✓ Assignment Management • Marketplace • Event Registration • ERP Optimized
            </div>
          </RevealItem>
        </section>
      </main>

      {/* ─── Login Modal ─── */}
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

      {/* ─── Footer ─── */}
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
              <li>
                <a href="https://syntax-sinners.github.io/web" target="_blank" rel="noopener noreferrer" className="lp-highlight-link">
                  Syntax-Sinners
                </a>
              </li>
              <li>
                <a href="https://github.com/CampusNetra/app" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div className="lp-footer-section">
            <h4>For</h4>
            <ul>
              <li>Galgotias University</li>
            </ul>
          </div>
        </div>

        <div className="lp-footer-divider" />

        <div className="lp-footer-bottom">
          <div className="lp-footer-copyright">
            <p>&copy; 2026 Campus Netra. Built by Syntax-Sinners for Galgotias University.</p>
          </div>
          <Link to="/changelog" className="lp-version-badge">
            <span className="lp-version-dot" />
            alpha-0.62.1
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
