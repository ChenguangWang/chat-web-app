/**
 * 会话信息、会话列表、会话详情
 */
import axios from '@/libs/api-request.js';

export const getSessionList = (data = {}) => {
    const _data = {
        pageNum: 1,
        pageSize: 20,
        ...data
    }
  
  let url = new URLSearchParams(_data)
  return axios.request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/session/list',
    method: 'GET',
    params: url,
    // data: _data,
  });
};


export const deleteSession = (id) => {
  return axios.request({
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/session/'+id,
    method: 'DELETE',
    data: null
  });
}

/**
 * 获取详情
 * @param {*} id 
 * @returns 
 */
export const getSessionDetail = (id) => {
    return axios.request({
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/session/'+id,
    method: 'GET',
    data: null
  });
}