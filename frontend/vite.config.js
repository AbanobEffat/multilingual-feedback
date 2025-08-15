import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // Allow access from outside the container
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true // Required for Docker in some cases
    }
  }
})
