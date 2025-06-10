'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ArtworkImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export function ArtworkImage({ 
  src, 
  alt, 
  className = '',
  width = 400,
  height = 400,
  priority = false 
}: ArtworkImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    setLoading(false)
  }

  // エラーまたはプレースホルダーの場合はプレースホルダーSVGを表示
  if (error || src === '/placeholder-artwork.svg') {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg 
              width="60" 
              height="60" 
              viewBox="0 0 60 60" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <rect width="60" height="60" rx="8" fill="#f3f4f6"/>
              <circle cx="20" cy="20" r="8" fill="#9ca3af"/>
              <path d="M10 50 L20 35 L35 40 L50 25" stroke="#6b7280" strokeWidth="2" fill="none"/>
              <rect x="5" y="5" width="50" height="50" rx="4" fill="none" stroke="#d1d5db" strokeWidth="1"/>
            </svg>
          </div>
          <span className="text-gray-500 text-sm">作品画像</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <span className="text-gray-500 text-sm">読み込み中...</span>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
      />
    </div>
  )
} 