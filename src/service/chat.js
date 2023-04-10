import axios from '@/libs/api-request.js';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getToken } from '@/utils/auth';

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
  });
};

/**
 * 流聊天
 * @param {*} data
 * @returns
 */
export const streamChat = (
  data,
  { onopen = () => {}, onmessage = () => {}, onerror = () => {}, onclose =() => {} }
) => {
  let controller = new AbortController();
  let signal = controller.signal;

  fetchEventSource('/sse/session/chat', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      hi_smart_token_key: getToken()
    },
    signal,
    onopen,
    onerror,
    onclose,
    onmessage
  });
  return controller;
};

/**
 * 聊天记录
 * @param {*} data
 * @returns
 */
 export const chatHistory = (data) => {
  return axios.request({
    url: '/session/history',
    method: 'post',
    data
  });
};
