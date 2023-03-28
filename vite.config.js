import { fileURLToPath, URL } from 'node:url'
const path = require('path')

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${path.resolve('src/assets/css/common.less')}";`
        },
        javascriptEnabled: true
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/test/api': {
        target: 'https://hi-chat.info', // 代理的目标地址
        ws: false,
        changeOrigin: true
      }
    }
  }
})
