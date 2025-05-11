import React from 'react'
import './BlogNav.css'

function BlogNav() {
    return (
        <div className="blog-nav">
            <div className="blog-content">
                <div className="nav-left">
                    <h1 className="blog-logo">技术博客</h1>
                    <div className="blog-home nav">首页</div>
                    <div className="blog-history nav">归档</div>
                    <div className="blog-about nav">关于</div>
                    <div className="blog-contect nav">联系</div>
                </div>
                <div className="nav-right"></div>
            </div>
        </div>
    )
}

export default BlogNav
