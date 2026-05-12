import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';

function moveToRootPlugin() {
  return {
    name: 'move-popup-to-root',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      const srcPopup = join(dist, 'src', 'popup');

      // Move index.html to dist root
      const indexSrc = join(srcPopup, 'index.html');
      const indexDst = join(dist, 'popup', 'index.html');

      // Ensure popup dir exists
      mkdirSync(join(dist, 'popup'), { recursive: true });

      // Write index.html to dist/popup/
      const html = require('fs').readFileSync(indexSrc, 'utf8');
      const fixed = html.replace(/src="[^"]*popup\.js"/, 'src="popup.js"');
      require('fs').writeFileSync(indexDst, fixed);

      // Remove src folder
      rmSync(join(dist, 'src'), { recursive: true, force: true });

      // Clean up duplicate popup.js if any
      const duplicatePopup = join(dist, 'popup', 'popup.js');
      const mainPopup = join(dist, 'popup', 'popup.js');
      // Already in correct location
      console.log('✓ Extension files restructured');
    },
  };
}

export default defineConfig({
  plugins: [react(), moveToRootPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background/index.js';
          return 'popup/popup.js';
        },
        chunkFileNames: 'popup/[name].js',
        assetFileNames: (info) => {
          if (/^icon/.test(info.name || '')) return '[name].[ext]';
          return 'popup/[name].[ext]';
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
});