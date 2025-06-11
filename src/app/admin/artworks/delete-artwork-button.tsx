'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteArtwork } from '@/lib/supabase/services'

// 簡単なモーダルコンポーネント
const Modal = ({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode 
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

interface DeleteArtworkButtonProps {
  artworkId: string
  artworkTitle: string
}

export function DeleteArtworkButton({ artworkId, artworkTitle }: DeleteArtworkButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const success = await deleteArtwork(artworkId)
      
      if (success) {
        setIsModalOpen(false)
        router.refresh() // ページを再読み込みして一覧を更新
      } else {
        alert('削除に失敗しました。')
      }
    } catch (error) {
      alert('予期しないエラーが発生しました。')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => setIsModalOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <div className="mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            作品を削除しますか？
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            「{artworkTitle}」を削除します。<br />
            この操作は取り消すことができません。
          </p>
          
          <div className="flex space-x-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  削除中...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
} 