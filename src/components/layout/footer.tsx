import Link from 'next/link'
import { Instagram, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ブランド情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Kari Gallery</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              心に響く瞬間を捉えた、一点ものの作品を通じて、
              アートと生活をつなぐ架け橋となることを目指しています。
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:contact@example.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="メール"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/smfl3247"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">ナビゲーション</h4>
            <nav className="space-y-2">
              <Link
                href="/gallery"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                作品ギャラリー
              </Link>
              <Link
                href="/about"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                アーティスト紹介
              </Link>
              <Link
                href="/story"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                制作の物語
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                お問い合わせ
              </Link>
            </nav>
          </div>

          {/* 購入について */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">購入について</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>すべての作品は一点ものです</p>
              <p>安全な決済システムを使用</p>
              <p>作品は丁寧に梱包してお届け</p>
              <Link
                href="/contact"
                className="inline-flex items-center text-gray-900 hover:text-gray-700 transition-colors"
              >
                購入に関するお問い合わせ
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Kari Gallery. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 