import React from 'react'
import { Link } from 'react-router'
import './ArticleCard.css'
import { format } from 'date-fns'

function ArticleCard({ article }) {
  const {
      coverImage,
      summary,
      title,
      commentCount,
      likeCount,
      viewCount,
      author,
      createdAt
  } = article

  return (
    <article className="h-52 w-auto bg-white mb-6 rounded-md relative overflow-hidden flex items-between items-center">
        <img src={coverImage} className="rounded-lg h-full w-52"/>
        <div className="w-128 h-full flex-auto flex justify-evenly flex-col p-6">
            <div className="w-auto flex text-xs">
                <div className="font-bold truncate w-20 mr-2">{author.username}</div>
                <div className="text-gray-400 text-xs">
                    {format(new Date(createdAt), "yyyy-MM-dd HH:mm")}
                </div>
            </div>
            <div className="text-2xl font-bold">{title}</div>
            <div className="text-gray-600 line-clamp-3 text-sm leading-relaxed min-h-[68px]">
              {summary}
            </div>
            <div className="flex items-center">
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        <span>{viewCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <span>{likeCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        <span>{commentCount}</span>
                    </div>
                </div>
            </div>
        </div>
    </article>
  )
}

export default ArticleCard