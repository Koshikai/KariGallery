import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Palette, Heart, Sparkles } from 'lucide-react'
import { getFeaturedArtworks, getPrimaryImageUrl } from '@/lib/supabase/services'
import type { ArtworkWithImages } from '@/types/database'

export default async function Home() {
  // 注目作品を取得（最大3件）
  const featuredArtworks = await getFeaturedArtworks(3)

  return (
    <div className="space-y-16">
      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                心に響く瞬間を
                <span className="block text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  アートで表現
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                日常の美しさや感動的な瞬間を捉えた一点ものの作品を通じて、
                アートと生活をつなぐ架け橋となることを目指しています。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
                <Link href="/gallery">
                  作品を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">
                  アーティストについて
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                アートを通じて伝えたいこと
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                すべての作品に込められた想いとこだわり
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Palette className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  独自の技法
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  長年の研究と実験を重ねて磨き上げた、
                  独自の表現技法で作品を制作しています。
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  心に響く作品
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  見る人の心に深く響き、日常に特別な彩りを
                  添える作品作りを心がけています。
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  一点ものの価値
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  すべての作品は世界に一つだけの貴重な一点もの。
                  その特別な価値をお届けします。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 注目作品セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">
                注目作品
              </h2>
              <p className="text-lg text-gray-600">
                特に注目していただきたい作品をご紹介
              </p>
            </div>

            {featuredArtworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredArtworks.map((artwork) => (
                  <FeaturedArtworkCard key={artwork.id} artwork={artwork} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">注目作品の準備中です。しばらくお待ちください。</p>
              </div>
            )}

            <div className="pt-8">
              <Button asChild variant="outline" size="lg">
                <Link href="/gallery">
                  すべての作品を見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              アートとの出会いを
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              あなたの空間に特別な彩りを添える、
              心に響く作品との出会いをお探しの方は、
              ぜひ作品ギャラリーをご覧ください。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Link href="/gallery">
                作品ギャラリーを見る
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">
                お問い合わせ
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

// 注目作品カードコンポーネント
function FeaturedArtworkCard({ artwork }: { artwork: ArtworkWithImages }) {
  const primaryImageUrl = getPrimaryImageUrl(artwork)
  
  return (
    <Link href={`/artwork/${artwork.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="aspect-square bg-gray-200 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full z-10">
            注目作品
          </div>
          {primaryImageUrl !== '/placeholder-artwork.jpg' ? (
            <img
              src={primaryImageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-gray-400">作品画像</span>
          )}
        </div>
        <div className="p-6 space-y-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600">
            {artwork.medium} | {artwork.year_created}年
          </p>
          <div className="flex justify-between items-center pt-2">
            <p className="text-lg font-bold text-gray-900">
              ¥{artwork.price.toLocaleString()}
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              販売中
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
