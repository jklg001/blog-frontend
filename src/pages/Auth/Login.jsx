/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { setToken, setUser, isAuthenticated } from '../../utils/auth'
import { userApi } from '../../api'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  // UI状态
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // 表单验证状态
  const [fieldErrors, setFieldErrors] = useState({})

  // 检查是否已登录，如果已登录则重定向
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true })
    }
    
    // 检查是否有来自注册页面的消息  
    if (location.state?.message) {
      setError('')  // 清除错误，显示成功消息
    }
    
    // 如果有预填的邮箱，自动填入
    if (location.state?.email) {
      setFormData(prev => ({
        ...prev,
        email: location.state.email
      }))
    }
  }, [navigate, location.state])

  // 表单输入处理
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // 清除对应字段的错误
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // 清除全局错误
    if (error) {
      setError('')
    }
  }

  // 表单验证
  const validateForm = () => {
    const errors = {}
    
    // 邮箱验证
    if (!formData.email) {
      errors.email = '请输入邮箱地址'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址'
    }
    
    // 密码验证
    if (!formData.password) {
      errors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      errors.password = '密码长度至少6位'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // API调用 - 使用公共的 axios 配置
  const loginUser = async (credentials) => {
    return await userApi.login(credentials)
  }

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const result = await loginUser(formData)
      
      // 存储JWT令牌（result 现在是解析后的 data 部分）
      if (result && result.token) {
        setToken(result.token)
        
        // 可选：存储用户信息
        if (result.user) {
          setUser(result.user)
        }
        
        // 重定向到目标页面或首页
        const from = location.state?.from?.pathname || '/'
        navigate(from, { replace: true })
      } else {
        setError('登录失败：未收到访问令牌')
      }
    } catch (err) {
      // 记录登录错误（生产环境可以替换为日志服务）
      // console.error('登录错误:', err)
      setError(err.message || '登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎回来
          </h2>
          <p className="text-gray-600">
            请登录您的账户
          </p>
        </div>
        
        {location.state?.message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{location.state.message}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址 *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder="请输入您的邮箱地址"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              密码 *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-12 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="请输入您的密码"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  )}
                </svg>
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-blue-600 hover:text-blue-500 transition-colors">
                忘记密码？
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>
        
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              还没有账号？
              <Link 
                to="/register" 
                className="text-blue-600 hover:text-blue-500 font-medium ml-1 transition-colors"
              >
                立即注册
              </Link>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 