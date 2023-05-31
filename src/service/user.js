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
 * 获取注册时验证码
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
 * 获取修改密码时验证码
 * @returns
 */
export const getVerificationCodeForPass = () => {
  return axios.request({
    url: '/security/modify-password-verification-code',
    method: 'get'
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
 * 修改帐号
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

/**
 * 获取用户信息
 * @param {*} data
 * @returns
 */
export const getUserInfo = (data) => {
  return axios.request({
    url: '/user/info',
    method: 'get'
  });
};

/**
 * 获取分享链接
 * @returns
 */
export const getShareUrl = () => {
  return axios.request({
    url: '/user/growth/code',
    method: 'get'
  });
};

/**
 * 获取用户流量详情
 * @returns
 */
export const getUserFlow = () => {
  return axios.request({
    baseURL: '/pay-service/api',
    url: '/user/flow',
    method: 'get'
  });
};

/**
 * 获取用户生效商品
 * @returns
 */
export const getUserProduct = () => {
  return axios.request({
    baseURL: '/pay-service/api',
    url: '/user/product',
    method: 'get'
  });
};
