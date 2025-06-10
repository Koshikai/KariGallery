# **販売の実現：Stripe連携**

## **GitHub Student Developer Pack経由でのStripe有効化**

### **特典内容の理解**

GitHub Student Developer Packには、Stripeで処理される最初の$1000の収益に対する取引手数料が免除される特典が含まれています。これは、アート販売の初期段階における直接的なコスト削減につながります。

### **Stripeへのアクセスと設定**

GitHub Educationポータルを通じて特典を申請する方法と、Stripeアカウントの基本的な設定手順（テストモードの有効化など）について説明します。APIキー（公開可能キーとシークレットキー）を取得し、環境変数として安全に保存します。

## **Next.jsアプリケーションへのStripe Checkout実装**

### **連携方法の選択**

シンプルさとPCIコンプライアンスの観点から、Stripe Checkout（Stripeホスト型ページ）の利用が推奨されます。

### **フロントエンドの実装**

1. Stripe.js (`@stripe/stripe-js`) をインストールします
2. チェックアウトボタンを作成し、クリック時にNext.jsのAPIルートを呼び出してStripe Checkoutセッションを作成するようにします
3. 取得したセッションIDを使用して `redirectToCheckout` を呼び出し、ユーザーをStripeの決済ページにリダイレクトさせます

### **Checkoutセッション作成のためのバックエンドAPIルート**

1. Stripe Node.jsライブラリ (`stripe`) をインストールします
2. APIルート（例：`/api/create-checkout-session`）を作成します
3. このルートはStripeシークレットキーを使用してStripe APIと通信します
4. 以下の要素を定義します：
   - カート内のアート作品に基づいた `line_items`
   - `payment_method_types`
   - 一回限りの購入のための `mode: 'payment'`
   - `success_url` / `cancel_url`

`success_url` は、注文確認ページを指し、検証のためにセッションIDを渡すことができます。

## **Stripe WebhookとSupabaseによる購入後処理の自動化**

### **Webhookの重要性**

Webhookを使用すると、Stripeはイベント（例：`checkout.session.completed`、`payment_intent.succeeded`）に関するリアルタイム通知をアプリケーションに送信できます。これは、Supabaseデータベースの更新（例：注文を支払い済みとしてマークする、在庫を減らす、ユーザー権限を作成する）に不可欠です。

### **Stripe Webhookエンドポイントの設定**

1. Stripeダッシュボードで、新しいNext.js APIルート（例：`/api/stripe-webhooks`）を指すWebhookエンドポイントを追加します
2. リッスンするイベント（例：`checkout.session.completed`）を選択します
3. Webhook署名シークレットを取得し、環境変数として保存します

**重要**：Webhook署名の検証は譲れないポイントです。これがないと、悪意のある第三者が偽のWebhookイベントをエンドポイントに送信し、不正な注文処理やデータ破損につながる可能性があります。

### **Next.js APIルート（またはSupabase Edge Function）でのWebhook処理**

APIルートは以下の処理を行います：

1. **署名検証**: 署名シークレットを使用してWebhook署名を検証します
2. **イベント解析**: イベントデータを解析します
3. **`checkout.session.completed` イベントの処理**:
   - セッション詳細を取得します
   - 関連情報（顧客詳細、購入商品、決済インテントID）を抽出します
   - Supabaseの `orders` および `order_items` テーブルにレコードを作成/更新します
   - （オプション）確認メールの送信など、他のアクションをトリガーします

Supabase Edge Functions は、Webhook処理をデータベースに近い場所で実行したい場合に、Next.js APIルートの代替となります。

### **べき等性の考慮**

ネットワークの問題によりStripeがWebhookの送信を再試行することがあります。そのため、ハンドラロジックはべき等であるべきです。つまり、同じイベントを複数回処理しても、重複したアクション（例：同じ支払いに対して複数の注文を作成する）が発生しないようにする必要があります。これは、新しい注文を作成する前に、指定された `stripe_payment_intent_id` を持つ注文が既に存在するかどうかを確認することで達成できます。

データベーススキーマ（[architecture.md](./architecture.md)参照）には、`order_items`に`price_at_purchase`が含まれています。商品価格は変動する可能性があるため、これは非常に重要です。取引時の価格を保存することで、過去の注文金額の正確性が保証され、返金や紛争処理が簡素化されます。

## **実装例の構造**

### **基本的なワークフロー**

1. **ユーザーアクション**: ユーザーが「購入」ボタンをクリック
2. **セッション作成**: Next.js APIルートがStripe Checkoutセッションを作成
3. **決済処理**: ユーザーがStripeの決済ページで支払いを完了
4. **Webhook通知**: StripeがWebhookイベントを送信
5. **データベース更新**: WebhookハンドラがSupabaseの注文テーブルを更新
6. **注文完了**: ユーザーが成功ページにリダイレクト

### **セキュリティ考慮事項**

- **環境変数**: すべてのAPIキーとシークレットを環境変数で管理
- **Webhook署名**: 必ずWebhook署名を検証
- **HTTPS**: 本番環境では必ずHTTPSを使用
- **RLS**: Supabaseの行レベルセキュリティを適切に設定

この実装により、安全で信頼性の高い決済システムを構築できます。

---

## **Next.js 15対応の注意点**

### **非同期API対応**

Next.js 15では、以下のAPIが非同期化されています：

```typescript
// Before (Next.js 14)
import { headers } from 'next/headers'
const headersList = headers()

// After (Next.js 15)
import { headers } from 'next/headers'
const headersList = await headers()
```

Stripe Webhook処理時のヘッダー取得でも`await`が必要になります。

### **キャッシュ制御**

Route HandlersのGETメソッドはデフォルトでキャッシュされなくなったため、Webhook エンドポイントは影響ありませんが、関連するAPIルートで必要に応じて`export const dynamic = 'force-static'`を使用してください。

---

## **更新履歴**

- 2025/06/11: Next.js 15対応の注意点追加、最新のStripe統合情報を確認
