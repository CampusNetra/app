const fs = require('fs');

const path = 'src/modules/common/landing.css';
let content = fs.readFileSync(path, 'utf8');

// Strip out css animations for the text blocks we are porting to framer-motion
content = content.replace(/opacity:\s*0;\s*\n\s*transform:[^\n]+\n\s*animation:\s*heroReveal[^\n]+/g, '');
content = content.replace(/opacity:\s*0;\s*\n\s*animation:\s*heroReveal[^\n]+/g, '');
content = content.replace(/opacity:\s*0;\s*\n\s*animation:\s*heroRevealCard[^\n]+/g, '');
content = content.replace(/@keyframes\s+heroReveal\s*\{[^}]+\}/g, '');
content = content.replace(/@keyframes\s+heroRevealCard\s*\{[^}]+\}/g, '');

fs.writeFileSync(path, content, 'utf8');
console.log('Cleaned up CSS for Framer Motion');
