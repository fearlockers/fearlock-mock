'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import { useSidebar } from '@/contexts/SidebarContext'

export default function Home() {
  const { collapsed } = useSidebar()

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