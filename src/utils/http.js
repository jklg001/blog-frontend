// src/utils/http.js
/* eslint-disable no-undef, no-console */
import axios from 'axios';
import { getToken } from './auth';

// 1. 创建 Axios 实例
const http = axios.create({
  baseURL: '', // 清空baseURL确保走代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 2. 请求拦截器 (添加请求前处理逻辑)
http.interceptors.request.use(
    (config) => {
        // 添加鉴权 token
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // TODO: 可以在这里添加全局 loading 状态控制

        return config;
    },
    (error) => {
        // TODO: 请求错误统一处理（如网络错误）
        return Promise.reject(error);
    }
);

// 3. 响应拦截器 (添加响应处理逻辑)
http.interceptors.response.use(
    (response) => {
        // 统一处理响应数据结构
        const { code, data, msg, timestamp, requestId } = response.data;
        
        // 如果请求成功
        if (code === 200) {
            // 返回实际业务数据
            return Promise.resolve(data);
        } else {
            // 业务错误，抛出错误
            const error = new Error(msg || '请求失败');
            error.code = code;
            error.timestamp = timestamp;
            error.requestId = requestId;
            return Promise.reject(error);
        }
    },
    (error) => {
        // 网络错误或HTTP状态码错误处理
        if (error.response) {
            // 服务器返回了错误状态码
            const { status, data } = error.response;
            const { code, msg } = data || {};
            
            // 处理常见的HTTP状态码
            switch (status) {
                case 401:
                    // 未授权，清除token并跳转到登录页
                    // eslint-disable-next-line no-undef
                    localStorage.removeItem('token');
                    // eslint-disable-next-line no-undef
                    localStorage.removeItem('user');
                    // eslint-disable-next-line no-undef
                    window.location.href = '/login';
                    break;
                case 403:
                    // eslint-disable-next-line no-console
                    console.error('没有权限访问该资源');
                    break;
                case 404:
                    // eslint-disable-next-line no-console
                    console.error('请求的资源不存在');
                    break;
                case 500:
                    // eslint-disable-next-line no-console
                    console.error('服务器内部错误');
                    break;
                default:
                    // eslint-disable-next-line no-console
                    console.error('请求失败：', msg || `HTTP ${status}`);
            }
            
            const customError = new Error(msg || `请求失败 (${status})`);
            customError.code = code;
            customError.status = status;
            return Promise.reject(customError);
        } else if (error.request) {
            // 网络错误
            const networkError = new Error('网络连接失败，请检查您的网络设置');
            return Promise.reject(networkError);
        } else {
            // 其他错误
            return Promise.reject(error);
        }
    }
);

export default {
    get: (url, params = {}, config = {}) => http.get(url, { params, ...config }),
    post: (url, data = {}, config = {}) => http.post(url, data, config),
    put: (url, data = {}, config = {}) => http.put(url, data, config),
    patch: (url, data = {}, config = {}) => http.patch(url, data, config),
    delete: (url, config = {}) => http.delete(url, config),
    // TODO: 添加取消请求方法
    // createCancelToken: () => axios.CancelToken.source()
};