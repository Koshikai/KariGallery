# Stripe決済設定ガイド 💳

**最終更新**: 2025年1月10日  
**対象**: KariGallery プロジェクト - **Stripe決済機能完全実装済み**  
**状態**: ✅ **技術実装100%完了** → **アカウント設定待ち**

---

## 🎯 **概要**

KariGalleryでは、Stripeを使用した決済システムが**完全に実装済み**です。このガイドでは、Stripeアカウント作成から本番稼働まで、残りの設定手順を説明します。

### **✅ 実装済み機能**
- ✅ Stripe Checkout Session API実装
- ✅ Webhook処理実装（注文確定・データベース更新）
- ✅ カートとの完全連携
- ✅ 顧客情報収集フォーム
- ✅ エラーハンドリング・リダイレクト処理
- ✅ セキュリティ設定（署名検証等）

### **⏳ 残り設定**
- アカウント作成・APIキー取得
- 環境変数設定
- 本番テスト

---

## 🚀 **Phase 1: Stripeアカウント作成とテスト設定**

### **1. Stripeアカウント作成**

1. **[Stripe公式サイト](https://stripe.com/jp)**にアクセス
2. **「今すぐ始める」**をクリック
3. **アカウント情報入力**:
   - 事業タイプ: 個人事業主 or 法人
   - 事業者名: アーティスト名
   - 国: 日本
   - 業種: アート・芸術・創作活動

### **2. GitHub Student Developer Pack特典申請** 🎓

> **重要**: 学生の方は必ず申請！最初の$1,000まで決済手数料が免除されます。

1. **[GitHub Student Developer Pack](https://education.github.com/pack)**にアクセス
2. **学生認証**を完了
3. **Stripe特典**を申請
4. **Stripe Atlasクレジット**も同時に取得可能

### **3. テストモード設定**

StripeダッシュボードでAPIキーを取得：

1. **[Stripeダッシュボード](https://dashboard.stripe.com/)**にログイン
2. **左上の「テストデータを表示」**がONになっていることを確認
3. **開発者 → APIキー**へ移動
4. **必要なキーをコピー**:
   - 公開可能キー（`pk_test_...`）
   - 秘密鍵（`sk_test_...`）

---

## ⚙️ **Phase 2: 環境変数設定**

### **1. .env.localファイルに追加**

```bash
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here

# アプリケーションURL（本番時は実際のドメインに変更）
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### **2. 設定確認**

```bash
# 開発サーバー再起動
npm run dev

# http://localhost:3000/gallery で作品を確認
# 「カートに追加」→「チェックアウト」で決済テスト
```

---

## 🧪 **Phase 3: 決済テスト**

### **1. テストカード番号**

Stripe提供のテストカード番号を使用：

```
成功ケース:
カード番号: 4242 4242 4242 4242
有効期限: 任意の将来日付（例: 12/25）
CVC: 任意の3桁数字（例: 123）
郵便番号: 任意の番号

エラーテスト:
カード拒否: 4000 0000 0000 0002
残高不足: 4000 0000 0000 9995
```

### **2. 決済フロー確認**

1. **作品選択**: ギャラリーから作品を選ぶ
2. **カートに追加**: 「カートに追加」ボタン
3. **チェックアウト**: 配送先・決済情報入力
4. **決済完了**: Stripeページで決済実行
5. **成功ページ**: 注文確認ページ表示

---

## 🌐 **Phase 4: Webhook設定（注文管理用）**

### **1. Webhookエンドポイント作成**

Stripeダッシュボードで設定：

1. **開発者 → Webhooks**へ移動
2. **「エンドポイントを追加」**をクリック
3. **エンドポイントURL**:
   ```
   開発環境: http://localhost:3000/api/webhooks/stripe
   本番環境: https://your-domain.com/api/webhooks/stripe
   ```
4. **監視するイベント**を選択:
   - `checkout.session.completed`
   - `payment_intent.succeeded`

### **2. Webhook署名秘密鍵取得**

```bash
# .env.localに追加
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_here
```

---

## 💰 **Phase 5: 本番環境設定**

### **1. アカウント認証**

1. **事業者情報登録**:
   - 銀行口座情報
   - 身分証明書アップロード
   - 事業確認書類

2. **税務設定**:
   - 消費税設定
   - 源泉徴収設定

### **2. 本番APIキー切り替え**

```bash
# 本番環境用
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### **3. 決済手数料確認**

```
国内カード: 3.6%
国際カード: 3.9%
JCB: 3.95%

GitHub Student Pack特典:
最初の$1,000まで手数料無料！
```

---

## 📊 **Phase 6: 注文管理・追跡**

### **1. Stripeダッシュボード**

- **支払い状況確認**
- **返金処理**
- **顧客情報管理**
- **売上レポート**

### **2. アプリケーション内管理**

- Supabaseの`orders`テーブルで注文追跡
- 管理画面（将来実装）で注文ステータス更新

---

## 🛡️ **セキュリティ・ベストプラクティス**

### **1. API キー管理**

- ✅ 秘密鍵は絶対にフロントエンドで使用しない
- ✅ 公開可能キーのみクライアント側で使用
- ✅ 環境変数で管理、Gitにコミットしない

### **2. 決済セキュリティ**

- ✅ HTTPS必須（本番環境）
- ✅ Webhook署名検証実装済み
- ✅ PCI DSS準拠（Stripeが対応）

---

## 🚀 **次のステップ**

### **今すぐ実行**
1. **Stripeアカウント作成**
2. **テストキー取得・設定**
3. **決済テスト実行**

### **本番準備**
1. **GitHub Student Pack申請**
2. **事業者認証完了**
3. **本番キー切り替え**

---

## 💡 **トラブルシューティング**

### **よくあるエラー**

**1. "Invalid API Key"**
```bash
# 環境変数確認
echo $STRIPE_SECRET_KEY

# サーバー再起動
npm run dev
```

**2. "Webhook signature verification failed"**
```bash
# Webhook秘密鍵確認
echo $STRIPE_WEBHOOK_SECRET

# ngrok使用時は新しいURLで再設定
```

**3. 決済が完了しない**
- テストカード番号確認
- Stripe ダッシュボードでログ確認
- ブラウザの開発者ツールでエラー確認

---

## 📞 **サポート**

- **Stripe公式ドキュメント**: https://stripe.com/docs
- **GitHub Student Pack**: https://education.github.com/pack
- **コミュニティ**: Stack Overflow, Discord

---

**🎨 これでKariGalleryの決済システムが完成！**  
アートの販売を通じて、創作活動を持続可能なビジネスにしましょう。 