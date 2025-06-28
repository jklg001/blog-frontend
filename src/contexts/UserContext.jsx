import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '@/api/auth.api';
import { getToken, getUser, setUser } from '@/utils/auth';

// 创建用户上下文
const UserContext = createContext(null);

// 用户上下文提供者组件
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取当前登录用户信息
  const fetchUserInfo = async () => {
    try {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const userData = await authApi.getCurrentUser();
      
      // 更新本地存储和状态
      setUser(userData);
      setCurrentUser(userData);
      setError(null);
    } catch (err) {
      setError('获取用户信息失败');
      // eslint-disable-next-line no-console, no-undef
      console.error('获取用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 刷新用户信息的方法
  const refreshUserInfo = () => {
    return fetchUserInfo();
  };

  // 提供的上下文值
  const value = {
    currentUser,
    loading,
    error,
    refreshUserInfo
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义Hook，方便在组件中使用用户上下文
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser必须在UserProvider内使用');
  }
  return context;
};

export default UserContext; 