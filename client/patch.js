const fs = require('fs');
const file = 'src/modules/common/landing.css';
let content = fs.readFileSync(file, 'utf8');

const newHeroCSS = \/* ===== HERO SECTION ===== */
.lp-hero {
  padding: clamp(8rem, 14vw, 12rem) 0 clamp(4rem, 8vw, 8rem);
  text-align: center;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lp-hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  width: 100%;
}

/* Liquid Orb Background */
.lp-hero-orb-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-10% + var(--scroll-y, 0px) * 0.4));
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lp-liquid-orb {
  position: relative;
  width: 90vw;
  max-width: 800px;
  height: 90vw;
  max-height: 600px;
  border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 60%),
              linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(108, 92, 231, 0.3) 50%, rgba(255, 97, 41, 0.2) 100%),
              #111;
  box-shadow:
    inset 20px 20px 60px rgba(255, 255, 255, 0.15),
    inset -30px -30px 80px rgba(108, 92, 231, 0.4),
    inset 40px -40px 80px rgba(255, 97, 41, 0.3),
    inset -40px 40px 80px rgba(255, 215, 0, 0.15),
    0 0 100px rgba(255, 255, 255, 0.05);
  animation: blobMorph 15s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 50px rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(20px);
}

.lp-light .lp-liquid-orb {
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0) 60%),
              linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(91, 76, 219, 0.15) 50%, rgba(232, 82, 14, 0.15) 100%),
              #eef0f5;
  box-shadow:
    inset 20px 20px 40px rgba(255, 255, 255, 0.8),
    inset -30px -30px 80px rgba(91, 76, 219, 0.2),
    inset 40px -40px 80px rgba(232, 82, 14, 0.15),
    inset -40px 40px 80px rgba(255, 215, 0, 0.1),
    0 20px 60px rgba(0,0,0,0.05);
}

@keyframes blobMorph {
  0% { border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%; transform: rotate(0deg) scale(1); }
  50% { border-radius: 60% 40% 55% 45% / 40% 60% 45% 55%; transform: rotate(10deg) scale(1.05); }
  100% { border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%; transform: rotate(-10deg) scale(0.95); }
}

.lp-hero-title {
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  color: var(--cn-text);
  line-height: 1.1;
  margin-bottom: 24px;
  opacity: 0;
  transform: translateY(calc(var(--scroll-y, 0px) * -0.1));
  animation: heroReveal 0.8s var(--cn-transition) 0.2s forwards;
}

.lp-hero-subtitle-new {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--cn-text-muted);
  margin-bottom: 40px;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(calc(var(--scroll-y, 0px) * -0.05));
  animation: heroReveal 0.8s var(--cn-transition) 0.35s forwards;
}

.lp-hero-actions-new {
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(calc(var(--scroll-y, 0px) * -0.025));
  animation: heroReveal 0.8s var(--cn-transition) 0.5s forwards;
  position: relative;
  z-index: 100;
}

.lp-cta-solid {
  background: var(--cn-text);
  color: var(--cn-bg);
  border-radius: 100px;
  padding: 16px 36px;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--cn-font);
}

.lp-cta-solid:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(255,255,255,0.15);
}

.lp-light .lp-cta-solid:hover {
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
}

@keyframes heroReveal {
  from { opacity: 0; top: 30px; position: relative; }
  to { opacity: 1; top: 0px; position: relative; }
}

/* Floating Glass Cards */
.lp-glass-card {
  position: absolute;
  background: rgba(20, 20, 28, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  color: var(--cn-text);
  z-index: 10;
  width: 260px;
  text-align: left;
  animation: floatCard 8s ease-in-out infinite;
}

.lp-light .lp-glass-card {
  background: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 20px 40px rgba(0,0,0,0.08);
}

.lp-card-left {
  left: -20px;
  bottom: calc(-60px + var(--scroll-y, 0px) * -0.15);
  opacity: 0;
  animation: heroRevealCard 1s var(--cn-transition) 0.6s forwards, floatCard 8s ease-in-out infinite 1s;
}

.lp-card-right {
  right: -20px;
  bottom: calc(0px + var(--scroll-y, 0px) * -0.25);
  opacity: 0;
  animation: heroRevealCard 1s var(--cn-transition) 0.8s forwards, floatCard 8s ease-in-out infinite 3s;
}

.lp-glass-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--cn-text-muted);
  margin-bottom: 12px;
}

.lp-card-icon-wrap {
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--cn-text);
}

.lp-light .lp-card-icon-wrap {
  background: rgba(0,0,0,0.05);
}

.lp-glass-card-body h4 {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
  margin: 0;
}

.lp-glass-card-body h2 {
  font-size: 36px;
  font-weight: 500;
  margin: 0 0 10px 0;
}

.lp-glass-card-stat {
  margin-top: 16px;
  font-size: 14px;
  color: var(--cn-text-muted);
}

.lp-progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.lp-light .lp-progress-bar {
  background: rgba(0,0,0,0.1);
}

.lp-progress-fill {
  height: 100%;
  background: var(--cn-text);
  width: 0%;
  animation: progressFill 1.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s forwards;
}

@keyframes progressFill {
  to { width: 98%; }
}

@keyframes heroRevealCard {
  from { opacity: 0; top: 40px; position: relative; }
  to { opacity: 1; top: 0px; position: relative; }
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

/* Hide floating cards on very small screens to avoid covering text */
@media (max-width: 900px) {
  .lp-card-left, .lp-card-right {
    display: none;
  }
}
\

const regex = /\\/\\* ===== HERO SECTION ===== \\*\\/[\\s\\S]*?(?=\\/\\* ===== SCROLL REVEAL ===== \\*\\/)/;
if (regex.test(content)) {
  content = content.replace(regex, newHeroCSS + '\\n\\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully replaced hero CSS.');
} else {
  console.log('Regex did not match.');
}
