# Netlifyデプロイガイド 🚀

**最終更新**: 2025年1月21日  
**対象**: KariGallery プロジェクトのNetlifyデプロイ

---

## 🎯 **概要**

KariGalleryをNetlifyにデプロイして世界に公開するための完全ガイドです。シークレットスキャンエラーの対処法も含まれています。

---

## 📋 **前提条件**

### **必要なアカウント**
- [x] GitHubアカウント（プロジェクトリポジトリ）
- [ ] Netlifyアカウント（無料でOK）
- [x] Supabaseプロジェクト（既存）

### **準備完了確認**
- [x] ローカル開発サーバーが正常動作
- [x] Supabase画像表示が正常
- [x] 環境変数が`.env.local`に設定済み

---

## 🚀 **Step 1: Netlifyアカウント設定**

### **1.1 アカウント作成**
1. [Netlify](https://netlify.com)にアクセス
2. 「Sign up」をクリック
3. **GitHub連携でサインアップ**を選択（推奨）
4. GitHubアカウントでログイン・認証

### **1.2 プロジェクト接続**
1. Netlifyダッシュボードで「Add new site」
2. 「Import an existing project」を選択
3. **GitHub**を選択
4. **KariGallery**リポジトリを選択
5. 基本設定確認：
   ```
   Branch to deploy: main
   Build command: pnpm build
   Publish directory: .next
   ```

---

## 🔧 **Step 2: 環境変数設定**

### **2.1 Netlify環境変数設定**
1. Site settings → Environment variables
2. 以下の変数を追加：

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://yrssxfdcjujvysrzuydq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabaseANONキー

# Stripe設定（将来の販売機能用、現在は未設定でもOK）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **2.2 Supabaseキーの取得**
1. [Supabaseダッシュボード](https://supabase.com/dashboard)
2. KariGalleryプロジェクトを選択
3. Settings → API
4. **URL**と**anon public**キーをコピー

---

## 🛡️ **Step 3: シークレットスキャンエラー対処**

### **3.1 問題の理解**
Netlifyは `NEXT_PUBLIC_SUPABASE_ANON_KEY` をビルド出力で検出し、セキュリティエラーとして扱います。しかし、SupabaseのANONキーは**公開されることが前提**の設計です。

### **3.2 解決設定（既に実装済み）**
`netlify.toml`ファイルで除外設定済み：

```toml
[build.environment]
  SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  SECRETS_SCAN_OMIT_PATHS = ".next/cache/**,.netlify/**"
```

### **3.3 デプロイエラー時の対処法**
もしシークレットスキャンエラーが発生した場合：

1. **Site settings** → **Environment variables**
2. **Secrets scanning**セクションで：
   ```bash
   SECRETS_SCAN_ENABLED = false
   ```
   を追加（一時的な解決策）

---

## 🎨 **Step 4: 初回デプロイ実行**

### **4.1 デプロイトリガー**
1. Netlifyダッシュボードで「Deploy site」
2. または GitHubにプッシュすると自動デプロイ

### **4.2 デプロイ状況確認**
- **Building**: ビルド中（約2-3分）
- **Deploy successful**: デプロイ完了✅
- **Site live**: サイト公開中🎉

### **4.3 サイトURL確認**
デプロイ完了後、以下が取得できます：
```
https://incredible-art-gallery-123456.netlify.app
```

---

## ✅ **Step 5: 動作確認**

### **5.1 基本ページテスト**
本番サイトで以下を確認：

1. **ランディングページ**: `/` 
   - ヒーローセクション表示
   - 注目作品の画像表示

2. **ギャラリーページ**: `/gallery`
   - 全5作品の画像表示
   - 作品情報正常表示

3. **個別作品ページ**: `/artwork/[slug]`
   - 作品詳細表示
   - Supabase画像表示

4. **アバウトページ**: `/about`
   - アーティスト情報表示

### **5.2 Supabase接続確認**
- データベースからの作品データ取得
- 画像URLが正常に解決される
- エラーが発生していない

---

## 🔄 **Step 6: 継続的デプロイ設定**

### **6.1 自動デプロイ**
GitHubのmainブランチにプッシュすると自動デプロイされます：

```bash
git add .
git commit -m "作品画像を更新"
git push origin main
# → Netlifyが自動でデプロイ開始
```

### **6.2 プレビューデプロイ**
プルリクエスト作成時に自動でプレビューデプロイが作成されます。

---

## 🌐 **Step 7: カスタムドメイン設定（オプション）**

### **7.1 独自ドメイン設定**
1. Site settings → Domain management
2. 「Add custom domain」
3. ドメイン名を入力（例：`kari-gallery.com`）
4. DNS設定に従ってレコード追加

### **7.2 SSL証明書**
Netlifyが自動でSSL証明書を発行・設定します。

---

## 📊 **パフォーマンス最適化**

### **7.1 ビルド最適化設定**
```toml
[build]
  command = "pnpm build"
  publish = ".next"

[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true
```

### **7.2 キャッシュ戦略**
静的アセットのキャッシュ設定（`netlify.toml`で設定済み）：
- 画像: 24時間
- フォント: 1年間
- Next.js静的ファイル: 1年間

---

## 🛠️ **トラブルシューティング**

### **よくある問題と解決策**

**1. シークレットスキャンエラー**
```bash
# 解決済み：netlify.tomlで除外設定
SECRETS_SCAN_OMIT_KEYS = "NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

**2. ビルドエラー**
```bash
# 依存関係エラーの場合
npm install --legacy-peer-deps
pnpm install
```

**3. 画像が表示されない**
- Supabase環境変数を確認
- 画像URLが正しく設定されているか確認

**4. 404エラー**
```toml
# SPA用リダイレクト（設定済み）
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📈 **デプロイ後の分析・監視**

### **8.1 Netlify Analytics**
1. Site overview → Analytics
2. ページビュー・訪問者数確認
3. パフォーマンス指標監視

### **8.2 Lighthouse スコア確認**
デプロイ後、以下のスコアを確認：
- **Performance**: 90+
- **Accessibility**: 95+  
- **Best Practices**: 95+
- **SEO**: 90+

---

## 🎉 **デプロイ完了チェックリスト**

- [ ] Netlifyアカウント作成・GitHub連携
- [ ] 環境変数設定（Supabase）
- [ ] 初回デプロイ成功
- [ ] 全ページ動作確認
- [ ] Supabase画像表示確認
- [ ] 404エラーなし確認
- [ ] モバイル表示確認
- [ ] パフォーマンス確認
- [ ] カスタムドメイン設定（オプション）

---

**🚀 これでKariGalleryが世界に公開されました！**

美しいアートギャラリーサイトで、作品を世界中の人々に届けることができます。

### **📱 共有・宣伝**
- サイトURLをSNSでシェア
- アーティストのポートフォリオとして活用
- 作品の魅力を世界に発信

**おめでとうございます！プロフェッショナルなアートギャラリーサイトの完成です！** ✨ 