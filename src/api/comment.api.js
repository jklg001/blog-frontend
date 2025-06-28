import http from '@/utils/http'

export const commentApi = {
    /**
     * 获取文章评论列表
     * @param {number} articleId - 文章ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @param {string} [params.sortBy] - 排序字段
     * @param {string} [params.sortOrder] - 排序方向
     * @returns {Promise<Object>} 评论列表及分页信息
     */
    getArticleComments: (articleId, params) => {
        return http.get(`/comments/article/${articleId}`, params);
    },
    
    /**
     * 创建评论
     * @param {Object} commentData - 评论数据
     * @param {string} commentData.content - 评论内容
     * @param {number} commentData.articleId - 文章ID
     * @param {number} [commentData.parentId] - 父评论ID（回复评论时需要）
     * @returns {Promise<Object>} 创建的评论
     */
    createComment: (commentData) => {
        return http.post('/comments', commentData);
    },
    
    /**
     * 获取评论回复列表
     * @param {number} commentId - 评论ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 回复列表及分页信息
     */
    getCommentReplies: (commentId, params) => {
        return http.get(`/comments/${commentId}/replies`, params);
    },
    
    /**
     * 获取评论详情
     * @param {number} commentId - 评论ID
     * @returns {Promise<Object>} 评论详情
     */
    getCommentDetail: (commentId) => {
        return http.get(`/comments/${commentId}`);
    },
    
    /**
     * 更新评论
     * @param {number} commentId - 评论ID
     * @param {Object} commentData - 评论更新数据
     * @param {string} commentData.content - 评论内容
     * @returns {Promise<Object>} 更新后的评论
     */
    updateComment: (commentId, commentData) => {
        return http.put(`/comments/${commentId}`, commentData);
    },
    
    /**
     * 删除评论
     * @param {number} commentId - 评论ID
     * @returns {Promise<Object>} 删除结果
     */
    deleteComment: (commentId) => {
        return http.delete(`/comments/${commentId}`);
    },
    
    /**
     * 点赞评论
     * @param {number} commentId - 评论ID
     * @returns {Promise<Object>} 点赞结果
     */
    likeComment: (commentId) => {
        return http.post(`/comments/${commentId}/like`);
    },
    
    /**
     * 取消点赞评论
     * @param {number} commentId - 评论ID
     * @returns {Promise<Object>} 取消点赞结果
     */
    unlikeComment: (commentId) => {
        return http.delete(`/comments/${commentId}/like`);
    },
    
    /**
     * 获取用户评论列表
     * @param {number} userId - 用户ID
     * @param {Object} params - 查询参数
     * @param {number} [params.page] - 页码
     * @param {number} [params.limit] - 每页数量
     * @returns {Promise<Object>} 评论列表及分页信息
     */
    getUserComments: (userId, params) => {
        return http.get(`/comments/user/${userId}`, params);
    }
} 