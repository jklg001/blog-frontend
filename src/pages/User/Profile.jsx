import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router';
import MainLayout from '../../components/Layout/MainLayout';
import { authApi } from '@/api/auth.api';
import { articleApi } from '@/api/article.api';
import ArticleCard from '../Home/components/ArticleCard';

function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 如果是当前登录用户的个人页面，获取更详细的信息
        if (!userId) {
          try {
            const currentUser = await authApi.getUserProfile();
            setUser(currentUser);
            setIsCurrentUser(true);
          } catch (err) {
            // eslint-disable-next-line no-console, no-undef
            console.error('获取当前用户资料失败:', err);
            setError('获取用户资料失败，请稍后再试');
          }
        } else {
          // 获取指定用户的公开信息
          try {
            const userInfo = await authApi.getUserById(userId);
            setUser(userInfo);
            
            // 检查是否是当前登录用户
            try {
              const currentUser = await authApi.getCurrentUser();
              setIsCurrentUser(currentUser && currentUser.id === parseInt(userId));
            } catch (err) {
              // eslint-disable-next-line no-console, no-undef
              console.error('检查当前用户失败:', err);
              setIsCurrentUser(false);
            }
          } catch (err) {
            // eslint-disable-next-line no-console, no-undef
            console.error('获取用户信息失败:', err);
            setError('用户不存在或已被删除');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchUserArticles = async () => {
      if (!user) return;
      
      try {
        setArticlesLoading(true);
        const response = await articleApi.getUserArticles(user.id, { page: 1, limit: 5 });
        setArticles(response.list || []);
      } catch (err) {
        // eslint-disable-next-line no-console, no-undef
        console.error('获取用户文章失败:', err);
        setArticles([]);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchUserArticles();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">用户不存在</h1>
          <p className="text-gray-600">{error || '无法找到该用户的信息'}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* 用户信息头部 */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 用户头像 */}
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-4xl font-bold">
                  {user.username.substring(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* 用户信息 */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{user.nickname || user.name || user.username}</h1>
                  <div className="flex items-center mt-1 text-gray-600">
                    <span className="text-sm">@{user.username}</span>
                    {user.role === 'admin' && (
                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">管理员</span>
                    )}
                    <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                      {user.status === 'active' ? '已激活' : '未激活'}
                    </span>
                  </div>
                </div>
                
                {/* 编辑按钮 - 仅当前用户可见 */}
                {isCurrentUser && (
                  <div className="mt-4 md:mt-0">
                    <Link 
                      to="/user/settings" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      编辑个人资料
                    </Link>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mt-4">{user.bio || '这个用户很懒，还没有填写个人简介'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">邮箱：</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500">电话：</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                )}
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500">注册时间：</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
                
                {user.lastLoginAt && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500">最近登录：</span>
                    <span className="font-medium">{new Date(user.lastLoginAt).toLocaleString('zh-CN')}</span>
                  </div>
                )}
                
                {user.updatedAt && user.updatedAt !== user.createdAt && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-gray-500">资料更新：</span>
                    <span className="font-medium">{new Date(user.updatedAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 用户文章列表 */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {isCurrentUser ? '我的文章' : `${user.nickname || user.username}的文章`}
          </h2>
          
          {isCurrentUser && (
            <Link 
              to="/post/editor" 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              写文章
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </Link>
          )}
        </div>
        
        {articlesLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : articles.length > 0 ? (
          <div className="flex flex-col space-y-6">
            {articles.map(article => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
            
            {articles.length >= 5 && (
              <div className="text-center pt-4">
                <Link 
                  to={`/user/${user.id}/articles`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  查看更多文章
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <p className="text-gray-500 text-lg mt-4">
              {isCurrentUser ? '你还没有发布任何文章' : '该用户还没有发布任何文章'}
            </p>
            {isCurrentUser && (
              <Link 
                to="/post/editor" 
                className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                开始写作
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* 草稿列表 - 仅当前用户可见 */}
      {isCurrentUser && (
        <div className="max-w-7xl mx-auto px-4 py-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">我的草稿</h2>
          <MyDrafts />
        </div>
      )}
    </MainLayout>
  );
}

// 草稿列表组件
function MyDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await articleApi.getMyDrafts({ page: 1, limit: 5 });
        setDrafts(response.list || []);
      } catch {
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">你还没有保存任何草稿</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {drafts.map(draft => (
          <li key={draft.id} className="p-4 hover:bg-gray-50">
            <Link to={`/articles/edit/${draft.id}`} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">{draft.title || '无标题草稿'}</h3>
                <p className="text-sm text-gray-500">
                  最后编辑于 {new Date(draft.updatedAt || draft.createdAt).toLocaleString('zh-CN')}
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      
      {drafts.length >= 5 && (
        <div className="text-center p-4 border-t border-gray-200">
          <Link to="/user/drafts" className="text-blue-600 hover:text-blue-800">
            查看所有草稿
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile; 