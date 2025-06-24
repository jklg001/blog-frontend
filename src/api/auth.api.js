import http from '@/utils/http'

export const authApi = {
    /**
     * 用户登录
     * @param {Object} loginData - 登录数据
     * @param {string} loginData.email - 用户邮箱
     * @param {string} loginData.password - 用户密码
     * @returns {Promise<Object>} 登录结果，包含token和用户信息
     */
    login: (loginData) => {
        return http.post('/api/auth/login', loginData);
    },
    
    /**
     * 用户注册
     * @param {Object} registerData - 注册数据
     * @param {string} registerData.username - 用户名
     * @param {string} registerData.email - 邮箱
     * @param {string} registerData.password - 密码
     * @param {string} registerData.nickname - 昵称
     * @returns {Promise<Object>} 注册结果
     */
    register: (registerData) => {
        return http.post('/api/users/register', registerData);
    },
    
    /**
     * 用户登出
     * @returns {Promise<Object>} 登出结果
     */
    logout: () => {
        return http.post('/api/auth/logout');
    },
    
    /**
     * 获取当前登录用户信息
     * @returns {Promise<Object>} 用户信息
     */
    getCurrentUser: () => {
        return http.get('/api/auth/me');
    },
    
    /**
     * 获取指定用户信息
     * @param {number|string} userId - 用户ID
     * @returns {Promise<Object>} 用户信息
     */
    getUserById: (userId) => {
        return http.get(`/api/users/${userId}`);
    },
    
    /**
     * 刷新访问令牌
     * @returns {Promise<Object>} 新的访问令牌
     */
    refreshToken: () => {
        return http.post('/api/auth/refresh');
    },
    
    /**
     * 获取用户个人资料
     * @returns {Promise<Object>} 用户个人资料
     */
    getUserProfile: () => {
        return http.get('/api/users/profile');
    },
    
    /**
     * 更新用户个人资料
     * @param {Object} profileData - 个人资料数据
     * @returns {Promise<Object>} 更新后的个人资料
     */
    updateUserProfile: (profileData) => {
        return http.put('/api/users/profile', profileData);
    }
} 