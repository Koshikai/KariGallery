import { redirect } from 'next/navigation'

export default function AdminPage() {
  // 管理画面のメインページは作品管理にリダイレクト
  redirect('/admin/artworks')
} 