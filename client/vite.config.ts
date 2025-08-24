import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true, // Makes Vitest globals available without explicit imports
    environment: 'jsdom', // Specifies the test environment
    setupFiles: ['./src/setupTests.ts'], // Optional: for global test setup like Jest DOM matchers
  },
})
