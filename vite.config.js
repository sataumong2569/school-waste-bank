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
            src: '/school1weblogo_180.png',
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
  ],
  // เพิ่มการตั้งค่า Build เพื่อทำการหั่นไฟล์ (Manual Chunks)
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. แยก Firebase 
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'firebase-vendor';
          }
          // 2. แยกสาย React ทั้งหมด
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor';
          }
          // 3. แยกชุดไอคอน 
          if (id.includes('node_modules/@heroicons')) {
            return 'heroicons-vendor';
          }
        }
      }
    }
  }
});