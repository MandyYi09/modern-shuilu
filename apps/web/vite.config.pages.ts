import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { pagesEntry } from '../../scripts/pages-entry.mjs'

export default defineConfig({
  base: '/modern-shuilu/',
  plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react(), pagesEntry()],
  resolve: { tsconfigPaths: true },
  build: { outDir: '../../pages-dist', emptyOutDir: true },
})
