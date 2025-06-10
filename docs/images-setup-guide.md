# 作品画像設定ガイド 🖼️

**最終更新**: 2025年1月21日  
**対象**: KariGallery プロジェクトの作品画像管理

---

## 🎯 **概要**

KariGalleryでは、作品画像の管理にSupabase Storageと`public/images`ディレクトリを使用します。このガイドでは、画像の準備から表示まで、段階的に説明します。

---

## 📁 **ディレクトリ構造**

```
public/
├── images/
│   ├── artworks/          # 作品画像
│   │   ├── sakura-mau-komichi_main.jpg
│   │   ├── seijaku-no-kohan_main.jpg
│   │   ├── tosi-no-yugure_main.jpg
│   │   ├── hanataba_main.jpg
│   │   └── machikado-no-cafe_main.jpg
│   └── artist/            # アーティスト画像
│       └── profile.jpg
├── placeholder-artwork.svg   # フォールバック画像
└── ...
```

---

## 🎨 **Phase 1: プレースホルダー画像生成**

### **1. 自動生成ツールの使用**

プロジェクトに含まれている画像生成ツールを使用：

```bash
# ブラウザで以下のファイルを開く
public/images/artworks/create-placeholder-images.html
```

**使用方法：**
1. HTMLファイルをブラウザで開く
2. 「すべての画像を生成」ボタンをクリック  
3. 各作品の「ダウンロード」ボタンで画像を保存
4. 正確なファイル名で `public/images/artworks/` に配置

### **2. 必要な画像ファイル**

現在のSupabaseデータベースに登録されている画像：

```
sakura-mau-komichi_main.jpg   - 桜舞う小径
seijaku-no-kohan_main.jpg     - 静寂の湖畔  
tosi-no-yugure_main.jpg       - 都市の夕暮れ
hanataba_main.jpg             - 花束
machikado-no-cafe_main.jpg    - 街角のカフェ
```

**画像仕様：**
- **形式**: JPEG, PNG, WebP
- **サイズ**: 最低 400x400px（正方形推奨）
- **容量**: 5MB以下
- **品質**: 高解像度（印刷可能品質）

---

## 🌐 **Phase 2: Supabase Storage設定（本番用）**

### **1. Storageバケット設定**

Supabaseダッシュボードで：

1. **Storage**タブへ移動
2. **「New bucket」**をクリック
3. **バケット名**: `artwork-images`
4. **Public bucket**: ✅ 有効
5. **File size limit**: 10MB

### **2. ポリシー設定**

```sql
-- 読み取り: 全ユーザー
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'artwork-images');

-- アップロード: 認証済みユーザーのみ  
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'artwork-images' AND auth.role() = 'authenticated');
```

### **3. 画像アップロード**

**方法1: ダッシュボード経由**
1. Storage → artwork-images
2. 「Upload file」で画像をアップロード
3. URLをコピーしてデータベース更新

**方法2: プログラム経由（将来の管理機能）**
```typescript
const { data, error } = await supabase.storage
  .from('artwork-images')
  .upload(`${artworkSlug}_main.jpg`, file)
```

---

## 🔧 **Phase 3: 画像URLの管理**

### **1. データベース更新**

作品画像のURLを更新：

```sql
-- 例: 桜舞う小径の画像URL更新
UPDATE artwork_images 
SET image_url = 'https://yrssxfdcjujvysrzuydq.supabase.co/storage/v1/object/public/artwork-images/sakura-mau-komichi_main.jpg'
WHERE artwork_id = (SELECT id FROM artworks WHERE slug = 'sakura-mau-komichi')
AND is_primary = true;
```

### **2. 開発環境での画像URL**

**ローカル開発時**:
```
/images/artworks/sakura-mau-komichi_main.jpg
```

**本番環境時**:
```
https://yrssxfdcjujvysrzuydq.supabase.co/storage/v1/object/public/artwork-images/sakura-mau-komichi_main.jpg
```

---

## 🎪 **Phase 4: 画像最適化・レスポンシブ対応**

### **1. Next.js Image最適化**

プロジェクトでは `ArtworkImage` コンポーネントを使用：

