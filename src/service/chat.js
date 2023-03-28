import axios from '@/libs/api-request.js'
/**
 * 模拟登录
 */
export const mockLogin = () => {
  return axios.request({
    url: '/user/login',
    method: 'get'
  })
}

/**
 * 聊天
 * @param {*} data
 * @returns
 */
export const chat = (data) => {
  return axios.request({
    url: '/chat',
    method: 'post',
    data
  })
}
