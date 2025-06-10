import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Filter, Grid } from 'lucide-react'

export const metadata: Metadata = {
  title: '作品ギャラリー | Kari Gallery',
  description: '心に響く瞬間を捉えたアート作品のコレクション。一点ものの貴重な作品をご覧ください。',
}

// 後でSupabaseから取得する予定のダミーデータ
const dummyArtworks = [
  {
    id: '1',
    title: '夕暮れの街角',
    slug: 'yuugure-no-machikado',
    price: 85000,
    medium: '水彩・紙本',
    year_created: 2024,
    category: '絵画',
    is_available: true,
    is_featured: true,
    description: '夕日に染まる街角の美しい一瞬を捉えた作品',
  },
  {
    id: '2',
    title: '静寂の森',
    slug: 'seijaku-no-mori',
    price: 120000,
    medium: 'アクリル・キャンバス',
    year_created: 2024,
    category: '絵画',
    is_available: true,
    is_featured: false,
    description: '森の奥深くで感じた静寂と神秘を表現',
  },
  {
    id: '3',
    title: '風の記憶',
    slug: 'kaze-no-kioku',
    price: 65000,
    medium: '鉛筆・紙本',
    year_created: 2023,
    category: '素描',
    is_available: false,
    is_featured: false,
    description: '風に揺れる草木から感じた生命力',
  },
  {
    id: '4',
    title: '光の踊り',
    slug: 'hikari-no-odori',
    price: 95000,
    medium: '油彩・キャンバス',
    year_created: 2024,
    category: '絵画',
    is_available: true,
    is_featured: true,
    description: '陽光が創り出す美しい光と影の饗宴',
  },
  {
    id: '5',
    title: '都市の夜想曲',
    slug: 'toshi-no-yasoukyoku',
    price: 110000,
    medium: 'リトグラフ',
    year_created: 2023,
    category: '版画',
    is_available: true,
    is_featured: false,
    description: '都市の夜景に宿る詩的な美しさ',
  },
  {
    id: '6',
    title: '季節のささやき',
    slug: 'kisetsu-no-sasayaki',
    price: 75000,
    medium: '水彩・紙本',
    year_created: 2024,
    category: '絵画',
    is_available: true,
    is_featured: false,
    description: '移ろいゆく季節の瞬間を繊細に表現',
  },
]

const categories = ['すべて', '絵画', '素描', '版画']

export default function GalleryPage() {
  const availableArtworks = dummyArtworks.filter(artwork => artwork.is_available)
  const soldArtworks = dummyArtworks.filter(artwork => !artwork.is_available)

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
          </div>
        </div>
      </section>

      {/* フィルター・ソートセクション */}
      <section className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">販売中作品</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {availableArtworks.map((artwork) => (
                  <Link
                    key={artwork.id}
                    href={`/artwork/${artwork.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
                      {/* 作品画像プレースホルダー */}
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                        {artwork.is_featured && (
                          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            注目作品
                          </div>
                        )}
                        <span className="text-gray-400 text-sm">作品画像</span>
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
                        
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {artwork.description}
                        </p>
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-bold text-gray-900">
                            ¥{artwork.price.toLocaleString()}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            販売中
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 売約済み作品 */}
            {soldArtworks.length > 0 && (
              <div className="pt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">売約済み作品</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {soldArtworks.map((artwork) => (
                    <Link
                      key={artwork.id}
                      href={`/artwork/${artwork.slug}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 opacity-75">
                        {/* 作品画像プレースホルダー */}
                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                              売約済み
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">作品画像</span>
                        </div>

                        {/* 作品情報 */}
                        <div className="p-6 space-y-3">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg text-gray-700">
                              {artwork.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {artwork.medium} | {artwork.year_created}年
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {artwork.description}
                          </p>
                        </div>
                      </div>
                    </Link>
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