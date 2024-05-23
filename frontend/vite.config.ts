import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    TanStackRouterVite(),
  ],
  server: {
    host: true,
    hmr: true
  },
})
