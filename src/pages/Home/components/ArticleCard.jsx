import React, { useState } from 'react'
import { Link } from 'react-router'
import { articleApi } from '@/api'

function ArticleCard({ article }) {
  // 适配后端返回的文章对象结构
  const { 
    id, 
    title, 
    content, 
    summary, 
    createdAt, 
    coverImage, 
    viewCount = 0, 
    likeCount: initialLikeCount = 0, 
    commentCount = 0,
    author = {},
    liked: initialLiked = false,
    saved: initialSaved = false
  } = article
  
  // 使用状态管理点赞和收藏
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  
  // 使用摘要或从内容中提取摘要
  const displaySummary = summary || (content ? content.substring(0, 150) + '...' : '暂无内容');
  
  // 格式化日期
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('zh-CN') : '';
  
  // 处理点赞
  const handleLike = async (e) => {
    e.preventDefault(); // 阻止链接跳转
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await articleApi.toggleLike(id);
      setIsLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch {
      // 点赞失败
    } finally {
      setIsLoading(false);
    }
  };
  
  // 处理收藏
  const handleSave = async (e) => {
    e.preventDefault(); // 阻止链接跳转
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await articleApi.toggleSave(id);
      setIsSaved(response.saved);
    } catch {
      // 收藏失败
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="flex flex-col md:flex-row">
        {/* 文章封面图 */}
        {coverImage && (
          <Link to={`/post/${id}`} className="block md:w-1/3 h-60 md:h-auto overflow-hidden">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        )}
        
        <div className="p-6 flex flex-col flex-grow">
          {/* 作者信息 */}
          {author && author.username && (
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-200 flex-shrink-0">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold">
                    {author.username.substring(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">{author.username}</span>
                <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
              </div>
            </div>
          )}
          
          {/* 文章标题 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
            <Link to={`/post/${id}`}>{title}</Link>
          </h2>
          
          {/* 文章摘要 */}
          <p className="text-gray-600 mb-5 line-clamp-3">{displaySummary}</p>
          
          {/* 文章统计信息和互动按钮 */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6 text-gray-500">
              {/* 阅读量 */}
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>{viewCount}</span>
              </div>
              
              {/* 点赞按钮 */}
              <button 
                onClick={handleLike}
                className="flex items-center group"
                disabled={isLoading}
              >
                <svg 
                  className={`w-4 h-4 mr-1 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-gray-500 group-hover:text-red-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={isLiked ? "0" : "2"} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span className={isLiked ? 'text-red-500' : ''}>{likeCount}</span>
              </button>
              
              {/* 评论数 */}
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                <span>{commentCount}</span>
              </div>
              
              {/* 收藏按钮 */}
              <button 
                onClick={handleSave}
                className="flex items-center group"
                disabled={isLoading}
              >
                <svg 
                  className={`w-4 h-4 mr-1 transition-colors ${isSaved ? 'text-yellow-500 fill-current' : 'text-gray-500 group-hover:text-yellow-500'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={isSaved ? "0" : "2"} 
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  ></path>
                </svg>
                <span className={isSaved ? 'text-yellow-500' : ''}>收藏</span>
              </button>
            </div>
            
            {/* 阅读更多链接 */}
            <Link 
              to={`/post/${id}`} 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              阅读更多
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ArticleCard 