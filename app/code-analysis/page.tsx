'use client'

import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import CodeAnalysis from '@/components/CodeAnalysis'
import { useSidebar } from '@/contexts/SidebarContext'

export default function CodeAnalysisPage() {
  const { collapsed } = useSidebar()

  return (
    <div className="h-screen flex">
      <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4">
            <CodeAnalysis />
          </div>
        </main>
      </div>
    </div>
  )
} 