const { copyFileSync, mkdirSync, rmSync, readFileSync, writeFileSync } = require('fs');
const { join, dirname } = require('path');
const __dirname = '.';

const dist = join(__dirname, 'dist');
const srcDir = join(dist, 'src');

// Move index.html to dist/popup/
mkdirSync(join(dist, 'popup'), { recursive: true });
const indexHtml = readFileSync(join(srcDir, 'popup', 'index.html'), 'utf8');
const fixed = indexHtml.replace(/src="[^"]*popup\.js"/, 'src="popup.js"');
writeFileSync(join(dist, 'popup', 'index.html'), fixed);

// Remove src directory
rmSync(join(dist, 'src'), { recursive: true, force: true });

console.log('✓ Extension restructured');
console.log('Files:', require('fs').readdirSync(dist).join(', '));
if (require('fs').existsSync(join(dist, 'popup'))) {
  console.log('popup/', require('fs').readdirSync(join(dist, 'popup')).join(', '));
}
