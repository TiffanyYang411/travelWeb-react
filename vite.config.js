import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/travelWeb-react/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'dist/index.html',
          dest: '.',       // 複製到 dist 根目錄
          rename: '404.html', // 讓 GitHub Pages fallback 到 React App
        },
      ],
    }),
  ],
})

