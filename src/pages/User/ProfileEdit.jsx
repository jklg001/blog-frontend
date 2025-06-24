import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { authApi } from '@/api/auth.api';
import { isAuthenticated } from '@/utils/auth';
import { useUser } from '@/contexts/UserContext';
import MainLayout from '../../components/Layout/MainLayout';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUserInfo } = useUser();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nickname: '',
    bio: '',
    avatar: '',
    name: '',
    phone: ''
  });

  // 加载用户详细资料
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/user/settings' } });
      return;
    }

    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 使用与Profile页面相同的接口
        const profileData = await authApi.getUserProfile();
        
        setFormData({
          nickname: profileData.nickname || '',
          bio: profileData.bio || '',
          avatar: profileData.avatar || '',
          name: profileData.name || '',
          phone: profileData.phone || ''
        });
      } catch (err) {
        // eslint-disable-next-line no-console, no-undef
        console.error('获取用户资料失败', err);
        setError('获取用户资料失败，请稍后再试');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除错误和成功消息
    setError(null);
    setSuccess(null);
  };

  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // 表单验证
      if (!formData.nickname.trim()) {
        setError('请输入昵称');
        setSaving(false);
        return;
      }
      
      // 提交更新
      await authApi.updateUserProfile(formData);
      
      // 刷新用户信息
      await refreshUserInfo();
      
      setSuccess('个人资料更新成功！');
      
      // 短暂延迟后跳转到个人资料页面
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        navigate('/user/profile');
      }, 1500);
    } catch (err) {
      // eslint-disable-next-line no-console, no-undef
      console.error('更新用户资料失败', err);
      setError(err.message || '更新用户资料失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">编辑个人资料</h1>
          <Link 
            to="/user/profile" 
            className="text-blue-600 hover:text-blue-800"
          >
            返回个人资料
          </Link>
        </div>
        
        {/* 消息提示 */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{success}</p>
          </div>
        )}
        
        {/* 编辑表单 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* 用户头像 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                头像
              </label>
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mr-4">
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="用户头像" className="w-full h-full object-cover" />
                  ) : currentUser ? (
                    <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">
                      {currentUser.nickname?.charAt(0) || currentUser.username?.charAt(0) || '?'}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300"></div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleInputChange}
                    placeholder="输入头像URL"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">输入图片URL地址或保持为空</p>
                </div>
              </div>
            </div>
            
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  昵称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="请输入您的昵称"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">昵称将显示在您的个人资料和文章中</p>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="请输入您的真实姓名（选填）"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">真实姓名仅用于系统内部，不会公开显示</p>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  电话
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="请输入您的联系电话（选填）"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">用于账号安全验证，不会公开显示</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                个人简介
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="介绍一下自己吧..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">个人简介将显示在您的个人资料页面</p>
            </div>
            
            {/* 只读信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  value={currentUser?.username || ''}
                  className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">用户名不可修改</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ''}
                  className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">邮箱不可修改</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账号状态
                </label>
                <div className="w-full px-3 py-2 border rounded bg-gray-100 flex items-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    currentUser?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {currentUser?.status === 'active' ? '已激活' : '未激活'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  注册时间
                </label>
                <input
                  type="text"
                  value={currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleString('zh-CN') : ''}
                  className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            
            {/* 提交按钮 */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                disabled={saving}
              >
                {saving ? '保存中...' : '保存修改'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfileEdit; 