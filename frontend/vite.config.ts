import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  // Define multiple entry points
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'src/dashboard.tsx'),
      },
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      }
    }
  },
  // Optional: configure css
  css: {
    devSourcemap: true,
  }
})
