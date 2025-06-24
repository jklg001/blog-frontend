import http from '@/utils/http'

export const articleApi = {
    /**
     * 获取文章列表
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @param {string} [params.search] - 搜索关键词
     * @param {string} [params.status] - 文章状态
     * @param {number} [params.authorId] - 作者ID
     * @returns {Promise<Object>} 文章列表及分页信息
     */
    getList: (params) => {
        return http.get('/api/articles', params); // 保持/api前缀
    },
    
    /**
     * 获取文章详情
     * @param {number} id - 文章ID
     * @returns {Promise<Object>} 文章详情
     */
    getDetail: (id) => {
        return http.get(`/api/articles/${id}`);
    },
    
    /**
     * 创建文章
     * @param {Object} articleData - 文章数据
     * @param {string} articleData.title - 文章标题
     * @param {string} articleData.content - 文章内容
     * @param {string} [articleData.summary] - 文章摘要
     * @param {string} [articleData.coverImage] - 封面图片URL
     * @param {string} articleData.status - 文章状态(draft/published)
     * @returns {Promise<Object>} 创建的文章
     */
    createArticle: (articleData) => {
        return http.post('/api/articles', articleData);
    },
    
    /**
     * 更新文章
     * @param {number} id - 文章ID
     * @param {Object} articleData - 文章更新数据
     * @returns {Promise<Object>} 更新后的文章
     */
    updateArticle: (id, articleData) => {
        return http.patch(`/api/articles/${id}`, articleData);
    },
    
    /**
     * 删除文章
     * @param {number} id - 文章ID
     * @returns {Promise<void>}
     */
    deleteArticle: (id) => {
        return http.delete(`/api/articles/${id}`);
    },
    
    /**
     * 发布文章
     * @param {number} id - 文章ID
     * @returns {Promise<Object>} 发布后的文章
     * @description 将草稿状态的文章发布
     */
    publishArticle: (id) => {
        return http.patch(`/api/articles/${id}/publish`);
    },
    
    /**
     * 点赞/取消点赞文章
     * @param {number} id - 文章ID
     * @returns {Promise<Object>} 点赞状态和数量
     */
    toggleLike: (id) => {
        return http.post(`/api/articles/${id}/like`);
    },
    
    /**
     * 收藏/取消收藏文章
     * @param {number} id - 文章ID
     * @returns {Promise<Object>} 收藏状态
     */
    toggleSave: (id) => {
        return http.post(`/api/articles/${id}/save`);
    },
    
    /**
     * 获取指定用户的文章列表
     * @param {number} userId - 用户ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 文章列表及分页信息
     */
    getUserArticles: (userId, params) => {
        return http.get(`/api/articles/user/${userId}`, params);
    },
    
    /**
     * 获取当前用户的草稿列表
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 草稿列表及分页信息
     */
    getMyDrafts: (params) => {
        return http.get('/api/articles/my/drafts', params);
    },
    
    /**
     * 获取当前登录用户的所有文章列表
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码，默认1
     * @param {number} [params.limit] - 每页数量，默认10，最大100
     * @param {string} [params.status] - 文章状态筛选：draft(草稿) 或 published(已发布)
     * @param {string} [params.search] - 搜索关键词，模糊匹配标题
     * @returns {Promise<Object>} 文章列表及分页信息
     */
    getMyArticles: (params) => {
        return http.get('/api/articles/my/articles', params);
    }
}