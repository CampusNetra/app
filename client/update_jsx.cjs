const fs = require('fs');

const path = 'src/modules/common/LandingPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
if(!content.includes('framer-motion')) {
    content = content.replace(
        "import { useNavigate, Link } from 'react-router-dom';", 
        "import { useNavigate, Link } from 'react-router-dom';\nimport { motion, useMotionValue } from 'framer-motion';"
    );
}

// 2. Functional Components Injection
const components = \
/* --- Framer Motion Redesign Components --- */
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
  <motion.div variants={staggerContainer} initial="hidden" animate="show" className={className}>
    {React.Children.map(children, child => (
      <motion.div variants={staggerItem}>{child}</motion.div>
    ))}
  </motion.div>
);

const GeometricCampusMap = () => (
  <motion.div 
    className="lp-geometric-campus"
    animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
    transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
    style={{
      position: 'relative', width: '400px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
    }}
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
);

const CampusActivityChart = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none', opacity: 0.15 }}>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 400" fill="none">
      <motion.path d="M0 350 Q 150 250 250 150 T 500 120 T 800 220 T 1000 80" stroke="var(--cn-primary)" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 4, ease: customEase, delay: 0.3 }}
        style={{ filter: 'drop-shadow(0 0 10px var(--cn-primary))' }} />
      <motion.path d="M0 380 Q 200 320 300 270 T 600 220 T 900 170 T 1000 120" stroke="var(--cn-primary)" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 8"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 5, ease: customEase, delay: 0.5 }} />
    </svg>
  </div>
);
\n/* --- Main Landing Page --- */;

content = content.replace("/* --- Main Landing Page --- */", components);

// 3. MouseFollower Logic Injection
const hooks_str = \
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    // Only capture position relative to the viewport + scroll
    mouseX.set(e.clientX);
    mouseY.set(e.clientY + window.scrollY);
  };
\;

content = content.replace('const handleRoleSelect', hooks_str + '\n  const handleRoleSelect');

// 4. Transform Hero Section
const new_hero = \
        {/* --- Hero Section --- */}
        <section className="lp-hero">
          <CampusActivityChart />
          
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
            <GeometricCampusMap />
          </div>

          <StaggeredEntrance className="lp-hero-content">
            <h1 className="lp-hero-title">
              Elevate Your<br />Campus Experience
            </h1>
            <p className="lp-hero-subtitle-new">
              Unlock your institution's potential in a fully connected<br />
              environment, powered by Campus Netra
            </p>
            <div className="lp-hero-actions-new">
              <button className="lp-cta-solid" onClick={() => setOpenLoginModal(true)}>
                Sign Up & Connect
              </button>
            </div>
          </StaggeredEntrance>

          <div className="lp-hero-content" style={{ marginTop: '40px' }}>
            {/* Floating Glass Cards */}
            <div className="lp-glass-card lp-card-left">
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
            </div>

            <div className="lp-glass-card lp-card-right">
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
            </div>
          </div>
        </section>\;

// Regex replacement for Hero section handling any internal variations
let heroRegex = /\{\/\* --- Hero Section --- \*\/\}.*?(?=\{\/\* --- Problem Section --- \*\/\})/s;
content = content.replace(heroRegex, new_hero + '\n\n        ');

// Add onMouseMove to the main wrapper
content = content.replace('<div className={lp-page } ref={containerRef}>', 
'<div className={lp-page } ref={containerRef} onMouseMove={handleMouseMove}>');

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated LandingPage.jsx');
