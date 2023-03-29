import axios from '@/libs/api-request.js'

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
