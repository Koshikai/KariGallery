import Link from 'next/link'
import { Plus, Pencil, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ArtworkImage } from '@/components/ui/artwork-image'
import { getAllArtworks } from '@/lib/supabase/services'
import type { ArtworkWithImages } from '@/types/database'
import { DeleteArtworkButton } from './delete-artwork-button'

export default async function AdminArtworksPage() {
  const artworks = await getAllArtworks()

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">作品管理</h1>
          <p className="text-gray-600 mt-1">作品の追加、編集、削除を行えます</p>
        </div>
        <Link href="/admin/artworks/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規作品追加
          </Button>
        </Link>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">総作品数</p>
              <p className="text-2xl font-semibold text-gray-900">{artworks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">販売中</p>
              <p className="text-2xl font-semibold text-gray-900">
                {artworks.filter((artwork: ArtworkWithImages) => artwork.is_available).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Eye className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">売約済み</p>
              <p className="text-2xl font-semibold text-gray-900">
                {artworks.filter((artwork: ArtworkWithImages) => !artwork.is_available).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 作品一覧 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">作品一覧</h2>
        </div>
        
        {artworks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">まだ作品が登録されていません</p>
            <Link href="/admin/artworks/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                最初の作品を追加
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作品
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    価格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成年
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {artworks.map((artwork: ArtworkWithImages) => (
                  <ArtworkTableRow key={artwork.id} artwork={artwork} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function ArtworkTableRow({ artwork }: { artwork: ArtworkWithImages }) {
  const primaryImageUrl = artwork.artwork_images && artwork.artwork_images.length > 0 
    ? artwork.artwork_images[0].image_url 
    : ''

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16">
            <ArtworkImage
              src={primaryImageUrl}
              alt={artwork.title}
              className="h-16 w-16 rounded-lg object-cover"
              width={64}
              height={64}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {artwork.title}
            </div>
            <div className="text-sm text-gray-500">
              {artwork.medium}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        ¥{artwork.price.toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          artwork.is_available
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {artwork.is_available ? '販売中' : '売約済み'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {artwork.year_created}年
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <Link href={`/artwork/${artwork.slug}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/admin/artworks/${artwork.id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteArtworkButton 
            artworkId={artwork.id} 
            artworkTitle={artwork.title} 
          />
        </div>
      </td>
    </tr>
  )
} 