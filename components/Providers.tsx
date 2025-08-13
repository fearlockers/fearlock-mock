'use client'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { useAuth } from '@/hooks/useAuth'

// 認証状態を管理するコンポーネント
function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  
  // 認証状態がロード中の場合の表示
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
      {children}
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  )
} 