const fs = require('fs');

const path = 'src/modules/common/landing.css';
let content = fs.readFileSync(path, 'utf8');

// Strip out css animations for the text blocks we are porting to framer-motion
content = content.replace(/opacity:\s*0;\s*animation:\s*heroReveal[^\n]+/g, '');
content = content.replace(/opacity:\s*0;\s*animation:\s*heroRevealCard[^\n]+/g, '');
content = content.replace(/@keyframes\s+heroReveal\s*\{[^}]+\}/g, '');
content = content.replace(/@keyframes\s+heroRevealCard\s*\{[^}]+\}/g, '');

// Give the orb container a z-index under everything
content = content.replace(/\.lp-hero-orb-container\s*\{[^}]+\}/, match => {
  return match.replace(/z-index:\s*0;/, 'z-index: 0; pointer-events: none;');
});

// Update .lp-brand-logo to have a gold highlight
content = content.replace(/\.lp-brand-logo\s*\{[^}]+\}/, match => {
  return match + '\n  color: var(--cn-primary);';
});

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned up CSS for Framer Motion');
