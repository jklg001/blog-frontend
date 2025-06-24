import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { articleApi } from '@/api/article.api';
import { isAuthenticated } from '@/utils/auth';
import { useUser } from '@/contexts/UserContext';
import MainLayout from '../../components/Layout/MainLayout';
import MDEditor from '@uiw/react-md-editor';

/* global console, window */

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const { currentUser } = useUser();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    coverImage: '',
    status: 'draft'
  });

  // 加载文章详情（编辑模式）
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          setLoading(true);
          const articleData = await articleApi.getDetail(id);
          
          // 适配API返回的数据结构
          setFormData({
            title: articleData.title || '',
            content: articleData.content || '',
            summary: articleData.summary || '',
            coverImage: articleData.coverImage || '',
            status: articleData.status || 'draft'
          });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('获取文章详情失败', err);
          setError('获取文章详情失败，请稍后再试');
        } finally {
          setLoading(false);
        }
      };

      fetchArticle();
    }
  }, [id, isEditMode, navigate, location.pathname]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 处理Markdown编辑器内容变化
  const handleEditorChange = (value) => {
    setFormData(prev => ({ ...prev, content: value || '' }));
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    try {
      setSubmitting(true);
      setError(null);

      // 表单验证
      if (!formData.title.trim()) {
        setError('请输入文章标题');
        setSubmitting(false);
        return;
      }

      if (!formData.content.trim()) {
        setError('请输入文章内容');
        setSubmitting(false);
        return;
      }

      // 准备提交的数据
      const submitData = {
        ...formData
      };

      // 提交表单
      if (isEditMode) {
        await articleApi.updateArticle(id, submitData);
        // eslint-disable-next-line no-alert
        window.alert('文章更新成功！');
      } else {
        await articleApi.createArticle(submitData);
        // eslint-disable-next-line no-alert
        window.alert('文章创建成功！');
      }

      // 提交成功后跳转到文章列表页，使用replace确保不能返回到表单页
      navigate('/articles', { replace: true });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('保存文章失败', err);
      setError(err.message || '保存文章失败，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理保存为草稿
  const handleSaveDraft = async () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    await handleSubmit({ preventDefault: () => {} });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">加载中...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8" data-color-mode="light">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{isEditMode ? '编辑文章' : '发布新文章'}</h1>
            {currentUser && (
              <p className="text-gray-600 text-sm mt-1">
                作者：{currentUser.nickname || currentUser.username}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate('/articles')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            返回列表
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* 文章表单 */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          {/* 标题 */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请输入文章标题"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 摘要 */}
          <div className="mb-4">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
              文章摘要
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="请输入文章摘要"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          {/* 封面图片 */}
          <div className="mb-4">
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              封面图片URL
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="请输入封面图片URL"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.coverImage && (
              <div className="mt-2">
                <img
                  src={formData.coverImage}
                  alt="文章封面预览"
                  className="max-h-40 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
                  }}
                />
              </div>
            )}
          </div>

          {/* Markdown编辑器 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              文章内容 <span className="text-red-500">*</span>
            </label>
            <MDEditor
              value={formData.content}
              onChange={handleEditorChange}
              height={400}
              preview="edit"
            />
            <p className="text-xs text-gray-500 mt-1">
              支持Markdown格式，可以使用Markdown语法编写文章
            </p>
          </div>

          {/* 文章状态 */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              文章状态
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={submitting}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              保存草稿
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {submitting ? '提交中...' : isEditMode ? '更新文章' : '发布文章'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ArticleEditor;
 