```tsx
<ArtworkImage
  src={primaryImageUrl}
  alt={artwork.title}
  className="w-full h-full object-cover"
  width={400}
  height={400}
  priority={true} // 重要な画像の場合
/>
```

**特徴：**
- ✅ 自動フォールバック（エラー時プレースホルダー表示）
- ✅ ローディング状態表示
- ✅ レスポンシブ対応
- ✅ SEO最適化

### **2. パフォーマンス最適化**

**画像形式別推奨用途：**
```
JPEG: 写真・複雑な色彩の作品
PNG:  透明度が必要な画像・シンプルな図形
WebP: 最新ブラウザ対応・高圧縮率
```

**サイズ別用途：**
```
400x400:   ギャラリー一覧表示
800x800:   作品詳細ページ
1200x1200: 高解像度表示・印刷用
```

---

## 🛡️ **Phase 5: エラーハンドリング・フォールバック**

### **1. 自動フォールバック**

`ArtworkImage`コンポーネントが自動処理：

1. **画像読み込み失敗** → プレースホルダーSVG表示
2. **画像URLが空** → デフォルトプレースホルダー
3. **ネットワークエラー** → ローディング状態維持

### **2. 404エラー対策**

**サービス関数での処理：**
```typescript
export function getPrimaryImageUrl(artwork: ArtworkWithImages): string {
  const primaryImage = artwork.artwork_images?.find(img => img.is_primary)
  return primaryImage?.image_url || '/placeholder-artwork.svg'
}
```

### **3. 開発時のデバッグ**

**よくある404エラー原因：**
```
✗ ファイル名の不一致
✗ 大文字小文字の違い  
✗ 拡張子の間違い
✗ パスの間違い
```

**確認方法：**
```bash
# ファイル存在確認
ls -la public/images/artworks/

# 開発サーバーログ確認
npm run dev
# ブラウザで http://localhost:3000/gallery をアクセス
```

---

## 📸 **Phase 6: 作品撮影・画像準備のベストプラクティス**

### **1. 撮影環境**

**推奨設定：**
- **照明**: 自然光または色温度5500K-6500K
- **背景**: 白またはニュートラルグレー
- **カメラ**: デジタル一眼レフ・ミラーレス推奨
- **レンズ**: 85mm-105mm（歪み最小化）

### **2. 撮影手順**

1. **水平垂直の確認**: レベル・グリッド使用
2. **フレーミング**: 作品周囲に適度な余白
3. **フォーカス**: 中央部分にピント
4. **露出**: ハイライト・シャドウ部のディテール保持

### **3. 後処理**

**基本調整：**
```
色温度調整 → 露出補正 → コントラスト → 彩度 → シャープネス
```

**推奨ソフトウェア：**
- Adobe Lightroom（色調整）
- Photoshop（細部修正）
- GIMP（無料代替案）

---

## 🚀 **クイックスタート**

### **すぐに始める手順**

1. **画像生成ツール使用**
   ```bash
   # ブラウザで開く
   public/images/artworks/create-placeholder-images.html
   ```

2. **画像をダウンロード・配置**
   ```bash
   # 各画像を正確なファイル名で保存
   public/images/artworks/sakura-mau-komichi_main.jpg
   # ... 他の画像も同様
   ```

3. **開発サーバー確認**
   ```bash
   npm run dev
   # http://localhost:3000/gallery で確認
   ```

4. **404エラーの解消確認**
   - ブラウザの開発者ツールでNetworkタブ確認
   - 全ての画像が200 OKステータスで読み込まれることを確認

---

## 💡 **トラブルシューティング**

### **よくある問題と解決策**

**1. 画像が表示されない**
```bash
# ファイル名確認
ls public/images/artworks/
# データベースのimage_url確認
```

**2. 404エラーが続く**
```bash
# キャッシュクリア
rm -rf .next/
npm run dev
```

**3. 画像がぼやける**
- 高解像度画像を使用
- Next.js Imageコンポーネントの品質設定確認

---

**🎨 これで美しい作品画像の表示が完成！**  
アートの魅力を最大限に伝える、プロフェッショナルなギャラリーサイトが実現します。 