import React, { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList'
import Sidebar from './components/Sidebar'
import MainLayout from "../../components/Layout/MainLayout";
import InteractiveBanner from "../../components/Banner/InteractiveBanner";
import { articleApi } from '@/api';

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取文章列表
        const response = await articleApi.getList();
        
        // 响应拦截器已经处理了数据结构，直接使用 response.list
        setArticles(response.list || []);
      } catch {
        // 请求失败时设置空数组
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <MainLayout noTopPadding>
      {/* 交互式Banner */}
      <InteractiveBanner />
      
      {/* 主要内容区域 */}
      <div id="latest-articles" className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容区 */}
          <main className="lg:w-3/4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">最新文章</h2>
              <a href="/post/list" className="text-blue-600 hover:text-blue-800 flex items-center">
                查看全部
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
            <ArticleList articles={articles} loading={loading} />
          </main>
          
          {/* 侧边栏 */}
          <aside className="lg:w-1/4">
            <Sidebar />
          </aside>
        </div>
      </div>
      
      {/* 页脚 */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
        </div>
      </footer>
    </MainLayout>
  )
}

export default Home
