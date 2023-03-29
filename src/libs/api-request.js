import axios from 'axios'
import { message as antMessage } from 'ant-design-vue'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {}
    }
    return config
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        this.queue[url] = true

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        const { result, code, msg } = res.data
        //请求头content-type为application/octet-stream下载流形式
        if (
          res.headers['content-type'] == 'application/octet-stream;charset=UTF-8' ||
          res.headers['content-type'] == 'application/zip;charset=UTF-8'
        ) {
          return res
        }
        switch (code) {
          case 0:
            return { result, code }
          default:
            antMessage.destroy()
            antMessage.warning(msg)
            return { result, code }
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}

let baseURLMap = {
  // 开发
  development: '/api',
  // 正式版
  production: '/api'
}

let baseURL = baseURLMap[process.env.NODE_ENV]
const _axios = new HttpRequest(baseURL)
export default _axios
