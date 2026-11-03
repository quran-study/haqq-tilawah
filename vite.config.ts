import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Served from https://<user>.github.io/haqq-tilawah/ on GitHub Pages
const base = '/haqq-tilawah/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: { config: true },
      manifest: {
        name: 'Haqq Tilawah',
        short_name: 'Haqq Tilawah',
        description: 'An open-source, offline-first Quran study app.',
        lang: 'en-GB',
        theme_color: '#14532d',
        background_color: '#faf8f3',
        display: 'standalone',
        start_url: base,
        scope: base,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json,txt}'],
        // Word data (7 MB) is cached as each surah is opened, or all at once on request
        globIgnores: ['**/data/words/**'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.includes('/data/words/'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'word-data' },
          },
        ],
      },
    }),
  ],
})
