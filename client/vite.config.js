import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

    server: {
      port: 3000,
      proxy: {
        // Proxy all requests starting with /api to backend at port 4000
        '/api': 'http://localhost:4000',
      },
  },
})
