import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { categoryApi } from '@/api';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAllCategories();
        setCategories(response || []);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">分类</h2>
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">分类</h2>
        <p className="text-gray-500 text-sm">暂无分类</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">分类</h2>
      <ul className="space-y-2">
        {categories.map(category => (
          <li key={category.id}>
            <Link 
              to={`/category/${category.id}`} 
              className="flex items-center justify-between text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span>{category.name}</span>
              {category.articleCount && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {category.articleCount}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList; 