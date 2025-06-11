'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheckIcon,
  CodeBracketIcon,
  CpuChipIcon,
  EyeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'ダッシュボード', icon: HomeIcon, href: '/' },
  { name: '脆弱性診断', icon: ShieldCheckIcon, href: '/vulnerability' },
  { name: 'ソースコード診断', icon: CodeBracketIcon, href: '/code-analysis' },
  { name: 'ネットワーク診断', icon: CpuChipIcon, href: '/network-scan' },
  { name: 'ネットワーク監視', icon: EyeIcon, href: '/monitoring' },
  { name: 'WAF/Firewall', icon: ShieldCheckIcon, href: '/firewall' },
  { name: 'レポート', icon: ChartBarIcon, href: '/reports' },
  { name: 'アラート', icon: BellIcon, href: '/alerts' },
]

const secondaryNavigation = [
  { name: 'プロジェクト', icon: DocumentTextIcon, href: '/projects' },
  { name: 'チーム', icon: UserGroupIcon, href: '/team' },
  { name: '設定', icon: Cog6ToothIcon, href: '/settings' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  return (
    <div className={classNames(
      'flex grow flex-col gap-y-3 overflow-y-auto bg-indigo-900 dark:bg-gray-800 text-white transition-all duration-300 border-r border-indigo-700 dark:border-gray-600',
      collapsed ? 'px-2 py-4' : 'px-4 py-4'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
            <ShieldCheckIcon className="w-4 h-4 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-white">Fearlock</span>}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-indigo-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4 text-indigo-300" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4 text-indigo-300" />
          )}
        </button>
      </div>
      
      {!collapsed && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-3 h-3 text-indigo-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-8 pr-3 py-1.5 border border-indigo-700 rounded-md leading-4 bg-indigo-800 placeholder-indigo-400 text-white focus:outline-none focus:placeholder-indigo-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-5">
          <li>
            <ul role="list" className="space-y-1">
              {navigation.map((item) => (
                <motion.li 
                  key={item.name}
                  whileHover={!collapsed ? { x: 2 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-indigo-800 text-white border-r-2 border-indigo-400'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800',
                      collapsed 
                        ? 'group flex justify-center rounded-md p-2 text-xs font-medium'
                        : 'group flex gap-x-2 rounded-md py-1.5 px-2 text-xs leading-5 font-medium'
                    )}
                    title={collapsed ? item.name : ''}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                        'h-4 w-4 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </li>
          <li>
            {!collapsed && (
              <div className="text-xs font-semibold leading-5 text-indigo-400 uppercase tracking-wide">
                管理
              </div>
            )}
            <ul role="list" className={classNames("space-y-1", !collapsed ? "mt-2" : "")}>
              {secondaryNavigation.map((item) => (
                <motion.li 
                  key={item.name}
                  whileHover={!collapsed ? { x: 2 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Link
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-indigo-800 text-white border-r-2 border-indigo-400'
                        : 'text-indigo-200 hover:text-white hover:bg-indigo-800',
                      collapsed 
                        ? 'group flex justify-center rounded-md p-2 text-xs font-medium'
                        : 'group flex gap-x-2 rounded-md py-1.5 px-2 text-xs leading-5 font-medium'
                    )}
                    title={collapsed ? item.name : ''}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href ? 'text-white' : 'text-indigo-300 group-hover:text-white',
                        'h-4 w-4 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
} 