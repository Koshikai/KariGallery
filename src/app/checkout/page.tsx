'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Lock, MapPin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { loadStripe } from '@stripe/stripe-js'

// Stripeの初期化
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { items: cartItems } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  // 計算
  const subtotal = cartItems.reduce((sum, item) => sum + (item.artwork.price * item.quantity), 0)
  const shippingFee = subtotal > 100000 ? 0 : 3000
  const total = subtotal + shippingFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // 入力バリデーション
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email) {
        alert('必須項目を入力してください')
        setIsProcessing(false)
        return
      }

      if (cartItems.length === 0) {
        alert('カートが空です')
        setIsProcessing(false)
        return
      }

      // Stripe Checkoutセッションを作成
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          customerInfo,
        }),
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('決済セッションの作成に失敗しました')
      }

      // Stripe Checkoutページにリダイレクト
      const stripe = await stripePromise
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          console.error('Stripe redirect error:', error)
          alert('決済ページへの移動に失敗しました')
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('決済処理でエラーが発生しました')
    } finally {
      setIsProcessing(false)
    }
  }

  // カートが空の場合の表示
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">カートが空です</h1>
          <p className="text-gray-600 mb-8">お気に入りの作品を選んでカートに追加してください。</p>
          <Button asChild>
            <Link href="/gallery">ギャラリーを見る</Link>
          </Button>
        </div>
      </div>
    )
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

              <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
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
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
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
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="090-1234-5678"
                  />
                </div>

                {/* 支払い方法選択 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">お支払い方法</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="card" className="ml-3 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        クレジットカード（推奨）
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bank"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'card' | 'bank')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="bank" className="ml-3">
                        銀行振込（お振込み確認後の発送となります）
                      </label>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Lock className="inline h-4 w-4 mr-1" />
                        Stripe決済システムにより安全に処理されます
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800 mb-2">
                        <strong>お振込み先:</strong>
                      </p>
                      <div className="text-sm text-yellow-800">
                        <p>銀行名: 〇〇銀行</p>
                        <p>支店名: 〇〇支店</p>
                        <p>口座番号: 普通 1234567</p>
                        <p>口座名義: ヤマダ カリ</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 利用規約 */}
                <div className="bg-gray-50 rounded-lg p-4 mt-8">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                      <Link href="/terms" className="text-blue-600 hover:text-blue-800 underline">
                        利用規約
                      </Link>
                      および
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                        プライバシーポリシー
                      </Link>
                      に同意します
                    </label>
                  </div>
                </div>

                {/* 送信ボタン */}
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 text-lg font-semibold mt-6"
                >
                  {isProcessing ? (
                    <>処理中...</>
                  ) : paymentMethod === 'card' ? (
                    <>決済に進む</>
                  ) : (
                    <>注文を確定する</>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* 右側: 注文サマリー */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">注文内容</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.artwork.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                      {/* 作品画像のプレースホルダー */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-md"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.artwork.title}</h3>
                      <p className="text-sm text-gray-500">{item.artwork.medium} | {item.artwork.year_created}年</p>
                      <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">¥{(item.artwork.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>小計</span>
                  <span>¥{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600">無料</span>
                    ) : (
                      `¥${shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                {shippingFee === 0 && (
                  <p className="text-xs text-green-600">10万円以上のご購入で送料無料</p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>合計</span>
                  <span>¥{total.toLocaleString()}</span>
                </div>
              </div>

              {/* 購入ガイド */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">ご購入について</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 作品は丁寧に梱包してお届けします</li>
                  <li>• 配送には1-2週間程度かかります</li>
                  <li>• 作品に関するご質問はお気軽にお問い合わせください</li>
                </ul>
              </div>

              {/* お問い合わせ */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-2">ご不明点がございましたら</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    お問い合わせ
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}