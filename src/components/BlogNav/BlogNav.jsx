import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { isAuthenticated } from '@/utils/auth'
import { useUser } from '@/contexts/UserContext'
import './BlogNav.css'

function BlogNav() {
    const navigate = useNavigate();
    const isLoggedIn = isAuthenticated();
    const { currentUser } = useUser();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        // 清除登录信息
        // eslint-disable-next-line no-undef
        localStorage.removeItem('token');
        // eslint-disable-next-line no-undef
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <div className="blog-nav">
            <div className="blog-content">
                <div className="nav-left">
                    <Link to="/" className="blog-logo">技术博客</Link>
                    <Link to="/" className="blog-home nav">首页</Link>
                    <Link to="/archives" className="blog-history nav">归档</Link>
                    <Link to="/about" className="blog-about nav">关于</Link>
                    <Link to="/contact" className="blog-contect nav">联系</Link>
                    {isLoggedIn && (
                        <Link to="/articles" className="blog-manage nav">文章管理</Link>
                    )}
                </div>
                <div className="nav-right">
                    {isLoggedIn ? (
                        <div className="user-actions">
                            <div className="user-menu-container">
                                <div className="user-info" onClick={toggleUserMenu}>
                                    <span className="welcome-text">
                                        欢迎您，{currentUser?.nickname || currentUser?.username || '用户'}
                                        {currentUser?.role === 'admin' && <span className="admin-badge">管理员</span>}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {showUserMenu && (
                                    <div className="user-dropdown-menu">
                                        <Link to="/user/profile" className="dropdown-item">个人资料</Link>
                                        <Link to="/articles" className="dropdown-item">我的文章</Link>
                                        <div className="dropdown-divider"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="dropdown-item logout-item"
                                        >
                                            退出登录
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="auth-actions">
                            <Link to="/login" className="login-btn">登录</Link>
                            <Link to="/register" className="register-btn">注册</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BlogNav
