'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createArtwork } from '@/lib/supabase/services'
import { ImageUpload } from '@/components/admin/image-upload'

// 簡単なUIコンポーネント
const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
)

const Label = ({ className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props} />
)



const Alert = ({ variant = 'default', className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' | 'success' }) => (
  <div 
    className={`p-4 rounded-md border ${
      variant === 'destructive' 
        ? 'bg-red-50 border-red-200 text-red-800' 
        : variant === 'success'
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-blue-50 border-blue-200 text-blue-800'
    } ${className}`} 
    {...props}
  >
    {children}
  </div>
)

const AlertDescription = ({ className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-sm ${className}`} {...props} />
)

interface FormData {
  title: string
  slug: string
  description: string
  price: number
  width: number | null
  height: number | null
  medium: string
  year_created: number
  category: string
  is_available: boolean
  is_featured: boolean
}

export default function NewArtworkPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    price: 0,
    width: null,
    height: null,
    medium: '',
    year_created: new Date().getFullYear(),
    category: '',
    is_available: true,
    is_featured: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [createdArtworkId, setCreatedArtworkId] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)

  // フォームデータの更新
  const handleInputChange = (field: keyof FormData, value: string | number | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // タイトルが変更されたときに自動でスラッグを生成
    if (field === 'title' && typeof value === 'string') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const artworkId = await createArtwork(formData)
      
      if (artworkId) {
        setCreatedArtworkId(artworkId)
        setSuccess('作品を作成しました。続けて画像をアップロードしてください。')
        setShowImageUpload(true)
      } else {
        setError('作品の作成に失敗しました')
      }
      
    } catch (error) {
      setError('予期しないエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  // 画像アップロード完了時
  const handleImageUploaded = () => {
    // 画像がアップロードされた時の処理（必要に応じて追加）
  }

  // 画像アップロードエラー時
  const handleImageUploadError = (errorMessage: string) => {
    setError(errorMessage)
  }

  // 完了ボタン
  const handleFinish = () => {
    router.push('/admin/artworks')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/artworks">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              作品一覧に戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">新しい作品の追加</h1>
          <p className="mt-2 text-gray-600">新しい作品を追加します</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左カラム：基本情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">作品名 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    placeholder="作品名を入力"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL スラッグ *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    required
                    placeholder="url-slug"
                    pattern="[a-z0-9-]+"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    小文字・数字・ハイフンのみ使用可能
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">説明</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    placeholder="作品の説明を入力"
                  />
                </div>

                <div>
                  <Label htmlFor="price">価格 (円) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* 右カラム：詳細情報 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">幅 (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={formData.width || ''}
                      onChange={(e) => handleInputChange('width', e.target.value ? Number(e.target.value) : null)}
                      min="0"
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">高さ (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height || ''}
                      onChange={(e) => handleInputChange('height', e.target.value ? Number(e.target.value) : null)}
                      min="0"
                      placeholder="40"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="medium">画材・技法</Label>
                  <Input
                    id="medium"
                    value={formData.medium}
                    onChange={(e) => handleInputChange('medium', e.target.value)}
                    placeholder="例: 油彩・キャンバス"
                  />
                </div>

                <div>
                  <Label htmlFor="year_created">制作年</Label>
                  <Input
                    id="year_created"
                    type="number"
                    value={formData.year_created}
                    onChange={(e) => handleInputChange('year_created', Number(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear()}
                    placeholder="2024"
                  />
                </div>

                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="例: 油彩画"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available}
                      onChange={(e) => handleInputChange('is_available', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="is_available" className="mb-0">販売可能</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="is_featured" className="mb-0">注目作品</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* エラー・成功メッセージ */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert variant="success">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* 送信ボタン */}
            {!showImageUpload && (
              <div className="flex justify-end space-x-4">
                <Link href="/admin/artworks">
                  <Button type="button" variant="outline">
                    キャンセル
                  </Button>
                </Link>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      作成中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      作成
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>

          {/* 画像アップロードセクション */}
          {showImageUpload && createdArtworkId && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                作品画像のアップロード
              </h2>
              <ImageUpload
                artworkId={createdArtworkId}
                onImageUploaded={handleImageUploaded}
                onError={handleImageUploadError}
                maxFiles={5}
              />
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleFinish}>
                  完了
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 