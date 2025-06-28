import http from '@/utils/http'

export const userApi = {
    /**
     * 用户登录
     * @param {Object} credentials - 登录凭据
     * @param {string} credentials.email - 邮箱
     * @param {string} credentials.password - 密码
     * @returns {Promise<Object>} 登录结果
     */
    login: (credentials) => {
        return http.post('/api/auth/login', credentials);
    },
    
    /**
     * 用户注册
     * @param {Object} userData - 用户数据
     * @param {string} userData.name - 姓名
     * @param {string} userData.email - 邮箱
     * @param {string} userData.password - 密码
     * @param {string} userData.username - 用户名
     * @returns {Promise<Object>} 注册结果
     */
    register: (userData) => {
        return http.post('/api/users/register', userData);
    },
    
    /**
     * 获取用户信息
     * @returns {Promise<Object>} 用户信息
     */
    getUserInfo: () => {
        return http.get('/api/auth/user');
    },
    
    /**
     * 刷新 token
     * @returns {Promise<Object>} 新的 token
     */
    refreshToken: () => {
        return http.post('/api/auth/refresh');
    },
    
    /**
     * 用户退出登录
     * @returns {Promise<Object>} 退出结果
     */
    logout: () => {
        return http.post('/api/auth/logout');
    }
}