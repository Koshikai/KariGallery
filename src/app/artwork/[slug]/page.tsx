import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Ruler, Calendar, Palette, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getArtworkBySlug, getRelatedArtworks, getPrimaryImageUrl, getAllImageUrls } from '@/lib/supabase/services'
import type { ArtworkWithImages } from '@/types/database'

interface ArtworkPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: ArtworkPageProps): Promise<Metadata> {
  const params = await props.params
  const artwork = await getArtworkBySlug(params.slug)
  
  if (!artwork) {
    return {
      title: '作品が見つかりません | Kari Gallery'
    }
  }
  
  const primaryImageUrl = getPrimaryImageUrl(artwork)
  
  return {
    title: `${artwork.title} | Kari Gallery`,
    description: artwork.description || `${artwork.title} - ${artwork.medium}、${artwork.year_created}年制作`,
    openGraph: {
      title: artwork.title,
      description: artwork.description || `${artwork.title} - ${artwork.medium}、${artwork.year_created}年制作`,
      type: 'article',
      images: [
        {
          url: primaryImageUrl !== '/placeholder-artwork.jpg' ? primaryImageUrl : '/placeholder-artwork.jpg',
          width: 1200,
          height: 630,
          alt: artwork.title,
        }
      ]
    }
  }
}

export default async function ArtworkPage(props: ArtworkPageProps) {
  const params = await props.params
  const artwork = await getArtworkBySlug(params.slug)
  
  if (!artwork) {
    notFound()
  }

  // 関連作品を取得（同じカテゴリの他の作品）
  const relatedArtworks = artwork.category 
    ? await getRelatedArtworks(artwork.id, artwork.category, 3)
    : []

  const primaryImageUrl = getPrimaryImageUrl(artwork)
  const allImages = getAllImageUrls(artwork)
  const additionalImages = allImages.filter(img => !img.is_primary)

  return (
    <div className="min-h-screen bg-white">
      {/* パンくずナビ */}
      <div className="border-b bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="pl-0">
            <Link href="/gallery">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ギャラリーに戻る
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 画像セクション */}
          <div className="space-y-6">
            {/* メイン画像 */}            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
              {primaryImageUrl !== '/placeholder-artwork.jpg' ? (
                <Image
                  src={primaryImageUrl}
                  alt={artwork.title}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">作品画像</span>
                </div>
              )}
            </div>

            {/* 追加画像（ある場合） */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {additionalImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >                    <Image
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

          {/* 作品情報セクション */}
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
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4" />
                    <span>
                      {artwork.width} × {artwork.height} 
                      {artwork.depth && ` × ${artwork.depth}`} cm
                    </span>
                  </div>
                )}
                {artwork.year_created && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{artwork.year_created}年制作</span>
                  </div>
                )}
                {artwork.category && (
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4" />
                    <span>{artwork.category}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 作品説明 */}
            {artwork.description && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">作品について</h2>
                <p className="text-gray-700 leading-relaxed">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* アクションボタン */}
            <div className="space-y-4">
              {artwork.is_available ? (
                <>
                  <Button size="lg" className="w-full">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    カートに追加
                  </Button>
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
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">関連作品</h2>
              <p className="text-gray-600 mt-2">同じカテゴリーの他の作品</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArtworks.map((relatedArtwork) => (
                <RelatedArtworkCard key={relatedArtwork.id} artwork={relatedArtwork} />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/gallery">すべての作品を見る</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// 関連作品カードコンポーネント
function RelatedArtworkCard({ artwork }: { artwork: ArtworkWithImages }) {
  const primaryImageUrl = getPrimaryImageUrl(artwork)
  
  return (
    <Link href={`/artwork/${artwork.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">          {primaryImageUrl !== '/placeholder-artwork.jpg' ? (
            <Image
              src={primaryImageUrl}
              alt={artwork.title}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-sm">作品画像</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600">
            {artwork.medium} | {artwork.year_created}年
          </p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900">
              ¥{artwork.price.toLocaleString()}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              artwork.is_available
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {artwork.is_available ? '販売中' : '売約済み'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
} 