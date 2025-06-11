// 认证工具函数

/**
 * 获取存储的JWT令牌
 * @returns {string|null} JWT令牌或null
 */
export const getToken = () => {
  try {
    return localStorage.getItem('token')
  } catch (error) {
    console.error('获取token失败:', error)
    return null
  }
}

/**
 * 存储JWT令牌
 * @param {string} token JWT令牌
 */
export const setToken = (token) => {
  try {
    localStorage.setItem('token', token)
  } catch (error) {
    console.error('存储token失败:', error)
  }
}

/**
 * 移除JWT令牌
 */
export const removeToken = () => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('移除token失败:', error)
  }
}

/**
 * 获取存储的用户信息
 * @returns {object|null} 用户信息对象或null
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 存储用户信息
 * @param {object} user 用户信息对象
 */
export const setUser = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('存储用户信息失败:', error)
  }
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否已登录
 */
export const isAuthenticated = () => {
  const token = getToken()
  if (!token) return false
  
  try {
    // 简单的JWT解析检查（不验证签名）
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    
    // 检查令牌是否过期
    if (payload.exp && payload.exp < currentTime) {
      removeToken()
      return false
    }
    
    return true
  } catch (error) {
    console.error('验证token失败:', error)
    removeToken()
    return false
  }
}

/**
 * 用户登出
 */
export const logout = () => {
  removeToken()
  // 可以在这里添加其他登出逻辑，如调用API
}

/**
 * 获取带有认证头的请求配置
 * @returns {object} 包含Authorization头的配置对象
 */
export const getAuthHeaders = () => {
  const token = getToken()
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  }
}

/**
 * 发送带有认证的API请求
 * @param {string} url 请求URL
 * @param {object} options 请求选项
 * @returns {Promise<Response>} fetch响应对象
 */
export const authenticatedFetch = async (url, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  })
  
  // 如果令牌过期，自动登出
  if (response.status === 401) {
    logout()
    // 可以在这里触发重定向到登录页面
    window.location.href = '/login'
  }
  
  return response
} 