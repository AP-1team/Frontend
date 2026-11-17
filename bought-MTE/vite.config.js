import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxy = {}

  if (env.VITE_API_PROXY_TARGET) {
    proxy['/api'] = { target: env.VITE_API_PROXY_TARGET, changeOrigin: true }
  }
  if (env.VITE_WS_PROXY_TARGET) {
    proxy['/ws'] = { target: env.VITE_WS_PROXY_TARGET, changeOrigin: true, ws: true }
  }
  if (env.VITE_UPLOADS_PROXY_TARGET || env.VITE_API_PROXY_TARGET) {
    proxy['/uploads'] = { target: env.VITE_UPLOADS_PROXY_TARGET || env.VITE_API_PROXY_TARGET, changeOrigin: true }
  }

  return {
    plugins: [react()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    server: { proxy },
  }
})