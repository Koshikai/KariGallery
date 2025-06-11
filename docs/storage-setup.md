# Supabase Storage 設定手順

## 🗂️ **artwork-images バケットの作成**

### 1. Supabase ダッシュボードにアクセス
1. [Supabase Dashboard](https://app.supabase.com/) にログイン
2. KariGallery プロジェクトを選択

### 2. Storage セクションに移動
1. 左サイドバーの「Storage」をクリック
2. 「Create a new bucket」ボタンをクリック

### 3. バケットの設定
- **Bucket name**: `artwork-images`
- **Public bucket**: ☑️ チェックを入れる
- **File size limit**: `10MB`
- **Allowed MIME types**: `image/jpeg,image/jpg,image/png,image/webp`

### 4. RLS (Row Level Security) ポリシーの設定

#### 読み取りポリシー（一般公開）
```sql
-- 全員が画像を閲覧可能
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'artwork-images');
```

#### 管理者のみアップロード・削除ポリシー
```sql
-- 認証されたユーザーのみアップロード可能
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'artwork-images' 
  AND auth.role() = 'authenticated'
);

-- 認証されたユーザーのみ削除可能
CREATE POLICY "Authenticated Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'artwork-images' 
  AND auth.role() = 'authenticated'
);
```

## 📁 **フォルダ構造**

アップロードされた画像は以下の構造で保存されます：

```
artwork-images/
├── {artwork-id-1}/
│   ├── 1640995200000.jpg
│   ├── 1640995201000.png
│   └── 1640995202000.webp
├── {artwork-id-2}/
│   ├── 1640995203000.jpg
│   └── 1640995204000.jpg
└── ...
```

## 🔧 **トラブルシューティング**

### エラー: "Bucket does not exist"
- Supabaseダッシュボードでバケットが正しく作成されているか確認
- バケット名が `artwork-images` と完全に一致しているか確認

### エラー: "Policy denied"
- RLSポリシーが正しく設定されているか確認
- ユーザーが適切に認証されているか確認

### アップロードが失敗する
- ファイルサイズが10MB以下か確認
- ファイル形式がサポートされているか確認（JPEG, PNG, WebP）
- ネットワーク接続を確認

## 🔗 **関連ファイル**

- `/src/lib/supabase/services.ts` - 画像アップロード関数
- `/src/components/admin/image-upload.tsx` - アップロードコンポーネント
- `/src/app/admin/artworks/new/page.tsx` - 新規作品作成ページ
- `/src/app/admin/artworks/[id]/edit/page.tsx` - 作品編集ページ 