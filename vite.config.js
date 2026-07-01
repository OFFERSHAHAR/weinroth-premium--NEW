import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  ssgOptions: {
    dirStyle: 'nested',   // /about/index.html — served as a directory index by static hosts
    formatting: 'minify',
  },
})
