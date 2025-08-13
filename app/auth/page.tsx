'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthComponent from '@/components/Auth'
import { useAuth } from '@/hooks/useAuth'

export default function AuthPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // リダイレクト中
  }

  return <AuthComponent />
} 