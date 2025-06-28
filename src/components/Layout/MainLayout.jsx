import React from 'react';
import BlogNav from '../BlogNav/BlogNav';

/**
 * 主布局组件，包含导航栏和内容区域
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @param {boolean} [props.noTopPadding=false] - 是否取消顶部内边距（用于特殊页面）
 * @returns {JSX.Element} 布局组件
 */
const MainLayout = ({ children, noTopPadding = false }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 导航栏 */}
      <BlogNav />
      
      {/* 内容区域 */}
      <div 
        className={`flex-1 ${noTopPadding ? '' : 'pt-16'}`}
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 