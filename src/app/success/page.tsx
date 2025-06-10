import Link from 'next/link'
import { CheckCircle, Download, Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// URLパラメータから注文情報を取得する予定（現在はダミーデータ）
const dummyOrderData = {
  orderNumber: 'KG-2024-001',
  orderDate: '2024年12月14日',
  totalAmount: 183000,
  shippingFee: 0,
  subtotal: 180000,
  items: [
    {
      id: '1',
      title: '夕暮れの街角',
      price: 85000,
      medium: '水彩・紙本',
      year_created: 2024,
    },
    {
      id: '2',
      title: '光の踊り',
      price: 95000,
      medium: '油彩・キャンバス',
      year_created: 2024,
    },
  ],
  shippingAddress: {
    name: '山田 太郎',
    email: 'example@email.com',
    phone: '090-1234-5678',
    address: '東京都渋谷区1-1-1 サンプルマンション101',
  },
  paymentMethod: 'クレジットカード',
  estimatedDelivery: '2024年12月28日〜2025年1月4日',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成功メッセージ */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ご注文ありがとうございます！
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ご注文を正常に受け付けました。確認メールを送信いたしましたので、ご確認ください。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 注文詳細 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">注文詳細</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">注文番号</span>
                <span className="font-medium text-gray-900">{dummyOrderData.orderNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">注文日</span>
                <span className="font-medium text-gray-900">{dummyOrderData.orderDate}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">お支払い方法</span>
                <span className="font-medium text-gray-900">{dummyOrderData.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">配送予定</span>
                <span className="font-medium text-gray-900">{dummyOrderData.estimatedDelivery}</span>
              </div>
            </div>

            {/* 注文内容 */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">ご購入作品</h3>
              <div className="space-y-4">
                {dummyOrderData.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-xs">画像</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">
                        {item.medium} | {item.year_created}年
                      </p>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ¥{item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 価格サマリー */}
              <div className="mt-6 space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>小計</span>
                  <span>¥{dummyOrderData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>配送料</span>
                  <span>
                    {dummyOrderData.shippingFee === 0 ? (
                      <span className="text-green-600 font-medium">無料</span>
                    ) : (
                      `¥${dummyOrderData.shippingFee.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>合計</span>
                  <span>¥{dummyOrderData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 配送・連絡先情報 */}
          <div className="space-y-6">
            {/* 配送先 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">配送先情報</h2>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">お名前</span>
                  <div className="font-medium text-gray-900">{dummyOrderData.shippingAddress.name}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">メールアドレス</span>
                  <div className="font-medium text-gray-900">{dummyOrderData.shippingAddress.email}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">電話番号</span>
                  <div className="font-medium text-gray-900">{dummyOrderData.shippingAddress.phone}</div>
                </div>
                
                <div>
                  <span className="text-gray-600">配送先住所</span>
                  <div className="font-medium text-gray-900">{dummyOrderData.shippingAddress.address}</div>
                </div>
              </div>
            </div>

            {/* 次のステップ */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">今後の流れ</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-medium">注文確認メール送信</div>
                    <div className="text-gray-600">ご注文内容の確認メールをお送りしました</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-medium">作品準備</div>
                    <div className="text-gray-600">作品の梱包・発送準備を行います（1-3営業日）</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-medium">発送通知</div>
                    <div className="text-gray-600">発送時に追跡番号をお知らせします</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    4
                  </div>
                  <div>
                    <div className="font-medium">お届け</div>
                    <div className="text-gray-600">{dummyOrderData.estimatedDelivery}頃にお届け予定</div>
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" asChild>
                <Link href="/">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  ホームに戻る
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/gallery">
                  他の作品を見る
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* サポート・お問い合わせ */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ご不明な点がございましたら
            </h2>
            <p className="text-gray-600 mb-6">
              ご注文や配送に関してご質問がございましたら、お気軽にお問い合わせください。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <span>contact@karigallery.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>03-1234-5678</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="outline" asChild>
                <Link href="/contact">
                  お問い合わせフォーム
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 作品証明書ダウンロード（将来実装） */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Download className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">作品証明書について</h3>
              <p className="text-sm text-gray-700">
                作品の発送時に、作品証明書（デジタル版）をメールでお送りいたします。
                また、実物の証明書も作品と一緒に同梱いたします。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 