// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.191.156:8000', // IP de tu backend
        changeOrigin: true,
        secure: false       // si fuese https auto-firmado
      }
    }
  }
});