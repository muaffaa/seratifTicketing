import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth':            'http://localhost:8000',
      '/admin/login':     'http://localhost:8000',
      '/admin/payments':  'http://localhost:8000',
      '/admin/approve':   'http://localhost:8000',
      '/admin/logout':    'http://localhost:8000',
      '/upload-payment':  'http://localhost:8000',
      '/user':            'http://localhost:8000',
      '/ticket':          'http://localhost:8000',
      '/validate':        'http://localhost:8000',
      '/uploads':         'http://localhost:8000', // serve uploaded images via backend in dev
    }
  }
})