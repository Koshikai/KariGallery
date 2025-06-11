import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtworkBySlug, getRelatedArtworks, getPrimaryImageUrl, getAllImageUrls } from '@/lib/supabase/services'
import ArtworkPageClient from './artwork-client'

interface ArtworkPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: ArtworkPageProps): Promise<Metadata> {
  const params = await props.params
  const artwork = await getArtworkBySlug(params.slug)
  
  if (!artwork) {
    return {
      title: '作品が見つかりません | Kari Gallery'
    }
  }
  
  const primaryImageUrl = getPrimaryImageUrl(artwork)
  
  return {
    title: `${artwork.title} | Kari Gallery`,
    description: artwork.description || `${artwork.title} - ${artwork.medium}、${artwork.year_created}年制作`,
    openGraph: {
      title: artwork.title,
      description: artwork.description || `${artwork.title} - ${artwork.medium}、${artwork.year_created}年制作`,
      type: 'article',
      images: [
        {
          url: primaryImageUrl !== '/placeholder-artwork.jpg' ? primaryImageUrl : '/placeholder-artwork.jpg',
          width: 1200,
          height: 630,
          alt: artwork.title,
        }
      ]
    }
  }
}

export default async function ArtworkPage(props: ArtworkPageProps) {
  const params = await props.params
  const artwork = await getArtworkBySlug(params.slug)
  
  if (!artwork) {
    notFound()
  }

  // 関連作品を取得（同じカテゴリの他の作品）
  const relatedArtworks = artwork.category 
    ? await getRelatedArtworks(artwork.id, artwork.category, 3)
    : []

  const primaryImageUrl = getPrimaryImageUrl(artwork)
  const allImages = getAllImageUrls(artwork)
  const additionalImages = allImages.filter(img => !img.is_primary)

  return (
    <ArtworkPageClient
      artwork={artwork}
      relatedArtworks={relatedArtworks}
      primaryImageUrl={primaryImageUrl}
      additionalImages={additionalImages}
    />
  )
}