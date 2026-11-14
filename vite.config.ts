import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@discord') || id.includes('canvas-confetti')) return 'vendor-extras';
            return 'vendor-react';
          }
          if (id.includes('/src/components/slots/SymbolRenderer')) {
            return 'symbols-svg';
          }
          if (id.includes('/src/games/')) {
            return 'games-data';
          }
        },
      },
    },
  },
})
