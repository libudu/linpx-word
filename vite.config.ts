import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
// @ts-ignore
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      '/proxy': 'https://linpxapi.linpicio.com'
    }
  },
  resolve: {
    alias: {
      // @ts-ignore
      '@': path.join(__dirname, "src"),
    }
  },
})
