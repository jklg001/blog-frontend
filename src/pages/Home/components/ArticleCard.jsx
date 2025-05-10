import React from 'react'
import { Link } from 'react-router'
import './ArticleCard.css'

function ArticleCard({ article }) {
  const { id, title, summary, date, tags } = article

  return (
    <article className="article-card">
      <h2 className="article-title">
        <Link to={`/post/${id}`}>{title}</Link>
      </h2>
      <div className="article-meta">
        <span className="article-date">{date}</span>
        <div className="article-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <p className="article-summary">{summary}</p>
      <Link to={`/post/${id}`} className="read-more">
        阅读更多
      </Link>
    </article>
  )
}

export default ArticleCard 