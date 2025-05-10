import React from 'react'
import './Sidebar.css'

function Sidebar() {
  const categories = [
    { id: 1, name: '前端开发', count: 12 },
    { id: 2, name: '后端开发', count: 8 },
    { id: 3, name: 'DevOps', count: 5 }
  ]

  const tags = [
    { id: 1, name: 'React', count: 15 },
    { id: 2, name: 'JavaScript', count: 20 },
    { id: 3, name: 'Node.js', count: 10 },
    { id: 4, name: 'TypeScript', count: 8 }
  ]

  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <h3>分类</h3>
        <ul className="category-list">
          {categories.map(category => (
            <li key={category.id}>
              <span className="category-name">{category.name}</span>
              <span className="category-count">({category.count})</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-section">
        <h3>标签</h3>
        <div className="tag-cloud">
          {tags.map(tag => (
            <span key={tag.id} className="tag">
              {tag.name} ({tag.count})
            </span>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default Sidebar 