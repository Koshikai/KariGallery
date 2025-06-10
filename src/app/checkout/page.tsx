'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, User, MapPin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ダミーカートデータ（後でZustandストアから取得）
const dummyCartItems = [
  {
    id: '1',
    artwork: {
      id: '1',
      title: '夕暮れの街角',
      slug: 'yuugure-no-machikado',
      price: 85000,
      medium: '水彩・紙本',
      year_created: 2024,
    },
    quantity: 1,
  },
  {
    id: '2',
    artwork: {
      id: '4',
      title: '光の踊り',
      slug: 'hikari-no-odori',
      price: 95000,
      medium: '油彩・キャンバス',
      year_created: 2024,
    },
    quantity: 1,
  },
]

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [isProcessing, setIsProcessing] = useState(false)

  // 計算
  const subtotal = dummyCartItems.reduce((sum, item) => sum + (item.artwork.price * item.quantity), 0)
  const shippingFee = subtotal > 100000 ? 0 : 3000
  const total = subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    // 決済処理のシミュレーション
    setTimeout(() => {
      setIsProcessing(false)
      // 実際はStripe Checkoutにリダイレクト
      alert('Stripe決済画面に遷移します（実装予定）')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずナビ */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/" className="text-gray-500 hover:text-gray-900">
              ホーム
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/cart" className="text-gray-500 hover:text-gray-900">
              カート
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">チェックアウト</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">お支払い</h1>
            <Button variant="ghost" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                カートに戻る
              </Link>
            </Button>
          </div>
        </div>

        {/* セキュリティ表示 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <Lock className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">安全な決済</span>
            <span className="text-green-700 ml-2">256bit SSL暗号化通信で保護されています</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 左側: 配送・決済情報入力 */}
          <div className="space-y-8">
            {/* 配送先情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">配送先情報</h2>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      お名前（姓）*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="山田"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      お名前（名）*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="太郎"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="090-1234-5678"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      郵便番号*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="prefecture" className="block text-sm font-medium text-gray-700 mb-1">
                      都道府県*
                    </label>
                    <select
                      id="prefecture"
                      name="prefecture"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="tokyo">東京都</option>
                      <option value="osaka">大阪府</option>
                      <option value="kyoto">京都府</option>
                      <option value="kanagawa">神奈川県</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    市区町村*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="渋谷区"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    番地・建物名*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1-1-1 サンプルマンション101"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    配送に関するご要望（任意）
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="配送時間のご希望などがございましたらご記入ください"
                  />
                </div>
              </form>
            </div>

            {/* 決済方法 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">お支払い方法</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">クレジットカード</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          MC
                        </div>
                        <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          JCB
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Stripe決済で安全にお支払いいただけます
                    </p>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="bank" className="flex-1 cursor-pointer">
                    <div className="font-medium text-gray-900">銀行振込</div>
                    <p className="text-sm text-gray-600 mt-1">
                      ご注文確定後、振込先をご案内いたします
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* 注意事項・利用規約 */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">ご注文前にご確認ください</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5 mr-3"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                      利用規約
                    </Link>
                    および
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                      プライバシーポリシー
                    </Link>
                    に同意する*
                  </label>
                </div>
                
                <ul className="space-y-1 ml-7">
                  <li>• すべての作品は一点ものです</li>
                  <li>• 商品の性質上、返品・交換はお受けできません</li>
                  <li>• 配送には1-2週間程度お時間をいただきます</li>
                  <li>• 作品には作家の署名と作品証明書が付属します</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 右側: 注文サマリー */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">注文内容</h2>
              
              {/* カート内容 */}
              <div className="space-y-4 mb-6">
                {dummyCartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">画像</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.artwork.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.artwork.medium} | {item.artwork.year_created}年
                      </p>
                      <p className="text-sm text-gray-600">
                        数量: {item.quantity}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ¥{item.artwork.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 価格サマリー */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>小計</span>
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
                
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>合計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
              </div>

              {/* 注文ボタン */}
              <form onSubmit={handleSubmit} className="mt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      処理中...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      注文を確定する
                    </div>
                  )}
                </Button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-3">
                注文確定後、決済画面に移動します
              </p>
            </div>

            {/* サポート情報 */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <User className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">サポート</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                ご注文やお支払いに関してご不明な点がございましたら、お気軽にお問い合わせください。
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>contact@karigallery.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>03-1234-5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 