import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // **CRITICAL FIX:** Corrected base path using the repository name 'updated'
  base: '/updated/', 
  
  plugins: [react()],
  define: {
    // Expose process.env.API_KEY to the client-side code
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    // This is correct for GitHub Pages legacy mode
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