'use client'

import { useAuth } from '@/hooks/useAuth'
import LandingPage from '@/components/LandingPage'
import AuthenticatedLayout from '@/components/AuthenticatedLayout'
import { useEffect, useState } from 'react'

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth()
  const [isNewUserFlow, setIsNewUserFlow] = useState(false)

  // 新規ユーザーフローの状態を監視
  useEffect(() => {
    const checkNewUserFlow = () => {
      const url = window.location.pathname
      const searchParams = new URLSearchParams(window.location.search)
      
      // /authページにいる場合、または新規ユーザーフラグが設定されている場合
      if (url === '/auth' || searchParams.get('newUser') === 'true') {
        setIsNewUserFlow(true)
      } else {
        setIsNewUserFlow(false)
      }
    }

    checkNewUserFlow()
    window.addEventListener('popstate', checkNewUserFlow)
    return () => window.removeEventListener('popstate', checkNewUserFlow)
  }, [])

  // 認証状態のデバッグ
  useEffect(() => {
    console.log('認証状態:', { isAuthenticated, loading, userId: user?.id, isNewUserFlow })
    
    // ログアウト後の処理
    if (!isAuthenticated && !loading && !isNewUserFlow) {
      console.log('未認証状態: ランディングページを表示')
    }
  }, [isAuthenticated, loading, user, isNewUserFlow])

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  // 新規ユーザーフロー中は常にランディングページを表示
  if (isNewUserFlow) {
    console.log('新規ユーザーフロー中: ランディングページを表示')
    return <LandingPage />
  }

  // 未認証の場合はランディングページを表示
  if (!isAuthenticated) {
    console.log('未認証: ランディングページを表示')
    return <LandingPage />
  }

  // 認証済みの場合はダッシュボードを表示
  console.log('認証済み: ダッシュボードを表示')
  return <AuthenticatedLayout />
} 