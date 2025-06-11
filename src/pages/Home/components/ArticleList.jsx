import React from 'react';
import ArticleCard from './ArticleCard';
import './ArticleList.css';

const ArticleList = ({ articles, loading }) => {
  if (loading) return <div>加载中...</div>;

  return (
    <div className="article-list">
      { articles?.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default ArticleList;