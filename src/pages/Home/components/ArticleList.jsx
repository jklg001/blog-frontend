import React from 'react';
import ArticleCard from './ArticleCard';

const ArticleList = ({ articles, loading }) => {
  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-10 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p className="text-gray-500 text-lg mt-4">暂无文章</p>
        <p className="text-gray-400 mt-2">稍后再来查看吧</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      {articles.map(article => (
        <div key={article.id}>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
};

export default ArticleList;