import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portofolio/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // The trailing slash keeps /portofolio/api-config.json out of the proxy.
      '^/portofolio/api/': 'http://localhost:3001'
    }
  }
})
