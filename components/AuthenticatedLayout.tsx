'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/hooks/useAuth'

export default function AuthenticatedLayout() {
  const { collapsed } = useSidebar()
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('🔍 認証されていないため、認証ページにリダイレクト')
      router.push('/auth')
    }
  }, [loading, isAuthenticated, router])

  // ローディング中または認証されていない場合は何も表示しない
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* サイドバー */}
      <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <Sidebar />
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  )
} 