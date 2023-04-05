import { fileURLToPath, URL } from 'node:url';
const path = require('path');

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: 'page',
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
    // host: '172.48.106.63',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://47.93.50.221:8080', // 代理的目标地址
        ws: false,
        changeOrigin: true
      }
    }
  }
});
