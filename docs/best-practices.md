# **ベストプラクティスと今後の展開**

**最終更新**: 2025年6月11日（データ型統一と画像表示ベストプラクティス追加）

## **データ管理と画像表示のベストプラクティス** 🖼️ NEW!

### **型安全性の確保**

**一貫したデータ型の使用** (2025年6月11日更新)
- **ArtworkWithImages型の統一使用**: 画像情報を含む作品データの一貫した管理
- **型の一元管理**: `@/types/database.ts`での型定義の統一
- **コンポーネント間の型整合性**: カートストア、ページコンポーネント、ヘルパー関数で同一型を使用

```typescript
// 推奨パターン
export interface CartItem {
  artwork: ArtworkWithImages  // 画像情報を含む
  quantity: number
}

// 非推奨パターン
export interface CartItem {
  artwork: Artwork  // 画像情報が欠如
  quantity: number
}
```

### **画像表示の最適化**

**共通コンポーネントの活用**
- **ArtworkImageコンポーネント**: エラーハンドリング、ローディング状態、プレースホルダー表示
- **getPrimaryImageUrl()ヘルパー**: メイン画像の一貫した取得
- **画像URL生成の中央集権化**: Supabase Storageとの統合

```typescript
// 推奨パターン
const primaryImageUrl = getPrimaryImageUrl(artwork)
<ArtworkImage
  src={primaryImageUrl}
  alt={artwork.title}
  className="aspect-square"
/>

// 非推奨パターン
<div className="bg-gray-200">
  <span>作品画像</span> {/* ハードコードされたプレースホルダー */}
</div>
```

### **データフェッチの統一**

**画像情報を含むデータ取得**
- **Supabaseクエリの統一**: 常に`artwork_images`を含むselect文を使用
- **キャッシュ戦略**: Next.js 15の新しいキャッシュ動作に対応
- **エラーハンドリング**: 画像が存在しない場合の適切な処理

```typescript
// 推奨パターン
const { data, error } = await supabase
  .from('artworks')
  .select(`
    *,
    artwork_images (*)
  `)
```

## **アプリケーションのセキュリティ基礎**

### **APIキーとシークレットの安全な取り扱い**

- **環境変数の使用**:
  - すべてのAPIキーとシークレットは環境変数で管理
  - `.env.local` ファイルを使用（開発環境）
  - 本番環境では各プラットフォームの環境変数管理機能を活用

- **Git管理の注意点**:
  - `.env*` ファイルを `.gitignore` に追加
  - シークレット情報を絶対にGitにコミットしない
  - コミット前の確認習慣の確立

### **Supabase 行レベルセキュリティ（RLS）**

支払いとユーザーデータを扱うEコマースサイトにとって、セキュリティは最初から不可欠です。

- **RLS の重要性**:
  - ユーザー固有または機密データを含むテーブル（例：`orders`、`profiles`）に対してRLSを有効化
  - データベースレベルでのアクセス制御
  - アプリケーション層の攻撃対象領域を削減

- **実装すべきポリシー例**:
  ```sql
  -- ユーザーは自分の注文のみ参照可能
  CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);
  
  -- ユーザーは自分のプロフィールのみ更新可能
  CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);
  ```

### **Stripe Webhook署名検証**

- **検証の重要性**: 不正なWebhook呼び出しを防ぐため必須
- **実装方法**: Stripeが提供する署名検証ライブラリを使用
- **エラーハンドリング**: 署名が無効な場合は処理を中断

### **Next.js 15セキュリティ対応**

- **非同期API対応**:
  ```typescript
  // Next.js 15対応
  import { headers } from 'next/headers'
  
  export async function POST(request: Request) {
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    // ...
  }
  ```

- **新しいキャッシュ制御**:
  - Route HandlersのGETメソッドは自動的にキャッシュされなくなった
  - セキュリティが重要なエンドポイントには適切な設定を行う

### **入力値検証**

- **クライアントサイド検証**:
  - ユーザー体験の向上
  - 即座なフィードバック
  - React Hook Form や Formik の活用

- **サーバーサイド検証**:
  - セキュリティの確保
  - データ整合性の維持
  - Zod や Joi などのスキーマ検証ライブラリの使用

## **Next.js 15対応のテスト戦略**

### **非同期API対応のテスト**

```typescript
// テストでの非同期API対応例
import { POST } from '@/app/api/stripe-webhooks/route'

describe('Stripe Webhook', () => {
  it('handles webhook with async headers', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      headers: { 'stripe-signature': 'test-signature' }
    })
    
    const response = await POST(request)
    expect(response.status).toBe(200)
  })
})
```

### **React 19対応のコンポーネントテスト**

```typescript
// useOptimistic hooks のテスト例
import { render, screen } from '@testing-library/react'
import CartComponent from '@/components/CartComponent'

test('optimistic updates work correctly', () => {
  render(<CartComponent />)
  // テストロジック
})
```

## **エンドツーエンドの販売フローテスト**

### **Stripeテストモード**

- **テストカード番号の活用**:
  - 成功パターン: `4242424242424242`
  - 失敗パターン: `4000000000000002`
  - 3Dセキュア認証: `4000000000003220`

- **テストシナリオ**:
  - 正常な決済フロー
  - 決済失敗時の処理
  - キャンセル時の挙動
  - 異なる通貨での決済

### **Webhookテスト**

- **Stripe CLIの活用**:
  - ローカル開発環境へのWebhookイベント転送
  - `stripe listen --forward-to localhost:3000/api/stripe-webhooks`

- **テスト項目**:
  - `checkout.session.completed` イベントの処理
  - データベースへの正確な注文情報の保存
  - べき等性の確認（重複処理の防止）

