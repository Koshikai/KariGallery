import { supabase } from './client'
import type { ArtworkWithImages, ArtworkImage, ArtistProfile } from '@/types/database'

// アーティストプロフィールを取得
export async function getArtistProfile(): Promise<ArtistProfile | null> {
  try {
    const { data, error } = await supabase
      .from('artist_profile')
      .select('*')
      .single()
    
    if (error) {
      console.error('アーティストプロフィール取得エラー:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('アーティストプロフィール取得エラー:', error)
    return null
  }
}

// すべての作品を取得（画像付き）
export async function getAllArtworks(): Promise<ArtworkWithImages[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('作品一覧取得エラー:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('作品一覧取得エラー:', error)
    return []
  }
}

// 販売中の作品のみを取得
export async function getAvailableArtworks(): Promise<ArtworkWithImages[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .eq('is_available', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('販売中作品取得エラー:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('販売中作品取得エラー:', error)
    return []
  }
}

// 特定のカテゴリの作品を取得
export async function getArtworksByCategory(category: string): Promise<ArtworkWithImages[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .eq('category', category)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error(`カテゴリ${category}の作品取得エラー:`, error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error(`カテゴリ${category}の作品取得エラー:`, error)
    return []
  }
}

// スラグで特定の作品を取得（画像付き）
export async function getArtworkBySlug(slug: string): Promise<ArtworkWithImages | null> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error(`作品(${slug})取得エラー:`, error)
      return null
    }
    
    return data
  } catch (error) {
    console.error(`作品(${slug})取得エラー:`, error)
    return null
  }
}

// 同じカテゴリの関連作品を取得（指定された作品を除く）
export async function getRelatedArtworks(
  currentArtworkId: string, 
  category: string, 
  limit: number = 3
): Promise<ArtworkWithImages[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .eq('category', category)
      .neq('id', currentArtworkId)
      .eq('is_available', true)
      .order('display_order', { ascending: true })
      .limit(limit)
    
    if (error) {
      console.error('関連作品取得エラー:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('関連作品取得エラー:', error)
    return []
  }
}

// 注目作品を取得
export async function getFeaturedArtworks(limit: number = 6): Promise<ArtworkWithImages[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        artwork_images (*)
      `)
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('display_order', { ascending: true })
      .limit(limit)
    
    if (error) {
      console.error('注目作品取得エラー:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('注目作品取得エラー:', error)
    return []
  }
}

// 作品のカテゴリ一覧を取得
export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select('category')
      .not('category', 'is', null)
    
    if (error) {
      console.error('カテゴリ取得エラー:', error)
      return []
    }
    
    // 重複を削除してソート
    const categories = [...new Set(data.map(item => item.category).filter(Boolean))]
    return categories.sort()
  } catch (error) {
    console.error('カテゴリ取得エラー:', error)
    return []
  }
}

// 作品のメイン画像URLを取得するヘルパー関数
export function getPrimaryImageUrl(artwork: ArtworkWithImages): string {
  const primaryImage = artwork.artwork_images?.find(img => img.is_primary)
  // 実画像が利用可能になったため、フォールバックは基本的に不要
  return primaryImage?.image_url || ''
}

// 作品の全画像URLを取得するヘルパー関数
export function getAllImageUrls(artwork: ArtworkWithImages): ArtworkImage[] {
  return artwork.artwork_images?.sort((a, b) => a.display_order - b.display_order) || []
}

// 作品の個別取得
export async function getArtworkById(id: string): Promise<ArtworkWithImages | null> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .select(`
        *,
        images:artwork_images(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching artwork by ID:', error)
      return null
    }

    return data as ArtworkWithImages
  } catch (error) {
    console.error('Error in getArtworkById:', error)
    return null
  }
}

// 作品の更新
export async function updateArtwork(id: string, updates: Partial<{
  title: string
  description: string
  price: number
  size: string
  medium: string
  year: number
  status: string
  category: string
}>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('artworks')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating artwork:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateArtwork:', error)
    return false
  }
}

// 作品の削除
export async function deleteArtwork(id: string): Promise<boolean> {
  try {
    // まず関連する画像を削除
    const { error: imageError } = await supabase
      .from('artwork_images')
      .delete()
      .eq('artwork_id', id)

    if (imageError) {
      console.error('Error deleting artwork images:', imageError)
      return false
    }

    // 次に作品を削除
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting artwork:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteArtwork:', error)
    return false
  }
}

// 作品の新規作成
export async function createArtwork(artworkData: {
  title: string
  slug: string
  description?: string
  price: number
  width?: number | null
  height?: number | null
  medium?: string
  year_created?: number
  category?: string
  is_available?: boolean
  is_featured?: boolean
}): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('artworks')
      .insert([{
        ...artworkData,
        display_order: 0 // デフォルトの表示順序
      }])
      .select('id')
      .single()

    if (error) {
      console.error('Error creating artwork:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error in createArtwork:', error)
    return null
  }
}

// 画像アップロード機能
export async function uploadArtworkImage(file: File, artworkId: string): Promise<string | null> {
  try {
    // ファイル名を生成（タイムスタンプ + オリジナル名）
    const timestamp = Date.now()
    const fileExt = file.name.split('.').pop()
    const fileName = `${artworkId}/${timestamp}.${fileExt}`

    // Supabase Storageにアップロード
    const { error } = await supabase.storage
      .from('artwork-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // アップロードされた画像のパブリックURLを取得
    const { data: urlData } = supabase.storage
      .from('artwork-images')
      .getPublicUrl(fileName)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error in uploadArtworkImage:', error)
    return null
  }
}

// 作品に画像を関連付け
export async function addArtworkImage(artworkId: string, imageUrl: string, displayOrder: number = 0): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('artwork_images')
      .insert([{
        artwork_id: artworkId,
        image_url: imageUrl,
        display_order: displayOrder,
        is_primary: displayOrder === 0 // 最初の画像をプライマリに設定
      }])

    if (error) {
      console.error('Error adding artwork image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in addArtworkImage:', error)
    return false
  }
}

// 作品画像を削除
export async function deleteArtworkImage(imageId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('artwork_images')
      .delete()
      .eq('id', imageId)

    if (error) {
      console.error('Error deleting artwork image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteArtworkImage:', error)
    return false
  }
}

// 作品の画像一覧を取得
export async function getArtworkImages(artworkId: string) {
  try {
    const { data, error } = await supabase
      .from('artwork_images')
      .select('*')
      .eq('artwork_id', artworkId)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching artwork images:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getArtworkImages:', error)
    return []
  }
} 