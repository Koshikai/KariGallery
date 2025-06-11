'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar } from 'lucide-react'
import Link from 'next/link'

// 簡単なUIコンポーネント
const Card = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white rounded-lg shadow border ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pb-4 ${className}`} {...props} />
)

const CardTitle = ({ className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`} {...props} />
)

const CardContent = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
)

const Badge = ({ variant = 'default', className = '', children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'pending' | 'shipped' | 'delivered' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800'
  }
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: {
    postal_code: string
    prefecture: string
    city: string
    address: string
    building?: string
  }
  total_amount: number
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

interface OrderItem {
  id: string
  artwork_id: string
  quantity: number
  unit_price: number
  total_price: number
  artwork: {
    title: string
    slug: string
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // 仮のデータを設定（実際の実装では API から取得）
    const loadOrder = async () => {
      try {
        setIsLoading(true)
        
        // TODO: 実際のAPIから注文データを取得
        const mockOrder: Order = {
          id: orderId,
          customer_name: '山田太郎',
          customer_email: 'yamada@example.com',
          customer_phone: '090-1234-5678',
          shipping_address: {
            postal_code: '100-0001',
            prefecture: '東京都',
            city: '千代田区',
            address: '丸の内1-1-1',
            building: 'サンプルビル101'
          },
          total_amount: 150000,
          status: 'pending',
          notes: '丁寧な梱包をお願いします',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        }

        const mockOrderItems: OrderItem[] = [
          {
            id: '1',
            artwork_id: 'artwork-1',
            quantity: 1,
            unit_price: 150000,
            total_price: 150000,
            artwork: {
              title: '夕暮れの風景',
              slug: 'sunset-landscape'
            }
          }
        ]

        setOrder(mockOrder)
        setOrderItems(mockOrderItems)
      } catch (error) {
        setError('注文情報の読み込みに失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      loadOrder()
    }
  }, [orderId])

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'pending'
      case 'shipped': return 'shipped'
      case 'delivered': return 'delivered'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '入金待ち'
      case 'shipped': return '発送済み'
      case 'delivered': return '配送完了'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>注文情報を読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">注文が見つかりません</h1>
          <Link href="/admin/orders">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              注文一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/admin/orders">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              注文一覧に戻る
            </Button>
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">注文詳細</h1>
              <p className="mt-2 text-gray-600">注文ID: {order.id}</p>
            </div>
            <Badge variant={getStatusVariant(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左カラム：顧客情報・配送先 */}
          <div className="space-y-6">
            {/* 顧客情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  顧客情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">お名前</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">メールアドレス</p>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600">電話番号</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 配送先情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  配送先
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">〒{order.shipping_address.postal_code}</p>
                  <p className="font-medium">
                    {order.shipping_address.prefecture}
                    {order.shipping_address.city}
                    {order.shipping_address.address}
                  </p>
                  {order.shipping_address.building && (
                    <p className="font-medium">{order.shipping_address.building}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 注文情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  注文情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">注文日時</p>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">最終更新</p>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-600">備考</p>
                    <p className="font-medium">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 右カラム：注文内容・支払い情報 */}
          <div className="space-y-6">
            {/* 注文内容 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  注文内容
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <h4 className="font-medium">{item.artwork.title}</h4>
                        <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">¥{item.total_price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">@¥{item.unit_price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 支払い情報 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  支払い情報
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">小計</span>
                    <span>¥{order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">送料</span>
                    <span>¥0</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>合計</span>
                    <span>¥{order.total_amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* アクション */}
            <div className="space-y-3">
              <Button className="w-full">
                ステータスを更新
              </Button>
              <Button variant="outline" className="w-full">
                注文内容を編集
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 