/**
 * 会话信息、会话列表、会话详情
 */
import axios from '@/libs/api-request.js';

export const getSessionList = (data = {}) => {
    const _data = {
        pageNum: 1,
        pageSize: 10,
        ...data
    }
  return axios.request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    // baseURL: 'https://api.chat-info.com.cn/api',
    url: '/session/list',
    method: 'GET',
    data: _data,
  });
};
