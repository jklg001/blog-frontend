import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { articleApi } from '@/api/article.api';
import { isAuthenticated } from '@/utils/auth';
import { useUser } from '@/contexts/UserContext';
import MainLayout from '../../components/Layout/MainLayout';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    categoryId: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUser();

  // 加载文章列表
  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      // 清除空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      // 使用getMyArticles方法获取当前登录用户的文章列表
      const response = await articleApi.getMyArticles(params);
      
      // 适配API返回的数据结构
      // eslint-disable-next-line no-console, no-undef
      console.log('我的文章列表API响应:', response);
      
      setArticles(response.list || []);
      setPagination({
        ...pagination,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 1
      });
    } catch (err) {
      setError('获取文章列表失败，请稍后再试');
      // eslint-disable-next-line no-console, no-undef
      console.error('获取文章列表失败', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加依赖location.key，确保从其他页面返回时能重新加载数据
  useEffect(() => {
    // 检查用户是否已登录
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: location } });
      return;
    }

    loadArticles();
  }, [pagination.page, pagination.limit, filters.status, location.key]);

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 }); // 重置到第一页
    loadArticles();
  };

  // 处理筛选变化
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    
    // 如果是状态筛选，立即执行搜索
    if (name === 'status') {
      setPagination({ ...pagination, page: 1 }); // 重置到第一页
      // 使用setTimeout确保状态更新后再执行搜索
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        loadArticles();
      }, 0);
    }
  };

  // 处理页码变化
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };

  // 处理删除文章
  const handleDeleteArticle = async (id) => {
    // eslint-disable-next-line no-alert, no-undef
    if (!window.confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }

    try {
      await articleApi.deleteArticle(id);
      // 重新加载文章列表
      loadArticles();
    } catch (err) {
      setError('删除文章失败，请稍后再试');
      // eslint-disable-next-line no-console, no-undef
      console.error('删除文章失败', err);
    }
  };

  // 处理发布文章
  const handlePublishArticle = async (id) => {
    // eslint-disable-next-line no-alert, no-undef
    if (!window.confirm('确定要发布这篇文章吗？发布后将对所有人可见。')) {
      return;
    }

    try {
      await articleApi.publishArticle(id);
      // eslint-disable-next-line no-alert, no-undef
      alert('文章发布成功！');
      // 重新加载文章列表
      loadArticles();
    } catch (err) {
      setError('发布文章失败，请稍后再试');
      // eslint-disable-next-line no-console, no-undef
      console.error('发布文章失败', err);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">文章管理</h1>
            {currentUser && (
              <p className="text-gray-600 text-sm mt-1">
                {currentUser.nickname || currentUser.username}
                {currentUser.role === 'admin' && <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">管理员</span>}
              </p>
            )}
          </div>
          <Link
            to="/articles/create"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            发布新文章
          </Link>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <div className="flex-1">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="搜索文章标题或内容..."
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="w-40">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              搜索
            </button>
          </form>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* 文章列表 */}
        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : articles.length === 0 ? (
          <div className="text-center py-8 bg-white rounded shadow">
            <p className="text-gray-500">暂无文章</p>
          </div>
        ) : (
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">发布时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">阅读量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map(article => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/articles/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        编辑
                      </Link>
                      {article.status === 'draft' && (
                        <button
                          onClick={() => handlePublishArticle(article.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          发布
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && articles.length > 0 && pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              显示 {(pagination.page - 1) * pagination.limit + 1} 至 {Math.min(pagination.page * pagination.limit, pagination.total)} 条，共 {pagination.total} 条
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded ${
                  pagination.page === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                上一页
              </button>

              {/* 页码按钮 */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // 显示当前页附近的页码
                let pageToShow;
                if (pagination.totalPages <= 5) {
                  pageToShow = i + 1;
                } else if (pagination.page <= 3) {
                  pageToShow = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageToShow = pagination.totalPages - 4 + i;
                } else {
                  pageToShow = pagination.page - 2 + i;
                }

                return (
                  <button
                    key={pageToShow}
                    onClick={() => handlePageChange(pageToShow)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === pageToShow 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageToShow}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className={`px-3 py-1 rounded ${
                  pagination.page === pagination.totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ArticleList;
