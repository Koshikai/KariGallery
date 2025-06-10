import { Metadata } from 'next'
import { Mail, Instagram, MapPin, Palette, Award, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'アーティストについて | Kari Gallery',
  description: 'アーティストの経歴、制作への想い、技法について詳しくご紹介。アートを通じて伝えたいメッセージとストーリー。',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* プロフィール画像 */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500 text-lg">アーティスト写真</span>
                </div>
              </div>
              {/* 装飾要素 */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-100 rounded-full opacity-50"></div>
            </div>

            {/* プロフィール情報 */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  草刈 壮
                  <span className="block text-xl lg:text-2xl font-normal text-gray-600 mt-2">
                    Sou Kusakari
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  心に響く瞬間を捉え、アートを通じて人々の生活に
                  特別な彩りを添えることを使命として活動している
                  現代アーティスト
                </p>
              </div>

              {/* 基本情報 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">東京都在住</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">1985年生まれ</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">多媒体アーティスト</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">15年の創作経験</span>
                </div>
              </div>

              {/* SNS・連絡先 */}
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:contact@karigallery.com" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    メール
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://instagram.com/smfl3247" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 制作への想いセクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">制作への想い</h2>
            <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
              <p>
                私にとってアートは、言葉では表現できない感情や瞬間を
                形にする手段です。日常の中で出会う小さな美しさや、
                心を動かされる瞬間を大切にし、それを作品として
                残すことで、見る人の心にも同じような感動を
                届けたいと願っています。
              </p>
              <p>
                特に、光と影の微妙な変化、季節の移ろい、
                人々の表情の中に宿る物語性に魅力を感じ、
                これらを独自の視点で解釈し、表現することを
                心がけています。
              </p>
              <p>
                作品を通じて、忙しい日常の中で忘れがちな
                「美しい瞬間」を思い出すきっかけを
                提供できれば幸いです。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 経歴セクション */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 学歴・経歴 */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">学歴・経歴</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2009年</h4>
                    <p className="text-gray-600">
                      東京藝術大学 美術学部 絵画科 卒業
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2011年</h4>
                    <p className="text-gray-600">
                      同大学院 美術研究科 修士課程 修了
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2012年〜</h4>
                    <p className="text-gray-600">
                      フリーランスアーティストとして活動開始
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-blue-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2018年</h4>
                    <p className="text-gray-600">
                      個人アトリエを東京に設立
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 主な展示・受賞歴 */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-900">主な展示・受賞歴</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2024年</h4>
                    <p className="text-gray-600">
                      「現代アート新潮流」グループ展（銀座）
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2023年</h4>
                    <p className="text-gray-600">
                      個展「静寂の中の色彩」（表参道ギャラリー）
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2022年</h4>
                    <p className="text-gray-600">
                      東京現代美術賞 優秀賞 受賞
                    </p>
                  </div>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">2021年</h4>
                    <p className="text-gray-600">
                      「四季をめぐる旅」個展（京都）
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技法・素材セクション */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-12">
            <h2 className="text-3xl font-bold text-gray-900">技法・使用素材</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <Palette className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">水彩画</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    透明感のある色彩と自然な滲みを活かし、
                    光の表現に特にこだわった作品を制作
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                    <Palette className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">油彩・アクリル</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    厚塗りとグラデーションを組み合わせ、
                    立体感と深みのある表現を追求
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto">
                    <Palette className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">版画・素描</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    繊細な線と面の構成により、
                    詩的で印象深い作品を表現
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              作品をご覧ください
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              これまでの経験と技術を込めて制作した作品の数々を
              ギャラリーでご紹介しています。
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Link href="/gallery">
                作品ギャラリーを見る
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/story">
                制作の物語を読む
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 