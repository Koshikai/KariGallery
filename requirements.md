# KariGallery - アート作品販売サイト要件定義書

## プロジェクト概要

**個人アーティスト一人のためのオンライン作品販売・ポートフォリオサイト**。アーティストの作品と物語を美しく紹介し、直接販売できるパーソナルブランドサイトを構築する。低コストで運用でき、アーティスト自身が簡単に管理できることを重視。

## 技術スタック

### フロントエンド
- **Framework**: Next.js 15 (App Router + React 19)
- **Language**: TypeScript
- **UI Library**: shadcn/ui v2 + Tailwind CSS
- **State Management**: React Context API / Zustand
- **Form**: React Hook Form + Zod

### バックエンド
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **API**: Next.js API Routes

### デプロイ・インフラ
- **Hosting**: Netlify (OpenNext adapter対応)
- **Payment**: Stripe
- **Image Optimization**: Netlify Image CDN + Supabase Storage
- **Edge Functions**: Netlify Edge Functions (Middleware用)

## ディレクトリ構成

```
KariGallery/
├── .github/
│   └── copilot-instruction.md
├── docs/                           # ドキュメント
├── public/                         # 静的ファイル
│   ├── images/
│   │   └── artist/                # アーティスト本人の写真等
│   └── icons/
├── src/
│   ├── app/                        # App Router
│   │   ├── about/                 # アーティスト紹介
│   │   ├── gallery/               # 作品ギャラリー
│   │   ├── artwork/
│   │   │   └── [slug]/           # 個別作品ページ
│   │   ├── cart/                 # カート
│   │   ├── checkout/             # 決済
│   │   ├── success/              # 購入完了
│   │   ├── story/                # 制作の背景・物語
│   │   ├── contact/              # お問い合わせ
│   │   ├── admin/                # 簡易管理画面（ログイン必要）
│   │   │   ├── artworks/
│   │   │   └── orders/
│   │   ├── api/
│   │   │   ├── artworks/
│   │   │   ├── orders/
│   │   │   ├── stripe/
│   │   │   └── webhooks/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # ランディングページ
│   ├── components/               # 再利用可能コンポーネント
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── gallery/             # ギャラリー表示
│   │   ├── artwork/             # 作品詳細
│   │   ├── cart/                # カート機能
│   │   ├── artist/              # アーティスト紹介
│   │   └── layout/              # レイアウト
│   ├── lib/                     # ユーティリティ・設定
│   │   ├── supabase/
│   │   ├── stripe/
│   │   ├── validations/
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/                   # カスタムフック
│   ├── store/                   # 状態管理（カート等）
│   ├── types/                   # TypeScript型定義
│   └── styles/                  # スタイル関連
├── .env.local.example
├── .env.local
├── .gitignore
├── components.json             # shadcn/ui設定
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 機能要件

### フロントエンド（訪問者向け）
1. **ランディングページ**
   - アーティストの代表作品の美しい表示
   - 簡潔な自己紹介
   - 最新作品へのナビゲーション

2. **アーティスト紹介 (/about)**
   - プロフィール写真と経歴
   - 制作への想い・コンセプト
   - 制作技法や使用画材の紹介

3. **作品ギャラリー (/gallery)**
   - 作品一覧（グリッド表示）
   - カテゴリー別フィルタリング（絵画、素描、版画等）
   - 年代別ソート機能

4. **個別作品ページ (/artwork/[slug])**
   - 高解像度画像（ズーム機能）
   - 作品詳細（サイズ、画材、制作年、価格）
   - 制作背景やエピソード
   - 購入ボタン

5. **制作の物語 (/story)**
   - 制作プロセスの紹介
   - インスピレーションの源
   - 工房や制作環境の紹介

6. **購入機能**
   - シンプルなカート機能
   - Stripe決済
   - 購入完了後の自動メール通知

### バックエンド（アーティスト用管理）
1. **作品管理**
   - 作品の追加・編集・削除
   - 画像アップロード
   - 販売状況の管理

2. **注文管理**
   - 新規注文の通知
   - 注文詳細の確認
   - 発送状況の更新

3. **サイト管理**
   - プロフィール情報の更新
   - ページコンテンツの編集

### 顧客体験重視の機能
- **アート鑑賞体験**: 作品を美術館で見ているような体験
- **物語性**: 各作品の背景やアーティストの想いを伝える
- **信頼性**: プロフェッショナルな印象で購入への安心感を提供

## データベース設計

### テーブル構成
```sql
-- アーティスト情報テーブル（単一レコード）
artist_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  email TEXT,
  phone TEXT,
  studio_address TEXT,
  website_url TEXT,
  instagram_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- 作品テーブル
artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,      -- URL用スラッグ
  description TEXT,
  story TEXT,                     -- 制作背景・エピソード
  price DECIMAL(10,2) NOT NULL,
  width DECIMAL(8,2),
  height DECIMAL(8,2),
  depth DECIMAL(8,2),            -- 立体作品用
  medium TEXT,                   -- 画材・技法
  year_created INTEGER,
  category TEXT,                 -- 絵画、素描、版画等
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,  -- 注目作品
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- 作品画像テーブル
artwork_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID REFERENCES artworks(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,  -- メイン画像
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
)

-- 注文テーブル（顧客情報も含む）
orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')),
  stripe_payment_intent_id TEXT UNIQUE,
  notes TEXT,                    -- 特別な要望等
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

-- 注文アイテムテーブル
order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  artwork_id UUID REFERENCES artworks(id),
  artwork_title TEXT NOT NULL,   -- 注文時点での作品名
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)

-- ページコンテンツテーブル（About、Storyページ等の内容管理）
page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT UNIQUE NOT NULL,  -- 'about', 'story' 等
  title TEXT NOT NULL,
  content TEXT,                   -- Markdown形式
  images JSONB,                   -- 関連画像のURL配列
  is_published BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## セキュリティ要件

### 行レベルセキュリティ (RLS)
```sql
-- 作品: 全ユーザー閲覧可能、管理者のみ編集可能
-- 注文: 管理者のみアクセス可能
-- アーティスト情報: 全ユーザー閲覧可能、管理者のみ編集可能
-- ページコンテンツ: 公開済みのみ全ユーザー閲覧可能、管理者のみ編集可能
```

### 認証
- **管理者アクセス**: 環境変数で設定したメールアドレスのみ管理画面にアクセス可能
- **顧客**: 会員登録不要、購入時に必要な情報のみ収集

### API セキュリティ
- 環境変数での秘密鍵管理
- Stripe Webhook署名検証
- CORS設定
- レート制限

## 開発フェーズ

### Phase 1: MVP (個人ポートフォリオ + 基本販売機能)
- [ ] プロジェクト初期化 (Next.js + shadcn/ui)
- [ ] ランディングページ（代表作品の美しい表示）
- [ ] アーティスト紹介ページ
- [ ] 作品ギャラリー（一覧・詳細）
- [ ] 基本的なカート機能
- [ ] Stripe決済連携
- [ ] Supabase設定・基本的なCMS機能
- [ ] Netlifyデプロイ

### Phase 2: コンテンツ充実・管理機能
- [ ] 制作の物語ページ
- [ ] 簡易管理画面（作品・注文管理）
- [ ] お問い合わせフォーム
- [ ] 画像最適化・ズーム機能
- [ ] SEO対応（作品ページの構造化データ）
- [ ] メール通知機能

### Phase 3: 体験向上・最適化
- [ ] 高度な画像表示（360度ビュー等）
- [ ] ブログ機能（制作日記等）
- [ ] SNS連携
- [ ] パフォーマンス最適化
- [ ] アナリティクス導入
- [ ] 作品の物語性を伝える演出

