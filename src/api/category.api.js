import http from '@/utils/http'

export const categoryApi = {
    /**
     * 获取所有分类
     * @returns {Promise<Array>} 分类列表
     */
    getAllCategories: () => {
        return http.get('/api/categories');
    },
    
    /**
     * 获取分类详情
     * @param {number} id - 分类ID
     * @returns {Promise<Object>} 分类详情
     */
    getCategoryById: (id) => {
        return http.get(`/api/categories/${id}`);
    },
    
    /**
     * 创建分类
     * @param {Object} categoryData - 分类数据
     * @param {string} categoryData.name - 分类名称
     * @param {string} [categoryData.description] - 分类描述
     * @returns {Promise<Object>} 创建的分类
     */
    createCategory: (categoryData) => {
        return http.post('/api/categories', categoryData);
    },
    
    /**
     * 更新分类
     * @param {number} id - 分类ID
     * @param {Object} categoryData - 分类更新数据
     * @returns {Promise<Object>} 更新后的分类
     */
    updateCategory: (id, categoryData) => {
        return http.put(`/api/categories/${id}`, categoryData);
    },
    
    /**
     * 删除分类
     * @param {number} id - 分类ID
     * @returns {Promise<void>}
     */
    deleteCategory: (id) => {
        return http.delete(`/api/categories/${id}`);
    },
    
    /**
     * 获取分类下的文章
     * @param {number} id - 分类ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 文章列表及分页信息
     */
    getCategoryArticles: (id, params) => {
        return http.get(`/api/categories/${id}/articles`, params);
    }
} 