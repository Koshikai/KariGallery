import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Stripeクライアントの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Webhookエンドポイント署名検証
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    // Stripe署名検証
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // イベント処理
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// チェックアウト完了処理
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // メタデータから注文情報を取得
    const customerName = session.metadata?.customerName || 'Unknown'
    const customerPhone = session.metadata?.customerPhone || ''
    const orderItems = session.metadata?.orderItems ? JSON.parse(session.metadata.orderItems) : []

    // 注文レコードをデータベースに保存
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        customer_email: session.customer_details?.email || session.customer_email,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: JSON.stringify(session.shipping_details?.address),
        total_amount: session.amount_total || 0,
        currency: session.currency || 'jpy',
        payment_status: session.payment_status,
        order_status: 'confirmed',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation failed:', orderError)
      return
    }    // 注文アイテムを保存
    if (orderItems.length > 0) {
      const orderItemsData = orderItems.map((item: { artworkId: string; title: string; price: number; quantity: number }) => ({
        order_id: order.id,
        artwork_id: item.artworkId,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData)

      if (itemsError) {
        console.error('Order items creation failed:', itemsError)
      }
    }

    console.log('Order successfully processed:', order.id)

  } catch (error) {
    console.error('Error processing checkout completion:', error)
  }
}

// その他のHTTPメソッドは許可しない
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
