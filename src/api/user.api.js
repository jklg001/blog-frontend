import http from '@/utils/http'

export const userApi = {
    login: (credentials) => {
        return http.post('/auth/login', credentials);
    },
    // 其他用户相关接口
}