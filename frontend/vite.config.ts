import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 100, // Polling interval in ms (decrease for faster response)
    },
    host: true, // Listen on all addresses
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173, // Force the HMR websocket to use this port
      overlay: true,     // Show error overlay
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  // Optimize build
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
  // Optional: configure css
  css: {
    devSourcemap: true,
  }
})
