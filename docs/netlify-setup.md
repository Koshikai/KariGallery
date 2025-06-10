# Netlify環境変数設定ガイド

## 概要
KariGalleryをNetlifyにデプロイする際に設定する必要のある環境変数一覧です。

## 必須環境変数

### **Supabase設定**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **Stripe設定**
```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

### **Next.js設定**
```
NEXTAUTH_URL=https://your-site.netlify.app
NEXTAUTH_SECRET=your_secure_nextauth_secret
```

### **管理者設定**
```
ADMIN_EMAIL=your_admin_email@example.com
```

### **Netlify固有設定**
```
NETLIFY_NEXT_PLUGIN_SKIP=false
NODE_VERSION=18.17.0
```

## Netlify UIでの設定手順

### **1. サイト設定ページにアクセス**
1. Netlify ダッシュボードでサイトを選択
2. 「Site settings」→「Environment variables」に移動

### **2. 環境変数を個別に追加**
各環境変数を以下の形式で追加：
- **Key**: 変数名（例：`NEXT_PUBLIC_SUPABASE_URL`）
- **Value**: 値（例：`https://yourproject.supabase.co`）
- **Scopes**: `All scopes` を選択（本番・プレビュー両方で使用）

### **3. 機密情報の扱い**
- `STRIPE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` 
- `NEXTAUTH_SECRET`
- `STRIPE_WEBHOOK_SECRET`

これらは必ずNetlify UIで設定し、ソースコードには含めないでください。

## デプロイ時の確認事項

### **ビルド設定**
- **Build command**: `pnpm build`
- **Publish directory**: `.next`
- **Node.js version**: `18.17.0` 以上

### **ドメイン設定**
本番デプロイ後、以下を更新：
- `NEXTAUTH_URL`: 実際のNetlifyドメインに変更
- Stripe webhook URL: `https://your-site.netlify.app/api/webhooks/stripe`

### **Webhook設定**
Stripeのwebhook endpointを設定：
1. Stripe ダッシュボード→「Webhooks」
2. エンドポイント追加：`https://your-site.netlify.app/api/webhooks/stripe`
3. イベント選択：`checkout.session.completed`

## トラブルシューティング

### **よくある問題**

#### **1. ビルドエラー：環境変数が見つからない**
```
Error: Environment variable NEXT_PUBLIC_SUPABASE_URL is not defined
```
**解決方法**: Netlify UIで該当する環境変数が正しく設定されているか確認

#### **2. API ルートエラー：500 Internal Server Error**
**解決方法**: サーバーサイド環境変数（`STRIPE_SECRET_KEY`等）がNetlify UIで設定されているか確認

#### **3. Stripe webhook検証エラー**
**解決方法**: `STRIPE_WEBHOOK_SECRET`がNetlifyのwebhook URLと一致しているか確認

### **デバッグ方法**
1. Netlify Functions ログを確認
2. ブラウザの開発者ツールでネットワークエラーを確認
3. Stripeダッシュボードでwebhookの配信状況を確認

## セキュリティ考慮事項

### **公開される環境変数**
`NEXT_PUBLIC_` プレフィックスの変数は全てクライアントサイドで公開されます：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### **秘匿情報**
以下の変数は絶対にクライアントサイドに露出させないでください：
- `STRIPE_SECRET_KEY`（サーバーサイドのみ）
- `SUPABASE_SERVICE_ROLE_KEY`（サーバーサイドのみ）
- `NEXTAUTH_SECRET`（サーバーサイドのみ）

## 最終チェックリスト

- [ ] 全ての環境変数がNetlify UIで設定済み
- [ ] `NEXTAUTH_URL`が本番ドメインに設定済み
- [ ] Stripe webhookエンドポイントが本番URLに設定済み
- [ ] ビルドが成功することを確認
- [ ] テスト購入フローが動作することを確認
- [ ] SSL証明書が有効であることを確認
