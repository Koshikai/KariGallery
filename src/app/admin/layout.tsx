import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ShoppingBag, Package, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 現在のパスを取得
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // ログインページの場合は認証チェックをスキップ
  if (pathname === '/admin/login') {
    return children
  }

  // 簡易認証チェック（実際の本番環境では、より強固な認証が必要）
  // ここでは開発用として、認証チェックを一時的に無効化
  const isAuthenticated = true // 開発用
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 管理画面ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                KariGallery 管理画面
              </h1>
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/admin/artworks"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>作品管理</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Package className="h-4 w-4" />
                  <span>注文管理</span>
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                管理者
              </span>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  サイトを見る
                </Button>
              </Link>
              <Link href="/admin/logout">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  ログアウト
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
} 