### **Supabaseデータ検証**

テストトランザクション後の確認事項：

- **注文データ**:
  - 注文が正しく作成されているか
  - 注文ステータスが適切に更新されているか
  - 決済インテントIDが正しく記録されているか

- **在庫管理**:
  - 在庫が適切に減少しているか（該当する場合）
  - 在庫切れ時の処理が正しく動作するか

- **ユーザーデータ**:
  - ユーザー情報が適切に処理されているか
  - 注文履歴が正しく表示されるか

## **開発のベストプラクティス**

### **反復的な開発アプローチ**

このような性質のプロジェクトでは、すべてを一度に構築しようとすると圧倒される可能性があります。

- **段階的な実装**:
  1. コア機能の構築（商品表示、カート、基本的なチェックアウト）
  2. テストと検証
  3. 追加機能の実装
  4. 再テストと改善

- **MVP優先**:
  - 最小限の機能で動作するプロダクトを最初に作成
  - ユーザーフィードバックを基に機能を拡張
  - 完璧を求めすぎずに段階的に改善

### **コードの品質管理**

- **TypeScriptの活用**:
  - 型安全性の確保
  - 開発時のエラー早期発見
  - IDE支援の向上

- **ESLint・Prettierの設定**:
  - 一貫したコードスタイル
  - 潜在的なバグの早期発見
  - チーム開発での統一性

- **テストの実装**:
  - ユニットテスト（Jest、React Testing Library）
  - インテグレーションテスト
  - E2Eテスト（Playwright、Cypress）

## **将来の考慮事項とスケーラビリティ**

### **機能拡張の可能性**

- **検索・フィルタリング**:
  - Algolia や Elasticsearch の導入
  - 高度な検索機能
  - ファセット検索

- **アーティスト機能**:
  - アーティスト紹介ページ
  - 作品の背景情報
  - 制作プロセスの紹介

- **コンテンツマーケティング**:
  - ブログ機能
  - アート関連の記事
  - SEO最適化

- **マーケティング連携**:
  - メールマーケティング（Mailchimp、SendGrid）
  - SNS連携
  - アナリティクス（Google Analytics、Hotjar）

### **パフォーマンス監視**

- **無料利用枠の使用状況監視**:
  - Supabaseのダッシュボードで定期的な確認
  - Vercel/Netlify/Renderの使用量チェック
  - アラート設定による制限値の事前警告

- **アプリケーションパフォーマンス**:
  - Core Web Vitals の監視
  - ページ読み込み速度の最適化
  - 画像配信の最適化

### **スケーリングの準備**

- **データベース設計**:
  - インデックスの最適化
  - クエリパフォーマンスの監視
  - 将来的なパーティショニングの検討

- **キャッシュ戦略**:
  - Redis の導入検討
  - CDN の活用
  - Next.js の ISR（Incremental Static Regeneration）

- **アップグレードパス**:
  - 有料プランへの移行タイミング
  - 機能追加による収益向上
  - 運用コストと売上のバランス

## **運用とメンテナンス**

### **定期的なタスク**

- **セキュリティアップデート**:
  - 依存関係の定期更新
  - セキュリティ脆弱性の監視
  - Dependabot の活用

- **バックアップ**:
  - データベースの定期バックアップ
  - Supabase の自動バックアップ機能の活用
  - 画像ファイルのバックアップ戦略

- **監視とアラート**:
  - アプリケーションの稼働監視
  - エラー追跡（Sentry、LogRocket）
  - パフォーマンス監視

### **継続的な改善**

- **ユーザーフィードバック**:
  - 購入者からのフィードバック収集
  - ユーザビリティテストの実施
  - A/Bテストでの機能改善

- **分析と最適化**:
  - 売上データの分析
  - コンバージョン率の改善
  - 最も人気のある作品の分析

反復的なアプローチと決済フローの徹底的なエンドツーエンドテストを組み合わせることで、成功の可能性が高まります。

---

## **本番環境エラー対応のベストプラクティス** 🚨 NEW!

### **Server Components vs Client Components の使い分け**

**本番環境でのServer Componentsエラー対策**
- **現象**: 開発環境では正常、本番環境（Netlify）で500エラー
- **原因**: ホスティング環境でのServer Components制約、環境変数の差異

**推奨アプローチ**:
```typescript
// 管理画面などデータフェッチが複雑なページ
'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const result = await getDataFromSupabase()
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // ローディング・エラー・データ表示の分岐処理
}
```

### **デバッグ・エラー追跡**

**段階的な問題特定**
1. **データベース接続テスト**: `/admin/database-test` ページの作成
2. **環境変数確認**: 本番環境での設定値検証
3. **エラーログ収集**: 詳細なエラー情報の取得
4. **クライアント/サーバー分離**: 問題箇所の特定・修正

**エラーハンドリングの強化**
```typescript
// 詳細なエラー情報の取得
try {
  const data = await supabase.from('artworks').select('*')
  if (data.error) throw new Error(data.error.message)
} catch (err) {
  console.error('Supabase エラー詳細:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })
  // ユーザー向けエラー表示
}
```

### **本番環境特有の考慮事項**

**Netlify固有の制約**
- Server Componentsの制限的な動作
- 環境変数の設定方法の違い
- ビルド時とランタイムでの動作差異

**Supabase接続の最適化**
- RLS（Row Level Security）ポリシーの本番適用確認
- APIキーの権限設定確認
- 接続タイムアウト・リトライ設定

---

## **更新履歴**

- 2025/06/11: Next.js 15 + React 19対応のセキュリティ・テスト戦略を追加、本番環境エラー対応のベストプラクティスを追加
