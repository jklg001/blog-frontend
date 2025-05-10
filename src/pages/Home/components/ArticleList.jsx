import React from 'react'
import ArticleCard from './ArticleCard'
import './ArticleList.css'

function ArticleList() {
  // 模拟文章数据
  const articles = [
    {
      id: 1,
      title: 'React 最佳实践',
      summary: '本文介绍了 React 开发中的一些最佳实践...',
      date: '2024-03-20',
      tags: ['React', '前端']
    },
    {
      id: 2,
      title: 'TypeScript 入门指南',
      summary: '从零开始学习 TypeScript...',
      date: '2024-03-19',
      tags: ['TypeScript', 'JavaScript']
    }
  ]

  return (
    <div className="article-list">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

export default ArticleList 