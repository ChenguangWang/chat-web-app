import axios from 'axios';
import { getToken } from '@/utils/auth';
import { message as antMessage } from 'ant-design-vue';
import router from '@/router';

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    };
    return config;
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        config.headers['hi_smart_token_key'] = getToken();
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        const { data, code, msg } = res.data;
        //请求头content-type为application/octet-stream下载流形式
        if (
          res.headers['content-type'] == 'text/event-stream' ||
          res.headers['content-type'] == 'application/zip;charset=UTF-8'
        ) {
          return res;
        }
        switch (code) {
          case 200:
            return { data, code, msg };
          case 40000:
            antMessage.warning('登录超时');
            router.push({ name: 'login' });
          default:
            antMessage.destroy();
            antMessage.warning(msg);
            return { data, code, msg };
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

let baseURLMap = {
  // 开发
  development: '/api',
  // 正式版
  production: '/api'
};

let baseURL = baseURLMap[process.env.NODE_ENV];
const _axios = new HttpRequest(baseURL);
export default _axios;
