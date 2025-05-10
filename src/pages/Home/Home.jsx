import React from 'react'
import ArticleList from './components/ArticleList'
import Sidebar from './components/Sidebar'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <main className="main-content">
          <h1>最新文章</h1>
          <ArticleList />
        </main>
        <Sidebar />
      </div>
    </div>
  )
}

export default Home
