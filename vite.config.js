import { fileURLToPath, URL } from 'node:url';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  base: 'page',
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
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
    // host: '172.48.109.64',
    port: 5173,
    proxy: {
      '/sse': {
        target: 'http://47.88.11.59:8080', // 代理的目标地址
        // target: 'http://localhost:8080',
        ws: false,
        changeOrigin: true,
        compress: false
      },
      '/api': {
        // target: 'https://hi-chat.com.cn', // 代理的目标地址
        target: 'http://47.88.11.59:8080', // 代理的目标地址
        // target: 'http://localhost:8080',
        ws: false,
        changeOrigin: true
      },
      '/pay-service/api': {
        target: 'https://hi-smart.chat', // 代理的目标地址
        ws: false,
        changeOrigin: true
      }
    }
  }
});
