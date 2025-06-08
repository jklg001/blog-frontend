import http from '@/utils/http'

export const articleApi = {
    getList: (params) => {
        return http.get('/api/articles', params); // 保持/api前缀
    },
}