import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { tagApi } from '@/api';

function TagCloud() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await tagApi.getAllTags();
        setTags(response || []);
      } catch {
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">标签云</h2>
        <div className="animate-pulse flex flex-wrap gap-2">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="h-6 w-16 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">标签云</h2>
        <p className="text-gray-500 text-sm">暂无标签</p>
      </div>
    );
  }

  // 根据文章数量计算标签大小
  const getTagSize = (count) => {
    if (!count) return 'text-xs';
    if (count < 3) return 'text-sm';
    if (count < 6) return 'text-base';
    if (count < 10) return 'text-lg';
    return 'text-xl';
  };

  // 根据索引分配不同的颜色
  const getTagColor = (index) => {
    const colors = [
      'text-blue-500 hover:text-blue-700',
      'text-green-500 hover:text-green-700',
      'text-red-500 hover:text-red-700',
      'text-purple-500 hover:text-purple-700',
      'text-yellow-500 hover:text-yellow-700',
      'text-indigo-500 hover:text-indigo-700',
      'text-pink-500 hover:text-pink-700'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">标签云</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Link 
            key={tag.id} 
            to={`/tag/${tag.id}`}
            className={`${getTagSize(tag.articleCount)} ${getTagColor(index)} font-medium transition-colors`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TagCloud; 