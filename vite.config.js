import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    dirStyle: 'nested',
    formatting: 'minify',
  },
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
})
