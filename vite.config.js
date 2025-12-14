import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // ensure relative paths so the site works from GitHub Pages
  base: './',

  plugins: [react()],
  define: {
    // Expose process.env.API_KEY to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'docs',
    // 1. Disable CSS splitting to get a single style.css
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 2. Disable JS splitting to get a single main.js
        manualChunks: undefined,
        entryFileNames: 'assets/main.js',
        chunkFileNames: 'assets/main.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
});
