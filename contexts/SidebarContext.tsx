'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getCookie, setTemporaryCookie } from '@/lib/cookies'

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    // Cookieからサイドバーの状態を読み込み
    const savedCollapsed = getCookie('sidebarCollapsed')
    if (savedCollapsed !== null) {
      setCollapsed(JSON.parse(savedCollapsed))
    }
  }, [])

  const handleSetCollapsed = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed)
    setTemporaryCookie('sidebarCollapsed', JSON.stringify(newCollapsed))
  }

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed: handleSetCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
} 