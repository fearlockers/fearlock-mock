'use client'

import { useState } from 'react'
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  UserIcon,
  KeyIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const settingsTabs = [
  { id: 'general', name: '一般設定', icon: Cog6ToothIcon },
  { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
  { id: 'notifications', name: '通知設定', icon: BellIcon },
  { id: 'profile', name: 'プロフィール', icon: UserIcon },
  { id: 'api', name: 'API設定', icon: KeyIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
          <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
            設定
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            アプリケーションとセキュリティの設定管理
          </p>
        </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={classNames(
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
                  'group flex items-center px-3 py-2 text-sm font-medium border-l-4 w-full text-left'
                )}
              >
                <tab.icon
                  className={classNames(
                    activeTab === tab.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                    'flex-shrink-0 -ml-1 mr-3 h-5 w-5'
                  )}
                />
                <span className="truncate">{tab.name}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'general' && (
                                 <div className="space-y-6">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">一般設定</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                          <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タイムゾーン</label>
                        <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option>Asia/Tokyo (JST)</option>
                        <option>UTC</option>
                        <option>America/New_York (EST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">言語</label>
                      <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option>日本語</option>
                        <option>English</option>
                        <option>中文</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">テーマ</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                            theme === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <SunIcon className="w-4 h-4 mr-2" />
                          ライト
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <MoonIcon className="w-4 h-4 mr-2" />
                          ダーク
                        </button>
                        <button
                          onClick={() => setTheme('system')}
                          className={`flex items-center justify-center px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                            theme === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          <ComputerDesktopIcon className="w-4 h-4 mr-2" />
                          システム
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">ダッシュボードの自動更新を有効にする</span>
                    </label>
                  </div>
                </div>
              )}

                             {activeTab === 'security' && (
                 <div className="space-y-6">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">セキュリティ設定</h3>
                                       <div className="space-y-4">
                       <div className="flex items-center justify-between">
                         <div>
                           <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">二要素認証</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400">アカウントの追加セキュリティ層</p>
                         </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                      </button>
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">セッションタイムアウト（分）</label>
                       <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option>30分</option>
                        <option>1時間</option>
                        <option>2時間</option>
                        <option>4時間</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === 'notifications' && (
                 <div className="space-y-6">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">通知設定</h3>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <div>
                         <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">メールアラート</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400">重要なアラートをメールで受信</p>
                       </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors">
                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200" />
                      </button>
                    </div>
                                         <div className="flex items-center justify-between">
                       <div>
                         <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">プッシュ通知</h4>
                         <p className="text-sm text-gray-500 dark:text-gray-400">ブラウザでリアルタイム通知</p>
                       </div>
                      <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors">
                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === 'profile' && (
                 <div className="space-y-6">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">プロフィール設定</h3>
                   <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">氏名</label>
                       <input type="text" defaultValue="田中太郎" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">メールアドレス</label>
                       <input type="email" defaultValue="tanaka@example.com" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">部署</label>
                       <input type="text" defaultValue="セキュリティ部" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">役職</label>
                       <input type="text" defaultValue="セキュリティアナリスト" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </div>
                  </div>
                </div>
              )}

                             {activeTab === 'api' && (
                 <div className="space-y-6">
                   <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">API設定</h3>
                   <div className="space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">APIキー</label>
                      <div className="flex">
                                                 <input type={showApiKey ? 'text' : 'password'} value="sk-1234567890abcdef..." readOnly className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                         <button onClick={() => setShowApiKey(!showApiKey)} className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                           {showApiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                         </button>
                         <button className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-blue-600 text-white hover:bg-blue-700">再生成</button>
                      </div>
                    </div>
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook URL</label>
                       <input type="url" placeholder="https://webhook.example.com/alerts" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    キャンセル
                  </button>
                  <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    <CheckIcon className="w-4 h-4 mr-2" />
                    設定を保存
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 