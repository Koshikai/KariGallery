'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, Package, Home, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
          <div className="px-4 py-3 space-y-3">
            <Link
              href="/admin/artworks"
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>作品管理</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              <Package className="h-5 w-5" />
              <span>注文管理</span>
            </Link>
            <div className="border-t border-gray-200 pt-3">
              <Link
                href="/"
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>サイトを見る</span>
              </Link>
              <Link
                href="/admin/logout"
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="h-5 w-5" />
                <span>ログアウト</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
