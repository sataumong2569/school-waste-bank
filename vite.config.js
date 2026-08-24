import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'assets/*'],
      manifest: {
        name: 'ธนาคารขยะ โรงเรียนเทศบาลตำบลอุโมงค์ 1',
        short_name: 'ธนาคารขยะโรงเรียน',
        description: 'ระบบบันทึกและจัดการธนาคารขยะรีไซเคิล โรงเรียนเทศบาลตำบลอุโมงค์ 1',
        theme_color: '#7c3aed',
        background_color: '#fff7ed',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/umong1weblogo_180.png',
            sizes: '180x180',
            type: 'image/png'
          },
          {
            src: '/school1weblogo_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/school1weblogo_192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg}']
      }
    })
  ]
});