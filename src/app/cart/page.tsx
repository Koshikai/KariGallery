'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'

export default function CartPage() {  const { 
    items: cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalAmount
  } = useCartStore()

  // 計算
  const subtotal = getTotalAmount()
  const shippingFee = subtotal > 100000 ? 0 : 3000 // 10万円以上で送料無料
  const total = subtotal + shippingFee
  const isEmpty = cartItems.length === 0

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/gallery">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ギャラリーに戻る
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              カートが空です
            </h2>
            <p className="text-gray-600 mb-8">
              作品をカートに追加してください
            </p>
            <Button size="lg" asChild>
              <Link href="/gallery">
                作品を見る
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずナビ */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              ホーム
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">カート</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">ショッピングカート</h1>
            <Button variant="ghost" asChild>
              <Link href="/gallery">
                <ArrowLeft className="h-4 w-4 mr-2" />
                買い物を続ける
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">          {/* カート内容 */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.artwork.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* 作品画像 */}
                  <div className="flex-shrink-0">
                    <Link 
                      href={`/artwork/${item.artwork.slug}`}
                      className="block"
                    >
                      <div className="w-full sm:w-32 aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">作品画像</span>
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* 作品情報 */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Link 
                        href={`/artwork/${item.artwork.slug}`}
                        className="block"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {item.artwork.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600">
                        {item.artwork.medium} | {item.artwork.year_created}年
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* 価格と数量 */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-gray-900">
                          ¥{item.artwork.price.toLocaleString()}
                        </div>
                        
                        {/* 数量調整（通常は1点もの） */}
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">数量:</span>
                          <div className="flex items-center border border-gray-300 rounded-md">                            <button 
                              className="p-1 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button 
                              className="p-1 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity >= 1} // 通常は1点もの
                              onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>                      {/* 削除ボタン */}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeFromCart(item.artwork.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        削除
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 注文サマリー */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">注文サマリー</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>小計 ({cartItems.length}点)</span>
                  <span>¥{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>配送料</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600 font-medium">無料</span>
                    ) : (
                      `¥${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>

                {shippingFee === 0 && (
                  <p className="text-sm text-green-600">
                    ✓ 100,000円以上で送料無料
                  </p>
                )}
                
                <hr className="border-gray-200" />
                
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>合計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link href="/checkout">
                    レジに進む
                  </Link>
                </Button>
                
                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link href="/gallery">
                    買い物を続ける
                  </Link>
                </Button>
              </div>
            </div>

            {/* 購入ガイド */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">安心してお買い物いただけます</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  すべての作品は一点ものです
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  安全な決済システム（Stripe）
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  作品証明書付き
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  丁寧な梱包でお届け
                </li>
              </ul>
            </div>

            {/* お問い合わせ */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">ご質問がございますか？</h3>
              <p className="text-sm text-gray-600 mb-4">
                作品や購入について、お気軽にお問い合わせください。
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/contact">
                  お問い合わせ
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 最近見た作品（今後実装） */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">おすすめ作品</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* プレースホルダー */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">作品画像</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">おすすめ作品</h3>
                <p className="text-sm text-gray-600">¥XX,XXX</p>
              </div>
            </div>
            {/* 追加のプレースホルダー... */}
          </div>
        </div>
      </div>
    </div>
  )
} 