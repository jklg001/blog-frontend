/* eslint-disable no-console, no-undef */
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { userApi } from '@/api'
import { isAuthenticated } from '@/utils/auth'

function Register() {
  const navigate = useNavigate()

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  })

  // UI状态
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 表单验证状态
  const [fieldErrors, setFieldErrors] = useState({})

  // 检查是否已登录，如果已登录则重定向
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

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

    // 清除全局错误和成功消息
    if (error) setError('')
    if (success) setSuccess('')
  }

  // 表单验证
  const validateForm = () => {
    const errors = {}

    // 姓名验证
    if (!formData.name.trim()) {
      errors.name = '请输入姓名'
    } else if (formData.name.trim().length < 2) {
      errors.name = '姓名至少2个字符'
    }

    // 用户名验证
    if (!formData.username.trim()) {
      errors.username = '请输入用户名'
    } else if (formData.username.length < 3) {
      errors.username = '用户名至少3个字符'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = '用户名只能包含字母、数字和下划线'
    }

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

    // 确认密码验证
    if (!formData.confirmPassword) {
      errors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // API调用 - 使用公共的 axios 配置
  const registerUser = async (userData) => {
    return await userApi.register({
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      username: userData.username.trim()
    })
  }

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await registerUser(formData)

      // 注册成功（使用公共 axios 配置，成功时直接返回 data 部分）
      setSuccess('注册成功！正在跳转到登录页面...')

      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: '注册成功，请登录您的账户',
            email: formData.email
          }
        })
      }, 2000)

    } catch (err) {
      // 处理特定的错误情况
      if (err.code === 409) {
        setError('该邮箱或用户名已被注册');
      } else {
        setError(err.message || '注册失败，请稍后重试');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            创建账户
          </h2>
          <p className="text-gray-600">
            加入我们，开始您的博客之旅
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              姓名 *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.name 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="请输入您的真实姓名"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              用户名 *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.username 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              }`}
              placeholder="请输入用户名（字母、数字、下划线）"
            />
            {fieldErrors.username && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
            )}
          </div>

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
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-12 ${
                  fieldErrors.password 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                }`}
                placeholder="请输入密码（至少6位）"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              确认密码 *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-12 ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                }`}
                placeholder="请再次输入密码"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showConfirmPassword ? (
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
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              我已阅读并同意
              <a href="#" className="text-green-600 hover:text-green-500 mx-1">
                服务条款
              </a>
              和
              <a href="#" className="text-green-600 hover:text-green-500 mx-1">
                隐私政策
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                注册中...
              </>
            ) : (
              '创建账户'
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
              已有账号？
              <Link
                to="/login"
                className="text-green-600 hover:text-green-500 font-medium ml-1 transition-colors"
              >
                立即登录
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

export default Register
