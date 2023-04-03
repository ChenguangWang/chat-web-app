import axios from '@/libs/api-request.js'

/**
 * 聊天
 * @param {*} data
 * @returns
 */
export const chat = (data) => {
  return axios.request({
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/chat',
    method: 'post',
    data
  })
}
/**
 * 流聊天
 * @param {*} data
 * @returns
 */
export const streamChat = (data) => {
  return axios.request({
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/stream/chat',
    method: 'post',
    data,
    responseType: 'stream'
    // responseType: 'text/event-stream'
  })
}
