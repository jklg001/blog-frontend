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
        const res = await articleApi.getList();
        setArticles(res.data?.data || []); // Add proper data structure access
      } catch (error) {
        console.log('请求失败:', error);
        setArticles([]); // Ensure fallback empty array
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home">
      <BlogNav />
      <div className="home-content">
        <main className="main-content">
          <h1>最新文章</h1>
          <ArticleList articles={articles} loading={loading} />
        </main>
        <Sidebar />
      </div>
    </div>
  )
}

export default Home
