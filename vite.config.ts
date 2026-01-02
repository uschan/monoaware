import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: '深度拆解实验室',
        short_name: 'Deep Dissect',
        description: '基于 DeepSeek 能力的认知分析工具集',
        theme_color: '#020204',
        background_color: '#020204',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'https://pic.wildsalt.me/storage/img/logo/monoaware-png-1767328147686-3554.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://pic.wildsalt.me/storage/img/logo/monoaware-png-1767328147686-3554.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://pic.wildsalt.me/storage/img/logo/monoaware-png-1767328147686-3554.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
});