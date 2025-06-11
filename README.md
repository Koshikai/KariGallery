# KariGallery - プロフェッショナルアート作品販売サイト ✨

**状態**: ✅ **Phase 1 MVP完成 + Phase 2 管理機能85%完了**  
**技術**: Next.js 15 + Supabase + Netlify + Stripe - **本格的アートギャラリー管理システム**

## 🎉 完成済み機能

### **🛒 ECサイト機能**
- **ショッピングカート** - Zustandストア完全統合
- **Stripe決済システム** - チェックアウト・Webhook完全実装
- **作品詳細からカート追加** - 即座に購入可能
- **カート管理** - 数量変更・削除・リアルタイム更新
- **注文処理フロー** - 顧客情報収集・決済・確認ページ

### **🎨 アートギャラリー**
- **美しいポートフォリオ** - 作品一覧・詳細ページ
- **レスポンシブデザイン** - モバイル・タブレット・デスクトップ対応
- **実データ表示** - Supabaseから作品情報を動的取得
- **高品質画像表示** - 最適化・エラーハンドリング完備

### **🔧 管理システム** ⭐ **NEW!**
- **🖼️ 高機能画像アップロード** - ドラッグ&ドロップ・複数ファイル対応
- **📈 作品管理ダッシュボード** - CRUD操作・統計情報表示
- **📋 注文管理システム** - 詳細表示・ステータス管理
- **🔐 認証システム** - 管理者ログイン・セキュリティ
- **📊 統計情報** - 売上・在庫・注文状況の可視化

### **⚡ 技術的完成度**
- **TypeScriptエラー0件** - 完全な型安全性
- **ESLintエラー0件** - クリーンなコード
- **Hydrationエラー解決** - 安定したクライアント動作
- **本番ビルド成功** - 18ページ静的生成・最適化完了

## 🚀 技術スタック

### フロントエンド
- **Next.js 15** (App Router + React 19)
- **TypeScript** (完全型安全)
- **shadcn/ui v2** + Tailwind CSS
- **Zustand** (カート状態管理)
- **React Hook Form** + Zod (フォーム)

### バックエンド・インフラ
- **Supabase** (Database, Auth, Storage) - 実装済み
- **Netlify** (Hosting + Edge Functions)
- **Stripe** (Payment) - **完全実装済み**
- **Netlify Image CDN** (画像最適化)

## 📦 セットアップ

### 1. プロジェクトクローン
```bash
git clone https://github.com/your-username/kari-gallery.git
cd kari-gallery
```

### 2. 依存関係インストール（pnpm推奨）
```bash
pnpm install
```

### 3. 環境変数設定
```bash
cp env.example .env.local
```

`.env.local`を編集してSupabaseキーを設定してください（Stripe設定は後で追加）。

### 4. 開発サーバー起動
```bash
pnpm dev
```

http://localhost:3000 でアクセス可能

### 5. 本番ビルド・テスト
```bash
pnpm build    # 静的生成・最適化
pnpm lint     # ESLintチェック
```

## 🛒 完成した購入フロー

### **実際の購入体験**（全て実装済み）
1. **作品詳細ページ** → 「カートに追加」ボタン
2. **カートページ** → 数量変更・削除・合計確認
3. **チェックアウトページ** → 顧客情報・決済方法選択
4. **Stripe決済** → セキュアな決済処理
5. **成功ページ** → 注文確認・フォローアップ

### **管理システム**（自動処理）
- **注文データ** → Supabaseに自動保存
- **Webhook処理** → 決済完了時の自動処理
- **エラーハンドリング** → 決済失敗時の適切な対応

## 🚀 本番運用への準備

### **次に必要な設定**
1. **Stripeアカウント作成** → [設定ガイド](./docs/stripe-setup-guide.md)
2. **Netlify本番デプロイ** → [デプロイガイド](./docs/netlify-deployment-guide.md)

### **現在の状態**
- ✅ **技術実装** - 100%完了
- ⏳ **サービス設定** - アカウント・APIキー取得待ち
- ⏳ **本番デプロイ** - 環境変数設定・初回デプロイ待ち

## 🛠️ Next.js 15対応

このプロジェクトはNext.js 15の新機能に完全対応しています：

### 主要な変更点
- `params`, `searchParams`, `headers()`, `cookies()`のPromise化
- Route Handlersとfetchのキャッシュデフォルト変更
- React 19の新機能活用

### 実装例
```typescript
// ✅ Next.js 15対応
export default async function Page(props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { slug } = params
}

// Headers/Cookies
import { headers, cookies } from 'next/headers'
export default async function Component() {
  const headersList = await headers()
  const cookieStore = await cookies()
}
```

## 📁 プロジェクト構造

```
src/
├── app/                    # App Router
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx          # ホームページ
│   ├── about/            # アーティスト紹介
│   ├── gallery/          # 作品一覧
│   ├── artwork/[slug]/   # 個別作品ページ
│   └── api/              # API Routes
├── components/           # 再利用可能コンポーネント
│   └── ui/              # shadcn/ui components
├── lib/                 # ユーティリティ・設定
└── types/               # TypeScript型定義
```

## 🎯 開発フェーズ

### Phase 1: MVP ✅
- [x] Next.js 15プロジェクト初期化
- [x] 基本設定（TypeScript, Tailwind, shadcn/ui）
- [x] pnpm対応
- [ ] ランディングページ
- [ ] Supabase設定
- [ ] 基本認証

### Phase 2: コア機能
- [ ] アーティスト紹介ページ
- [ ] 作品ギャラリー
- [ ] 個別作品ページ
- [ ] カート機能
- [ ] Stripe決済

### Phase 3: 管理機能
- [ ] 管理画面
- [ ] 作品管理
- [ ] 注文管理

## 🔧 コマンド

```bash
# 開発
pnpm dev

# ビルド
pnpm build

# 本番起動
pnpm start

# 型チェック
pnpm type-check

# リント・フォーマット
pnpm lint
pnpm format
```

## 🌐 デプロイ (Netlify)

### 自動デプロイ設定
1. NetlifyでGitリポジトリを接続
2. Build Command: `pnpm build`
3. Publish Directory: `.next`
4. 環境変数を設定

### 手動デプロイ
```bash
pnpm build
# .nextフォルダをNetlifyにアップロード
```

## 📚 ドキュメント

詳細な要件定義と技術仕様は [`requirements.md`](./requirements.md) を参照してください。

## 🤝 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

This project is licensed under the MIT License.

## 📞 お問い合わせ

プロジェクトに関するご質問やサポートが必要でしたら、Issueを作成してください。
