// src/utils/http.js
import axios from 'axios';

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
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

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
        // TODO: 可以在这里处理全局 loading 状态隐藏

        // 示例：统一处理响应数据结构
        // if (response.data && response.data.code === 200) {
        //   return response.data.data; // 返回实际业务数据
        // }

        return response.data;
    },
    (error) => {
        // TODO: 统一错误处理（根据状态码处理）
        // 如 401 跳转登录页，403 提示权限不足

        // 统一错误消息提示
        // const errorMessage = getErrorMessage(error);
        // showToast(errorMessage);

        return Promise.reject(error);
    }
);

export default {
    get: (url, params = {}, config = {}) => http.get(url, { params, ...config }),
    post: (url, data = {}, config = {}) => http.post(url, data, config),
    put: (url, data = {}, config = {}) => http.put(url, data, config),
    delete: (url, config = {}) => http.delete(url, config),
    // TODO: 添加取消请求方法
    // createCancelToken: () => axios.CancelToken.source()
};