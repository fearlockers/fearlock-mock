'use client'

import { useState, useEffect, Fragment } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
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
  LinkIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useSidebar } from '@/contexts/SidebarContext'

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
  { name: '連携管理', icon: LinkIcon, href: '/integrations' },
  { name: '設定', icon: Cog6ToothIcon, href: '/settings' },
]

const userNavigation = [
  { name: 'プロフィール', href: '#', icon: UserIcon },
  { name: '設定', href: '#', icon: Cog6ToothIcon },
  { name: 'ログアウト', href: '#', icon: ArrowRightOnRectangleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebar()

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

      {/* Organization Section */}
      <div className="space-y-2">
        {!collapsed && (
          <div className="text-xs font-semibold leading-5 text-indigo-400 uppercase tracking-wide">
            組織
          </div>
        )}
        
                {/* Company Selector */}
        {collapsed ? (
          // Display only - not clickable when collapsed
          <div className="flex justify-center p-2">
            <div className="w-4 h-4 bg-indigo-600 rounded-sm flex items-center justify-center">
              <span className="text-xs font-bold text-white">S</span>
            </div>
          </div>
        ) : (
          <Menu as="div" className="relative">
            <Menu.Button className="group flex items-center w-full rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 gap-x-2 py-1.5 px-2 text-xs">
              <span className="text-xs font-medium leading-5 text-white flex-1 text-left">
                株式会社サンプル
              </span>
              <span className="text-indigo-300 text-sm">⇄</span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 origin-top rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none top-full left-0 mt-1 w-full">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'block px-3 py-1 text-xs leading-5 text-gray-900 dark:text-gray-100'
                      )}
                    >
                      株式会社サンプル
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'block px-3 py-1 text-xs leading-5 text-gray-900 dark:text-gray-100'
                      )}
                    >
                      テスト企業A
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-50 dark:bg-gray-700' : '',
                        'block px-3 py-1 text-xs leading-5 text-gray-900 dark:text-gray-100'
                      )}
                    >
                      テスト企業B
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-indigo-700 dark:border-gray-600"></div>

      {/* Overview Section */}
      {!collapsed && (
        <div className="text-xs font-semibold leading-5 text-indigo-400 uppercase tracking-wide">
          概要
        </div>
      )}

      <nav className="flex flex-1 flex-col">
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
      </nav>

      {/* Management Section */}
      <div className="mt-6 border-t border-indigo-700 dark:border-gray-600 pt-4">
        {!collapsed && (
          <div className="text-xs font-semibold leading-5 text-indigo-400 uppercase tracking-wide mb-2">
            管理
          </div>
        )}
        <ul role="list" className="space-y-1">
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
      </div>

      {/* User Profile Section */}
      <div className="border-t border-indigo-700 dark:border-gray-600 pt-4">
        {collapsed ? (
          // Display only - not clickable when collapsed
          <div className="flex justify-center p-2">
            <img
              className="h-6 w-6 rounded-full bg-gray-50 shrink-0"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        ) : (
          <Menu as="div" className="relative">
            <Menu.Button className="group flex items-center w-full rounded-md text-indigo-200 hover:text-white hover:bg-indigo-800 gap-x-2 py-1.5 px-2 text-xs">
              <img
                className="h-6 w-6 rounded-full bg-gray-50 shrink-0"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
              <span className="text-xs font-semibold leading-5 text-white flex-1 text-left">
                田中太郎
              </span>
              <ChevronDownIcon className="h-4 w-4 text-indigo-300" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute z-10 origin-bottom rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none bottom-full left-0 mb-1 w-full">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-gray-50 dark:bg-gray-700' : '',
                          'flex items-center gap-x-2 px-3 py-1 text-xs leading-5 text-gray-900 dark:text-gray-100'
                        )}
                      >
                        <item.icon className="h-3 w-3 text-gray-400" />
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
    </div>
  )
} 