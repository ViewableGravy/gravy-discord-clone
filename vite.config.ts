import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    TanStackRouterVite()
  ],
})
