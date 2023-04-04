import axios from '@/libs/api-request.js';

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
  });
};

/**
 * 获取验证码
 * @returns
 */
export const getVerificationCode = (params) => {
  return axios.request({
    url: '/security/verification-code',
    method: 'get',
    params
  });
};

/**
 * 注册/登录
 * @param {*} data
 * @returns
 */
export const registerAndLogin = (data) => {
  return axios.request({
    url: '/user/mobile/sign-in',
    method: 'post',
    data
  });
};

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export const modifyPassword = (data) => {
  return axios.request({
    url: '/user/modify/password',
    method: 'put',
    data
  });
};

/**
 * 修改密码
 * @param {*} data
 * @returns
 */
export const modifyAccount = (data) => {
  return axios.request({
    url: '/user/modify/account',
    method: 'put',
    data
  });
};
