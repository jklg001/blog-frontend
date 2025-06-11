import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { isAuthenticated } from '../utils/auth'

/**
 * 保护路由组件
 * 如果用户未登录，则重定向到登录页面
 * @param {object} props 组件属性
 * @param {React.ReactNode} props.children 子组件
 * @returns {React.ReactElement} React元素
 */
function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    // 将当前路径保存到state中，登录后可以重定向回来
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