## 運用要件

### 無料利用枠の活用
- **Netlify**: 100GB/月 帯域幅、300分/月 ビルド時間（商用利用可能）
- **Supabase**: 500MB DB、1GB Storage、50K MAU
- **Stripe**: GitHub Student Pack特典（最初の$1000手数料免除）

### パフォーマンス目標
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## UI/UX要件

### デザインシステム
- **UI Framework**: shadcn/ui
- **コンセプト**: ミニマルでエレガント、作品を引き立てるデザイン
- **色彩**: 
  - 主色：ニュートラルな色調（白、グレー、ベージュ）
  - アクセント：アーティストの作品に合わせたブランドカラー
- **タイポグラフィ**: 読みやすく上品なフォント（Noto Sans JP + 欧文フォント）
- **レスポンシブ**: モバイルファーストデザイン

### アート特化のUX
- **作品鑑賞体験**: 
  - 大きな画像表示領域
  - 没入感のある全画面表示モード
  - 作品の質感が伝わる高品質画像
- **物語性の重視**:
  - 作品の制作背景を丁寧に紹介
  - アーティストの人柄が伝わるコンテンツ
  - 制作プロセスの可視化
- **信頼感の構築**:
  - プロフェッショナルな外観
  - 透明性のある価格・配送情報
  - アーティストの実績・経歴の紹介

### ユーザビリティ
- シンプルで直感的なナビゲーション
- 作品カテゴリーの分かりやすい分類
- 購入プロセスの簡素化（会員登録不要）
- アクセシビリティ対応（WCAG 2.1 AA準拠）

## 非機能要件

### パフォーマンス
- ページ読み込み速度 < 3秒
- 画像最適化（WebP/AVIF対応）
- SEO最適化

### 可用性
- 99.9%以上の稼働率目標
- 自動バックアップ
- 障害監視

### セキュリティ
- HTTPS通信
- XSS/CSRF対策
- 入力値検証
- セキュリティヘッダー設定

## 品質管理

### テスト戦略
- **ユニットテスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **型安全性**: TypeScript strict mode
- **コード品質**: ESLint + Prettier

### CI/CD
- GitHub Actions
- 自動テスト実行
- Netlifyの自動デプロイ
- プレビュー環境での確認

## 運用・保守

### 監視・ログ
- Supabaseダッシュボードでの利用状況監視
- Netlify Analyticsでのパフォーマンス監視
- エラートラッキング（Sentry検討）

### バックアップ戦略
- Supabaseの自動バックアップ機能
- 重要データの定期エクスポート
- 画像ファイルのバックアップ

## Next.js 15 移行ガイド

### 主要な変更点
1. **非同期化されたAPI**
   - `params`, `searchParams`: Promise化により`await`が必要
   - `headers()`, `cookies()`, `draftMode()`: Promise化により`await`が必要
   
2. **キャッシュ動作の変更**
   - Route HandlersのGETメソッド: デフォルトでキャッシュされなくなった
   - fetchリクエスト: デフォルトでキャッシュされなくなった

### 移行手順
```bash
# 1. 依存関係の更新
npm install next@15 react@rc react-dom@rc

# 2. 自動マイグレーション実行
npx @next/codemod@latest upgrade latest
npx @next/codemod@latest next-async-request-api .

# 3. 手動修正（@next-codemod-errorコメント箇所）
# 4. キャッシュ動作の調整
# 5. テスト実行
```

### 実装時の注意点
- Route Handlers: 必要に応じて`export const dynamic = 'force-static'`
- Server Components: `params`と`searchParams`は`await`で取得
- Image最適化: Netlify Image CDNを活用
- Middleware: Netlify Edge Functionsで自動処理

### 推奨package.json（主要部分）
```json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "stripe": "^14.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

---

## 更新履歴
- 2025/06/10: 初版作成 (Next.js 14対応)
- 2025/06/10: Next.js 15対応に更新
