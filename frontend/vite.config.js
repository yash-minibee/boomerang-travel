import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    proxy: {
      // /boomerangglobaltravels-backend/api/* → PHP built-in server running from project root
      '/boomerangglobaltravels-backend/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
