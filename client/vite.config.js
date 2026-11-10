import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fills __SITE_URL__ in index.html (used for Open Graph tags) from VITE_SITE_URL.
const siteUrlPlugin = (siteUrl) => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '');

  return {
    plugins: [react(), siteUrlPlugin(siteUrl)],
    server: {
      port: 5173,
      // In development, /api calls go to the local Express server.
      proxy: {
        '/api': { target: env.VITE_DEV_API_TARGET || 'http://localhost:5000', changeOrigin: true },
      },
    },
    build: {
      target: 'es2020',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          },
        },
      },
    },
  };
});
