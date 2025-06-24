import React from 'react'
import './Sidebar.css'

function Sidebar() {
  return (
    <div className="space-y-6">
      {/* 关于博主 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">关于博主</h2>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mr-4">
            <img 
              src="https://via.placeholder.com/150" 
              alt="博主头像" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">博主昵称</h3>
            <p className="text-sm text-gray-500">Web开发爱好者</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          热爱编程和技术分享，专注于前端开发和用户体验设计。
        </p>
      </div>
      
      {/* 热门文章 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">热门文章</h2>
        <ul className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <li key={index}>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors block">
                <span className="inline-block w-6 h-6 bg-blue-500 text-white text-center rounded-full mr-2">
                  {index + 1}
                </span>
                示例热门文章标题 {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      {/* 友情链接 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">友情链接</h2>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">React官网</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Vue官网</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">MDN文档</a>
          <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 