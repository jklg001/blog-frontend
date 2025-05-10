import React from 'react'
import { useParams } from 'react-router'

function Post() {
  const { id } = useParams()

  return (
    <div className="post">
      <h1>文章详情</h1>
      <div className="post-content">
        {/* 这里后续会添加文章内容 */}
        <p>文章ID: {id}</p>
      </div>
    </div>
  )
}

export default Post
