import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Ruler, Calendar, Palette, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArtworkPageProps {
  params: Promise<{ slug: string }>
}

// ダミーデータ（後でSupabaseから取得）
const dummyArtworks = [
  {
    id: '1',
    title: '夕暮れの街角',
    slug: 'yuugure-no-machikado',
    price: 85000,
    medium: '水彩・紙本',
    year_created: 2024,
    category: '絵画',
    width: 38,
    height: 27,
    is_available: true,
    is_featured: true,
    description: '夕日に染まる街角の美しい一瞬を捉えた作品。日常の風景の中に潜む詩的な美しさを表現しています。',
    story: `この作品は、ある秋の夕方に偶然出会った光景から生まれました。
    
いつもの帰り道、ふと振り返ると街角に差し込む夕日が、古いビルの壁を温かいオレンジ色に染めていました。そこには特別な何かがあるわけではありません。ただの日常の一コマです。

しかし、その瞬間の光と影のドラマ、空気の温度、通り過ぎる人々の足音まで、すべてが調和して一つの詩のような美しさを作り出していました。

この作品には、そんな「普通の奇跡」への感謝の気持ちを込めました。私たちの周りには、立ち止まって見つめるだけで心を動かされる瞬間がたくさんあります。

使用した水彩の技法により、光の透明感と空気の流れを表現しています。特に夕日の暖かさを表現するために、何度も色を重ねて深みのある色調を作り上げました。`,
    images: [
      { id: '1', url: '', alt: '夕暮れの街角 メイン画像', is_primary: true },
      { id: '2', url: '', alt: '夕暮れの街角 詳細画像', is_primary: false },
    ]
  },
  {
    id: '2',
    title: '静寂の森',
    slug: 'seijaku-no-mori',
    price: 120000,
    medium: 'アクリル・キャンバス',
    year_created: 2024,
    category: '絵画',
    width: 45,
    height: 33,
    is_available: true,
    is_featured: false,
    description: '森の奥深くで感じた静寂と神秘を表現した作品。',
    story: '深い森の中で体験した、言葉では表現できない静寂と神秘的な時間を作品にしました。',
    images: [
      { id: '3', url: '', alt: '静寂の森 メイン画像', is_primary: true },
    ]
  },
  // 他の作品データ...
]

export async function generateMetadata(props: ArtworkPageProps): Promise<Metadata> {
  const params = await props.params
  const artwork = dummyArtworks.find(a => a.slug === params.slug)
  
  if (!artwork) {
    return {
      title: '作品が見つかりません | Kari Gallery'
    }
  }
  
  return {
    title: `${artwork.title} | Kari Gallery`,
    description: artwork.description,
    openGraph: {
      title: artwork.title,
      description: artwork.description,
      type: 'article',
      images: [
        {
          url: '/placeholder-artwork.jpg', // 実際の画像URLに置き換え
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
  const artwork = dummyArtworks.find(a => a.slug === params.slug)
  
  if (!artwork) {
    notFound()
  }

  const additionalImages = artwork.images.filter(img => !img.is_primary)

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
            {/* メイン画像 */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-500 text-lg">作品画像</span>
              </div>
            </div>

            {/* 追加画像（ある場合） */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {additionalImages.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">詳細</span>
                    </div>
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
                <div className="flex items-center space-x-2">
                  <Ruler className="h-4 w-4" />
                  <span>{artwork.width} × {artwork.height} cm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{artwork.year_created}年制作</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>{artwork.category}</span>
                </div>
              </div>
            </div>

            {/* 作品説明 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">作品について</h2>
              <p className="text-gray-700 leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* アクションボタン */}
            <div className="space-y-4">
              {artwork.is_available ? (
                <div className="space-y-3">
                  <Button size="lg" className="w-full bg-gray-900 hover:bg-gray-800">
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
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-full py-3 px-4 bg-gray-100 rounded-md text-center text-gray-600 font-medium">
                    売約済み
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

            {/* 購入に関する注意事項 */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-gray-900">購入について</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• すべての作品は一点ものです</li>
                <li>• 安全な決済システムを使用しています</li>
                <li>• 作品は丁寧に梱包してお届けします</li>
                <li>• 配送料は別途お見積もりいたします</li>
              </ul>
              <Link href="/contact" className="inline-block text-sm text-blue-600 hover:text-blue-800">
                購入に関するお問い合わせ →
              </Link>
            </div>
          </div>
        </div>

        {/* 制作の物語セクション */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">制作の物語</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {artwork.story.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">作品詳細</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">作品番号</span>
                  <span className="font-medium">#{artwork.id.padStart(3, '0')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">サイズ</span>
                  <span className="font-medium">{artwork.width} × {artwork.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">技法・素材</span>
                  <span className="font-medium">{artwork.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">制作年</span>
                  <span className="font-medium">{artwork.year_created}年</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">カテゴリー</span>
                  <span className="font-medium">{artwork.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">状態</span>
                  <span className={`font-medium ${artwork.is_available ? 'text-green-600' : 'text-gray-600'}`}>
                    {artwork.is_available ? '販売中' : '売約済み'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">この作品に興味をお持ちですか？</h3>
              <p className="text-sm text-gray-600 mb-4">
                作品について詳しく知りたい方、購入をご検討の方は、お気軽にお問い合わせください。
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/contact">
                  お問い合わせ
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 関連作品セクション */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">関連作品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dummyArtworks
              .filter(a => a.id !== artwork.id && a.category === artwork.category)
              .slice(0, 3)
              .map((relatedArtwork) => (
                <Link
                  key={relatedArtwork.id}
                  href={`/artwork/${relatedArtwork.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">作品画像</span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedArtwork.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {relatedArtwork.medium} | {relatedArtwork.year_created}年
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ¥{relatedArtwork.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 