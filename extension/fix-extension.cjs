const { rmSync, readFileSync, writeFileSync, mkdirSync } = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
const srcDir = path.join(dist, 'src');

mkdirSync(path.join(dist, 'popup'), { recursive: true });
const indexHtml = readFileSync(path.join(srcDir, 'popup', 'index.html'), 'utf8');
const fixed = indexHtml.replace(/src="[^"]*popup\.js"/, 'src="popup.js"');
writeFileSync(path.join(dist, 'popup', 'index.html'), fixed);

rmSync(path.join(dist, 'src'), { recursive: true, force: true });

console.log('✓ Extension restructured');
console.log('dist:', require('fs').readdirSync(dist).join(', '));
console.log('popup:', require('fs').readdirSync(path.join(dist, 'popup')).join(', '));
