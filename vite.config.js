import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // 如果端口被占用，直接报错而不是尝试其他端口
    host: 'localhost', // 明确指定主机
    hmr: {
      protocol: 'ws', // 明确使用 WebSocket
      host: 'localhost',
      port: 5173,
      clientPort: 5173, // 客户端连接端口
      overlay: true, // 显示错误覆盖层
    },
    watch: {
      usePolling: true, // macOS 上启用轮询，更稳定
      interval: 100, // 轮询间隔（毫秒）
      ignored: ['**/node_modules/**', '**/dist/**'], // 忽略不需要监听的文件
    },
  },
})
