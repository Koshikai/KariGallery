'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { uploadArtworkImage, addArtworkImage } from '@/lib/supabase/services'

interface ImageUploadProps {
  artworkId?: string
  onImageUploaded?: (imageUrl: string) => void
  onError?: (error: string) => void
  maxFiles?: number
  existingImages?: string[]
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

export function ImageUpload({ 
  artworkId, 
  onImageUploaded, 
  onError, 
  maxFiles = 5,
  existingImages = []
}: ImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>(existingImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ファイル検証
  const validateFile = (file: File): string | null => {
    // ファイルサイズチェック（10MB以下）
    if (file.size > 10 * 1024 * 1024) {
      return 'ファイルサイズは10MB以下にしてください'
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'JPEG、PNG、WebP形式の画像のみアップロード可能です'
    }

    return null
  }

  // ファイルアップロード処理
  const uploadFiles = useCallback(async (files: File[]) => {
    if (!artworkId) {
      onError?.('作品IDが必要です')
      return
    }

    // 既存画像数 + 新規アップロード数が上限を超えないかチェック
    if (previewImages.length + files.length > maxFiles) {
      onError?.(`画像は最大${maxFiles}枚までアップロード可能です`)
      return
    }

    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }))

    setUploads(prev => [...prev, ...newUploads])

    // 各ファイルを順次アップロード
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadIndex = uploads.length + i

      try {
        // ファイル検証
        const validationError = validateFile(file)
        if (validationError) {
          setUploads(prev => prev.map((upload, index) => 
            index === uploadIndex 
              ? { ...upload, status: 'error' as const, error: validationError }
              : upload
          ))
          continue
        }

        // プログレス更新（仮想的な進行状況）
        const progressInterval = setInterval(() => {
          setUploads(prev => prev.map((upload, index) => 
            index === uploadIndex && upload.progress < 90
              ? { ...upload, progress: upload.progress + 10 }
              : upload
          ))
        }, 200)

        // 画像をアップロード
        const imageUrl = await uploadArtworkImage(file, artworkId)
        clearInterval(progressInterval)

        if (imageUrl) {
          // データベースに画像情報を保存
          const displayOrder = previewImages.length + i
          const success = await addArtworkImage(artworkId, imageUrl, displayOrder)

          if (success) {
            setUploads(prev => prev.map((upload, index) => 
              index === uploadIndex 
                ? { ...upload, status: 'success' as const, progress: 100, url: imageUrl }
                : upload
            ))
            setPreviewImages(prev => [...prev, imageUrl])
            onImageUploaded?.(imageUrl)
          } else {
            throw new Error('データベースへの保存に失敗しました')
          }
        } else {
          throw new Error('画像のアップロードに失敗しました')
        }
      } catch (error) {
        setUploads(prev => prev.map((upload, index) => 
          index === uploadIndex 
            ? { 
                ...upload, 
                status: 'error' as const, 
                progress: 0,
                error: error instanceof Error ? error.message : '不明なエラー'
              }
            : upload
        ))
      }
    }
  }, [artworkId, onImageUploaded, onError, uploads.length, previewImages.length, maxFiles])

  // ドラッグ&ドロップ処理
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )

    if (files.length > 0) {
      uploadFiles(files)
    }
  }, [uploadFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  // ファイル選択処理
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      uploadFiles(files)
    }
    // inputをリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [uploadFiles])

  // アップロード削除
  const removeUpload = useCallback((index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="space-y-4">
      {/* アップロードエリア */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          画像をアップロード
        </h3>
        <p className="text-gray-600 mb-4">
          ドラッグ&ドロップまたはクリックしてファイルを選択
        </p>
        <p className="text-sm text-gray-500 mb-4">
          JPEG、PNG、WebP（最大10MB、{maxFiles}枚まで）
        </p>
        
        <Button 
          type="button" 
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={!artworkId}
        >
          <Upload className="mr-2 h-4 w-4" />
          ファイルを選択
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 既存の画像プレビュー */}
      {previewImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            アップロード済み画像 ({previewImages.length}/{maxFiles})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previewImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`画像 ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* アップロード進行状況 */}
      {uploads.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            アップロード状況
          </h4>
          <div className="space-y-2">
            {uploads.map((upload, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {upload.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    )}
                    {upload.status === 'success' && (
                      <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {upload.status === 'error' && (
                      <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✗</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {upload.file.name}
                    </p>
                    {upload.status === 'uploading' && (
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    )}
                    {upload.status === 'error' && upload.error && (
                      <p className="text-sm text-red-600 mt-1">{upload.error}</p>
                    )}
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUpload(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 