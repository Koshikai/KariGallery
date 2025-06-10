# KariGallery - アート作品販売サイト

Next.js 15 + Supabase + Netlify + Stripeを使用したアーティスト個人向け作品販売・ポートフォリオサイト

## 🎨 特徴

- **Next.js 15 + React 19**: 最新のApp Router、Server Components
- **美しいUI**: shadcn/ui + Tailwind CSSによるミニマルデザイン
- **完全TypeScript**: 型安全性を重視した開発
- **Netlify最適化**: OpenNext adapterによる自動最適化
- **アート特化**: 作品の物語性を重視したUX

## 🚀 技術スタック

### フロントエンド
- **Next.js 15** (App Router + React 19)
- **TypeScript**
- **shadcn/ui v2** + Tailwind CSS
- **Zustand** (状態管理)
- **React Hook Form** + Zod (フォーム)

### バックエンド・インフラ
- **Supabase** (Database, Auth, Storage)
- **Netlify** (Hosting + Edge Functions)
- **Stripe** (Payment)
- **Netlify Image CDN** (画像最適化)

## 📦 インストール

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

`.env.local`を編集して各サービスのキーを設定してください。

### 4. 開発サーバー起動
```bash
pnpm dev
```

http://localhost:3000 でアクセス可能

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
