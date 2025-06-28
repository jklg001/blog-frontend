import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MainLayout from '../../components/Layout/MainLayout';
import { articleApi } from '@/api/article.api';

/* global console */

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await articleApi.getDetail(id);
        setArticle(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('获取文章详情失败:', err);
        setError('获取文章详情失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">加载中...</div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        ) : !article ? (
          <div className="text-center">文章不存在或已被删除</div>
        ) : (
          <>
            {/* 文章头部 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span>作者: {article.author?.username || '未知'}</span>
                <span className="mx-2">•</span>
                <span>发布于: {new Date(article.createdAt).toLocaleDateString()}</span>
                {article.updatedAt && article.updatedAt !== article.createdAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>更新于: {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </>
                )}
              </div>

              {/* 文章封面图 */}
              {article.coverImage && (
                <div className="mb-6">
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full max-h-96 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/800x400?text=图片加载失败';
                    }}
                  />
                </div>
              )}
            </div>

            {/* 文章内容 - Markdown渲染 */}
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* 文章底部操作区 */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                返回
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default Post;
