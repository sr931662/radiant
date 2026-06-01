import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    middlewareMode: true,
  },

  build: {
    // Optimize build output
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Better chunk naming
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },

  // Preview server for testing production build locally
  preview: {
    middlewareMode: false,
    port: 5173,
  }
})
