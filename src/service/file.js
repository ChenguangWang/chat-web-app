import axios from '@/libs/api-request.js';

export const uploadFile = (data, onUploadProgress) => {
  return axios.request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/document/upload',
    method: 'post',
    data,
    onUploadProgress
  });
};


export const getFileDetail = (id) => {
    return axios.request({
        // baseURL: 'https://api.chat-info.com.cn/api',
        url: '/document/'+id,
        method: 'get',
      });
}


export const getFileSession = (id) => {
    return axios.request({
        // baseURL: 'https://api.chat-info.com.cn/api',
        url: '/document/session/'+id,
        method: 'get',
      });
}