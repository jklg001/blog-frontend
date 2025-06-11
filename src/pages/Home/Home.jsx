import React, { useEffect, useState } from 'react'
import ArticleList from './components/ArticleList'
import Sidebar from './components/Sidebar'
import BlogNav  from "../../components/BlogNav/BlogNav.jsx";
import { articleApi } from '@/api';
import './Home.css'

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await articleApi.getList();
        setArticles(data.list || []); // Add proper data structure access
      } catch (error) {
        setArticles([]); // Ensure fallback empty array
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home min-h-screen bg-gray-50">
      <BlogNav />
      
      {/* 博客首页横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">欢迎来到我的博客</h1>
        <p className="text-xl opacity-90">分享技术、记录生活、探索世界</p>
      </div>
      
      <div className="home-content max-w-6xl mx-auto p-4">
        <main className="main-content">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 mt-8">最新文章</h2>
          <ArticleList articles={articles} loading={loading} />
        </main>
        <Sidebar />
      </div>
    </div>
  )
}

export default Home
