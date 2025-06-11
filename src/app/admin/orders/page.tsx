import { Package, Eye, FileText, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Order, OrderItem, Artwork } from '@/types/database'
import Link from 'next/link'

// 注文データに関連情報を含む型
type OrderWithItems = Order & {
  order_items: (OrderItem & {
    artworks: Artwork
  })[]
}

// 注文ステータスの日本語表示
const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return '保留中'
    case 'paid': return '支払い完了'
    case 'processing': return '処理中'
    case 'shipped': return '発送済み'
    case 'delivered': return '配送完了'
    case 'cancelled': return 'キャンセル'
    default: return status
  }
}

// 注文ステータスの色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'paid': return 'bg-blue-100 text-blue-800'
    case 'processing': return 'bg-purple-100 text-purple-800'
    case 'shipped': return 'bg-green-100 text-green-800'
    case 'delivered': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// 日付をフォーマット
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function getAllOrders(): Promise<OrderWithItems[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          artworks (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('注文一覧取得エラー:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('注文一覧取得エラー:', error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  // 統計情報を計算
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const shippedOrders = orders.filter(order => order.status === 'shipped').length

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">注文管理</h1>
          <p className="text-gray-600 mt-1">顧客からの注文を管理できます</p>
        </div>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総注文数</p>
              <p className="text-2xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総売上</p>
              <p className="text-2xl font-semibold text-gray-900">¥{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">保留中</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">発送済み</p>
              <p className="text-2xl font-semibold text-gray-900">{shippedOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 注文一覧 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">注文一覧</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">注文がまだありません</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注文番号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    顧客情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    商品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    金額
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注文日
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <OrderTableRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderTableRow({ order }: { order: OrderWithItems }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        #{order.id.slice(0, 8)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.customer_name}</div>
        <div className="text-sm text-gray-500">{order.customer_email}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {order.order_items.map((item, index) => (
            <div key={item.id}>
              {item.artworks.title} × {item.quantity}
              {index < order.order_items.length - 1 && <br />}
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ¥{order.total_amount.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(order.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link href={`/admin/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </td>
    </tr>
  )
} 