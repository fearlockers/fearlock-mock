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
  BuildingOfficeIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const settingsTabs = [
  { id: 'general', name: '一般設定', icon: Cog6ToothIcon },
  { id: 'organization', name: '組織設定', icon: BuildingOfficeIcon },
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
  
  // Organization settings state
  const [organizations, setOrganizations] = useState([
    { id: 1, name: '株式会社サンプル', isDefault: true },
    { id: 2, name: 'テスト企業A', isDefault: false },
    { id: 3, name: 'テスト企業B', isDefault: false },
  ])
  const [editingOrg, setEditingOrg] = useState(null)
  const [newOrgName, setNewOrgName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  // Organization management functions
  const handleAddOrganization = () => {
    if (newOrgName.trim()) {
      const newOrg = {
        id: Math.max(...organizations.map(org => org.id)) + 1,
        name: newOrgName.trim(),
        isDefault: false
      }
      setOrganizations([...organizations, newOrg])
      setNewOrgName('')
      setShowAddForm(false)
    }
  }

  const handleEditOrganization = (orgId, newName) => {
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, name: newName } : org
    ))
    setEditingOrg(null)
  }

  const handleDeleteOrganization = (orgId) => {
    if (organizations.length > 1) {
      setOrganizations(organizations.filter(org => org.id !== orgId))
    }
  }

  const handleSetDefault = (orgId) => {
    setOrganizations(organizations.map(org => ({
      ...org,
      isDefault: org.id === orgId
    })))
  }

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

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">組織設定</h3>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="w-3 h-3 mr-1.5" />
                      組織を追加
                    </button>
                  </div>

                  {/* Add Organization Form */}
                  {showAddForm && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">新しい組織を追加</h4>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newOrgName}
                          onChange={(e) => setNewOrgName(e.target.value)}
                          placeholder="組織名を入力"
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                        />
                        <button
                          onClick={handleAddOrganization}
                          className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          追加
                        </button>
                        <button
                          onClick={() => {
                            setShowAddForm(false)
                            setNewOrgName('')
                          }}
                          className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Organizations List */}
                  <div className="space-y-3">
                    {organizations.map((org) => (
                      <div key={org.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                          {editingOrg === org.id ? (
                            <input
                              type="text"
                              defaultValue={org.name}
                              onBlur={(e) => handleEditOrganization(org.id, e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleEditOrganization(org.id, e.target.value)
                                }
                              }}
                              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{org.name}</span>
                              {org.isDefault && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                  デフォルト
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!org.isDefault && (
                            <button
                              onClick={() => handleSetDefault(org.id)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                            >
                              デフォルトに設定
                            </button>
                          )}
                          <button
                            onClick={() => setEditingOrg(org.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          {organizations.length > 1 && (
                            <button
                              onClick={() => handleDeleteOrganization(org.id)}
                              className="p-1 text-red-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <BuildingOfficeIcon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">組織について</h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            組織は、チームや部門を管理するための単位です。デフォルト組織はサイドバーで自動選択されます。
                            組織を切り替えることで、異なるプロジェクトやデータセットにアクセスできます。
                          </p>
                        </div>
                      </div>
                    </div>
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