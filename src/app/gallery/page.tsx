import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Filter, Grid } from 'lucide-react'
import { getAllArtworks, getCategories, getPrimaryImageUrl } from '@/lib/supabase/services'
import type { ArtworkWithImages } from '@/types/database'
import { ArtworkImage } from '@/components/ui/artwork-image'

export const metadata: Metadata = {
  title: '作品ギャラリー | Kari Gallery',
  description: '心に響く瞬間を捉えたアート作品のコレクション。一点ものの貴重な作品をご覧ください。',
}

export default async function GalleryPage() {
  // Supabaseから実際のデータを取得
  const [artworks, categories] = await Promise.all([
    getAllArtworks(),
    getCategories()
  ])

  const availableArtworks = artworks.filter(artwork => artwork.is_available)
  const soldArtworks = artworks.filter(artwork => !artwork.is_available)
  const allCategories = ['すべて', ...categories]

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダーセクション */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">作品ギャラリー</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              心に響く瞬間を捉えた作品の数々。それぞれに込められた想いとストーリーをお楽しみください。
            </p>
            <div className="text-sm text-gray-500">
              全{artworks.length}作品（販売中: {availableArtworks.length}作品、売約済み: {soldArtworks.length}作品）
            </div>
          </div>
        </div>
      </section>

      {/* フィルター・ソートセクション */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'すべて' ? 'default' : 'outline'}
                  size="sm"
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                並び替え
              </Button>
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 作品一覧セクション */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 販売中作品 */}
          <div className="space-y-8">
            {availableArtworks.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">販売中作品</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {availableArtworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">販売中作品</h2>
                <p className="text-gray-600">現在販売中の作品はございません。</p>
              </div>
            )}

            {/* 売約済み作品 */}
            {soldArtworks.length > 0 && (
              <div className="pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">売約済み作品</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {soldArtworks.map((artwork) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

// 作品カードコンポーネント
function ArtworkCard({ artwork }: { artwork: ArtworkWithImages }) {
  const primaryImageUrl = getPrimaryImageUrl(artwork)
  
  return (
    <Link
      href={`/artwork/${artwork.slug}`}
      className="group"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
        {/* 作品画像 */}
        <div className="aspect-square relative overflow-hidden">
          {artwork.is_featured && (
            <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
              注目作品
            </div>
          )}
          <ArtworkImage
            src={primaryImageUrl}
            alt={artwork.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 作品情報 */}
        <div className="p-6 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-600">
              {artwork.medium} | {artwork.year_created}年
            </p>
          </div>
          
          {artwork.description && (
            <p className="text-sm text-gray-700 line-clamp-2">
              {artwork.description}
            </p>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">
              ¥{artwork.price.toLocaleString()}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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