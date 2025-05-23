// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { viteStaticCopy } from 'vite-plugin-static-copy'

// export default defineConfig({
//   base: '/travelWeb-react/',
//   plugins: [
//     react(),
//     viteStaticCopy({
//       targets: [
//         {
//           src: 'dist/index.html',
//           dest: '.',
//           rename: '404.html',
//         },
//       ],
//     }),
//   ],
//   build: {
//     rollupOptions: {
//       input: {
//         main: 'index.html',
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/travelWeb-react/',
  plugins: [react()],
})

