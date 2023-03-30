import axios from '@/libs/api-request.js'

/**
 * 登录
 * @param {*} data
 * @returns
 */
export const login = (data) => {
  return axios.request({
    url: '/user/sign-in',
    method: 'post',
    data
  })
}

/**
 * 获取验证码
 * @returns
 */
export const getVerificationCode = () => {
  return axios.request({
    url: '/security/verification-code',
    method: 'get'
  })
}
