import http from '@/utils/http'

export const tagApi = {
    /**
     * 获取所有标签
     * @returns {Promise<Array>} 标签列表
     */
    getAllTags: () => {
        return http.get('/api/tags');
    },
    
    /**
     * 获取标签详情
     * @param {number} id - 标签ID
     * @returns {Promise<Object>} 标签详情
     */
    getTagById: (id) => {
        return http.get(`/api/tags/${id}`);
    },
    
    /**
     * 创建标签
     * @param {Object} tagData - 标签数据
     * @param {string} tagData.name - 标签名称
     * @returns {Promise<Object>} 创建的标签
     */
    createTag: (tagData) => {
        return http.post('/api/tags', tagData);
    },
    
    /**
     * 更新标签
     * @param {number} id - 标签ID
     * @param {Object} tagData - 标签更新数据
     * @returns {Promise<Object>} 更新后的标签
     */
    updateTag: (id, tagData) => {
        return http.put(`/api/tags/${id}`, tagData);
    },
    
    /**
     * 删除标签
     * @param {number} id - 标签ID
     * @returns {Promise<void>}
     */
    deleteTag: (id) => {
        return http.delete(`/api/tags/${id}`);
    },
    
    /**
     * 获取标签下的文章
     * @param {number} id - 标签ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 文章列表及分页信息
     */
    getTagArticles: (id, params) => {
        return http.get(`/api/tags/${id}/articles`, params);
    }
} 