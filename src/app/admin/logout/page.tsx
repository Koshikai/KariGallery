'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // 常にログインページにリダイレクト
        router.push('/admin/login')
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>ログアウトしています...</span>
      </div>
    </div>
  )
} 