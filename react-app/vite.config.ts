import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { lovinspPlugin } from 'lovinsp'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost';

  // 如果是localhost本地开发，需要加端口号；如果是远程服务器（如140.143.194.215），直接使用
  const isLocalhost = proxyTarget.includes('localhost') || proxyTarget.includes('127.0.0.1');
  const insuranceApiTarget = isLocalhost ? `${proxyTarget}:8000` : proxyTarget;
  const kodeApiTarget = isLocalhost ? `${proxyTarget}:3001` : proxyTarget;

  return {
    plugins: [
      lovinspPlugin({ bundler: 'vite' }),
      react(),
    ],
    server: {
      proxy: {
        '/api/v1': {
          target: insuranceApiTarget,
          changeOrigin: true,
        },
        '/api/products': {
          target: insuranceApiTarget,
          changeOrigin: true,
        },
        '/api/product-types': {
          target: insuranceApiTarget,
          changeOrigin: true,
        },
        '/api/rates': {
          target: insuranceApiTarget,
          changeOrigin: true,
        },
        '/api/tools': {
          target: insuranceApiTarget,
          changeOrigin: true,
        },
        '/api': {
          target: kodeApiTarget,
          changeOrigin: true,
        }
      }
    }
  }
})
