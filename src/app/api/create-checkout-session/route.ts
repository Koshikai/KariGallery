import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

// Stripeクライアントの初期化（環境変数から秘密鍵を取得）
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

interface CartItem {
  artwork: {
    id: string
    title: string
    price: number
    medium: string
    year_created: number
  }
  quantity: number
}

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerInfo }: { items: CartItem[], customerInfo: CustomerInfo } = await request.json()

    // Stripe Checkoutセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: item.artwork.title,
            description: `${item.artwork.medium} | ${item.artwork.year_created}年`,
            // images: [item.artwork.images[0]?.url], // 実際の画像URLを設定
          },
          unit_amount: item.artwork.price, // JPYなので円単位
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: customerInfo.email,
      shipping_address_collection: {
        allowed_countries: ['JP'],
      },
      metadata: {
        // 注文情報を保存（後でWebhookで使用）
        customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
        customerPhone: customerInfo.phone,
        orderItems: JSON.stringify(items.map((item: CartItem) => ({
          artworkId: item.artwork.id,
          title: item.artwork.title,
          price: item.artwork.price,
          quantity: item.quantity,
        }))),
      },
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error) {
    console.error('Stripe checkout session creation failed:', error)
    return NextResponse.json(
      { error: 'チェックアウトセッションの作成に失敗しました' },
      { status: 500 }
    )
  }
}

// GET methodは使用しないが、エラー回避のため追加
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
} 