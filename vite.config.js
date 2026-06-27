import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: '.',
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    target: ['es2022', 'chrome108', 'safari16'],
    cssCodeSplit: true,
    sourcemap: 'hidden',
    rollupOptions: {
      input: {
        main: 'pages/index.html',
        privacy: 'pages/privacy.html',
        terms: 'pages/terms.html',
        about: 'pages/about.html',
        offline: 'pages/offline.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('gsap')) return 'vendor-gsap';
          if (id.includes('molo')) return 'molo';
          if (id.includes('radar')) return 'radar';
          if (id.includes('instructions')) return 'instructions';
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/rss': {
        target: 'https://api.allorigins.win',
        changeOrigin: true,
        rewrite: (path) => {
          const url = path.replace('/api/rss?url=', '/raw?url=');
          return url;
        },
      },
    },
  },
  plugins: [
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: false,
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
});
