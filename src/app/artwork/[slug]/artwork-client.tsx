'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Ruler, Calendar, Palette, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { ArtworkImage } from '@/components/ui/artwork-image'
import type { ArtworkWithImages } from '@/types/database'

interface ArtworkPageClientProps {
  artwork: ArtworkWithImages
  relatedArtworks: ArtworkWithImages[]
  primaryImageUrl: string
  additionalImages: Array<{ id: string; image_url: string; alt_text: string | null }>
}

export default function ArtworkPageClient({ 
  artwork, 
  relatedArtworks, 
  primaryImageUrl, 
  additionalImages 
}: ArtworkPageClientProps) {
  const { addToCart, items } = useCartStore()
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // カートに既に追加されているかチェック
  const isInCart = items.some(item => item.artwork.id === artwork.id)

  useEffect(() => {
    if (isAddedToCart) {
      const timer = setTimeout(() => setIsAddedToCart(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isAddedToCart])
  const handleAddToCart = async () => {
    console.log('🛒 handleAddToCart called')
    console.log('🛒 Current isInCart:', isInCart)
    console.log('🛒 Current items in cart:', items)
    console.log('🛒 Artwork to add:', artwork.id, artwork.title)
    
    if (isInCart) {
      console.log('🛒 Item already in cart, returning')
      return
    }
    
    setIsAddingToCart(true)
    try {
      console.log('🛒 Calling addToCart...')
      addToCart(artwork)
      console.log('🛒 addToCart completed successfully')
      setIsAddedToCart(true)
    } catch (error) {
      console.error('🛒 カートに追加できませんでした:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずナビゲーション */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-900">
            ホーム
          </Link>
          <span className="text-gray-400">/</span>
          <Link href="/gallery" className="text-gray-500 hover:text-gray-900">
            ギャラリー
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{artwork.title}</span>
        </nav>

        {/* 戻るボタン */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ギャラリーに戻る
            </Link>
          </Button>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* 左側: 作品画像 */}
          <div className="space-y-6">
            {/* メイン画像 */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <ArtworkImage
                src={primaryImageUrl}
                alt={artwork.title}
                width={600}
                height={450}
                className="w-full h-full object-cover"
                priority
              />
            </div>

            {/* 追加画像（ある場合） */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {additionalImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <ArtworkImage
                      src={image.image_url}
                      alt={image.alt_text || artwork.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 右側: 作品情報 */}
          <div className="space-y-8">
            {/* 基本情報 */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {artwork.title}
                </h1>
                <p className="text-lg text-gray-600">
                  {artwork.medium} | {artwork.year_created}年
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                ¥{artwork.price.toLocaleString()}
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                {artwork.width && artwork.height && (
                  <div className="flex items-center">
                    <Ruler className="h-4 w-4 mr-1" />
                    {artwork.width} × {artwork.height} cm
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {artwork.year_created}年
                </div>
                <div className="flex items-center">
                  <Palette className="h-4 w-4 mr-1" />
                  {artwork.medium}
                </div>
              </div>
            </div>

            {/* 作品説明 */}
            {artwork.description && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">作品について</h3>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* アクションボタン */}
            <div className="space-y-4">
              {artwork.is_available ? (
                <>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={isInCart || isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        追加中...
                      </>
                    ) : isInCart ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        カートに追加済み
                      </>
                    ) : isAddedToCart ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        カートに追加しました！
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        カートに追加
                      </>
                    )}
                  </Button>
                  
                  {isInCart && (
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link href="/cart">
                        カートを見る
                      </Link>
                    </Button>
                  )}
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      お気に入り
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      シェア
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg text-center font-medium">
                    こちらの作品は売約済みです
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      お気に入り
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      シェア
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 配送・購入情報 */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold text-gray-900">配送・購入について</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• 全国送料無料（10万円以上のご購入）</p>
                <p>• 丁寧な梱包でお届けします</p>
                <p>• 真正性証明書が付属します</p>
                <p>• ご質問はお気軽にお問い合わせください</p>
              </div>
            </div>
          </div>
        </div>

        {/* 制作の物語セクション */}
        {artwork.story && (
          <section className="mt-16 border-t pt-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">制作の物語</h2>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {artwork.story.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 関連作品セクション */}
        {relatedArtworks.length > 0 && (
          <section className="mt-16 border-t pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">関連作品</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <Link
                  key={relatedArtwork.id}
                  href={`/artwork/${relatedArtwork.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                    <ArtworkImage
                      src={relatedArtwork.artwork_images?.[0]?.image_url || '/placeholder-artwork.jpg'}
                      alt={relatedArtwork.title}
                      width={300}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {relatedArtwork.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {relatedArtwork.medium} | {relatedArtwork.year_created}年
                    </p>
                    <p className="font-bold text-gray-900">
                      ¥{relatedArtwork.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
