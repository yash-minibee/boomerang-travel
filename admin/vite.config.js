import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/admin/",
  server: {
    proxy: {
      // /backend/api/* → PHP built-in server running from project root
      '/backend/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
