const fs = require('fs');

const path = 'src/modules/common/landing.css';
let content = fs.readFileSync(path, 'utf8');

const new_root = \:root {
  --cn-bg: #060508;
  --cn-bg-card: #0a090e;
  --cn-bg-card-hover: #0f0e15;
  --cn-surface: #0a090e;
  --cn-border: rgba(203, 150, 77, 0.15);
  --cn-border-hover: rgba(203, 150, 77, 0.3);
  --cn-text: #f5f5f5;
  --cn-text-muted: #a0a0b0;
  --cn-text-dim: #606070;
  --cn-primary: #CB964D;
  --cn-primary-glow: rgba(203, 150, 77, 0.3);
  --cn-accent: #f2c94c;
  --cn-accent-glow: rgba(242, 201, 76, 0.3);
  --cn-gradient-1: linear-gradient(135deg, #CB964D 0%, #e0a96d 50%, #f2c94c 100%);
  --cn-gradient-2: linear-gradient(135deg, #a67b3b 0%, #CB964D 100%);
  --cn-gradient-hero: linear-gradient(135deg, #CB964D 0%, #f2c94c 50%, #f9e596 100%);
  --cn-glass: rgba(6, 5, 8, 0.6);
  --cn-glass-border: rgba(203, 150, 77, 0.2);
  --cn-grid-color: rgba(203, 150, 77, 0.05);
  --cn-shadow-card: rgba(0, 0, 0, 0.5);
  --cn-shadow-heavy: rgba(0, 0, 0, 0.8);
  --cn-radius: 14px;
  --cn-radius-lg: 20px;
  --cn-radius-xl: 28px;
  --cn-font: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --cn-transition: cubic-bezier(0.16, 1, 0.3, 1);
}\;

const new_light = \.lp-light {
  --cn-bg: #fcfbfa;
  --cn-bg-card: #ffffff;
  --cn-bg-card-hover: #f7f5f0;
  --cn-surface: #f3efe8;
  --cn-border: rgba(203, 150, 77, 0.2);
  --cn-border-hover: rgba(203, 150, 77, 0.4);
  --cn-text: #1a1a1c;
  --cn-text-muted: #6b6a67;
  --cn-text-dim: #8c8b88;
  --cn-primary: #CB964D;
  --cn-primary-glow: rgba(203, 150, 77, 0.2);
  --cn-accent: #a67b3b;
  --cn-accent-glow: rgba(166, 123, 59, 0.2);
  --cn-glass: rgba(255, 255, 255, 0.75);
  --cn-glass-border: rgba(203, 150, 77, 0.3);
  --cn-grid-color: rgba(203, 150, 77, 0.08);
}\;

content = content.replace(/:root\\s*\\{[^}]+\\}/, new_root);
content = content.replace(/\\.lp-light\\s*\\{[^}]+\\}/, new_light);

content = content.replace(/backdrop-filter:\\s*blur\\(16px\\)/g, 'backdrop-filter: blur(24px)');
content = content.replace(/-webkit-backdrop-filter:\\s*blur\\(16px\\)/g, '-webkit-backdrop-filter: blur(24px)');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated theme variables');
