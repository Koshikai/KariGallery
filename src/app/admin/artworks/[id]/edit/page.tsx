'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { getArtworkById, updateArtwork } from '@/lib/supabase/services'
import type { ArtworkWithImages } from '@/types/database'

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

const Select = ({ className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
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
  description: string
  price: number
  width: number | null
  height: number | null
  medium: string
  year_created: number
  is_available: boolean
  category: string
}

export default function EditArtworkPage() {
  const router = useRouter()
  const params = useParams()
  const artworkId = params.id as string

  const [artwork, setArtwork] = useState<ArtworkWithImages | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    size: '',
    medium: '',
    year: new Date().getFullYear(),
    status: 'available',
    category: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 作品データの読み込み
  useEffect(() => {
    const loadArtwork = async () => {
      try {
        setIsLoading(true)
        const data = await getArtworkById(artworkId)
        if (data) {
          setArtwork(data)
          setFormData({
            title: data.title,
            description: data.description || '',
            price: data.price,
            size: data.size || '',
            medium: data.medium || '',
            year: data.year || new Date().getFullYear(),
            status: data.status as 'available' | 'sold' | 'reserved',
            category: data.category || ''
          })
        } else {
          setError('作品が見つかりません')
        }
      } catch (error) {
        setError('作品の読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (artworkId) {
      loadArtwork()
    }
  }, [artworkId])

  // フォームデータの更新
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      await updateArtwork(artworkId, formData)
      setSuccess('作品情報を更新しました')
      
      // 2秒後に一覧画面に戻る
      setTimeout(() => {
        router.push('/admin/artworks')
      }, 2000)
      
    } catch (error) {
      setError('更新に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>作品データを読み込み中...</span>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">作品が見つかりません</h1>
          <Link href="/admin/artworks">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              作品一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">作品編集</h1>
          <p className="mt-2 text-gray-600">作品の詳細情報を編集します</p>
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

                <div>
                  <Label htmlFor="status">ステータス *</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    required
                  >
                    <option value="available">販売中</option>
                    <option value="reserved">予約済み</option>
                    <option value="sold">売約済み</option>
                  </Select>
                </div>
              </div>

              {/* 右カラム：詳細情報 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="size">サイズ</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => handleInputChange('size', e.target.value)}
                    placeholder="例: 30×40cm"
                  />
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
                  <Label htmlFor="year">制作年</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', Number(e.target.value))}
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
              </div>
            </div>

            {/* 現在の画像表示 */}
            {artwork.images && artwork.images.length > 0 && (
              <div>
                <Label>現在の画像</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                     {artwork.images.map((image: any, index: number) => (
                     <div key={index} className="relative">
                       <img
                         src={image.image_url}
                         alt={`${artwork.title} - ${index + 1}`}
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
                    更新中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    更新
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 