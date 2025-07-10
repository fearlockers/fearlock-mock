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
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UsersIcon,
  LinkIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  CreditCardIcon,
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
    { 
      id: 1, 
      name: '株式会社サンプル', 
      isDefault: true,
      description: 'メインの開発組織',
      domain: 'sample.co.jp',
      address: '東京都渋谷区道玄坂1-2-3',
      phone: '03-1234-5678',
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      plan: 'Enterprise',
      memberCount: 25,
      apiKeys: 3,
      integrations: 5
    },
    { 
      id: 2, 
      name: 'テスト企業A', 
      isDefault: false,
      description: 'テスト環境用組織',
      domain: 'test-a.com',
      address: '大阪府大阪市北区梅田1-1-1',
      phone: '06-1234-5678',
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      plan: 'Professional',
      memberCount: 10,
      apiKeys: 2,
      integrations: 3
    },
    { 
      id: 3, 
      name: 'テスト企業B', 
      isDefault: false,
      description: 'サブプロジェクト用組織',
      domain: 'test-b.com',
      address: '愛知県名古屋市中区栄3-4-5',
      phone: '052-1234-5678',
      timezone: 'Asia/Tokyo',
      currency: 'JPY',
      plan: 'Basic',
      memberCount: 5,
      apiKeys: 1,
      integrations: 2
    },
  ])
  const [editingOrg, setEditingOrg] = useState<number | null>(null)
  const [selectedOrg, setSelectedOrg] = useState<number | null>(null)
  const [newOrgName, setNewOrgName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [orgDetailTab, setOrgDetailTab] = useState('basic')

  // Organization management functions
  const handleAddOrganization = () => {
    if (newOrgName.trim()) {
      const newOrg = {
        id: Math.max(...organizations.map(org => org.id)) + 1,
        name: newOrgName.trim(),
        isDefault: false,
        description: '新しい組織',
        domain: 'example.com',
        address: '',
        phone: '',
        timezone: 'Asia/Tokyo',
        currency: 'JPY',
        plan: 'Basic',
        memberCount: 1,
        apiKeys: 0,
        integrations: 0
      }
      setOrganizations([...organizations, newOrg])
      setNewOrgName('')
      setShowAddForm(false)
    }
  }

  const handleEditOrganization = (orgId: number, newName: string) => {
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, name: newName } : org
    ))
    setEditingOrg(null)
  }

  const handleDeleteOrganization = (orgId: number) => {
    if (organizations.length > 1) {
      setOrganizations(organizations.filter(org => org.id !== orgId))
    }
  }

  const handleSetDefault = (orgId: number) => {
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
                  {!selectedOrg ? (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">組織管理</h3>
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
                          <div key={org.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <BuildingOfficeIcon className="w-8 h-8 text-blue-500" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{org.name}</h4>
                                    {org.isDefault && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                        デフォルト
                                      </span>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      org.plan === 'Enterprise' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                                      org.plan === 'Professional' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                                      'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {org.plan}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{org.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                                    <span className="flex items-center">
                                      <GlobeAltIcon className="w-3 h-3 mr-1" />
                                      {org.domain}
                                    </span>
                                    <span className="flex items-center">
                                      <UsersIcon className="w-3 h-3 mr-1" />
                                      {org.memberCount}名
                                    </span>
                                    <span className="flex items-center">
                                      <KeyIcon className="w-3 h-3 mr-1" />
                                      {org.apiKeys}個
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedOrg(org.id)}
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                  詳細設定
                                  <ChevronRightIcon className="w-3 h-3 ml-1" />
                                </button>
                                {!org.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(org.id)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                  >
                                    デフォルトに設定
                                  </button>
                                )}
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
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">組織について</h3>
                            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                              <p>
                                組織は、チームや部門を管理するための単位です。各組織では詳細な設定、メンバー管理、
                                セキュリティポリシー、API設定などを個別に管理できます。
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Organization Detail View */
                    <div className="space-y-6">
                      {/* Back Button and Organization Header */}
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setSelectedOrg(null)}
                          className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                        >
                          <ArrowLeftIcon className="w-4 h-4 mr-1" />
                          戻る
                        </button>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {organizations.find(org => org.id === selectedOrg)?.name} の詳細設定
                          </h3>
                        </div>
                      </div>

                      {/* Organization Detail Tabs */}
                      <div className="border-b border-gray-200 dark:border-gray-600">
                        <nav className="-mb-px flex space-x-8">
                          {[
                            { id: 'basic', name: '基本情報', icon: InformationCircleIcon },
                            { id: 'members', name: 'メンバー', icon: UsersIcon },
                            { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
                            { id: 'billing', name: '請求・プラン', icon: CreditCardIcon },
                            { id: 'integrations', name: '連携設定', icon: LinkIcon },
                          ].map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setOrgDetailTab(tab.id)}
                              className={`${
                                orgDetailTab === tab.id
                                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                              } flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                            >
                              <tab.icon className="w-4 h-4 mr-2" />
                              {tab.name}
                            </button>
                          ))}
                        </nav>
                      </div>

                      {/* Organization Detail Content */}
                      <div className="py-4">
                        {orgDetailTab === 'basic' && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">組織名</label>
                                <input 
                                  type="text" 
                                  defaultValue={organizations.find(org => org.id === selectedOrg)?.name}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ドメイン</label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                    <GlobeAltIcon className="w-4 h-4" />
                                  </span>
                                  <input 
                                    type="text" 
                                    defaultValue={organizations.find(org => org.id === selectedOrg)?.domain}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                  />
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">説明</label>
                                <textarea 
                                  rows={3}
                                  defaultValue={organizations.find(org => org.id === selectedOrg)?.description}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">住所</label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                    <MapPinIcon className="w-4 h-4" />
                                  </span>
                                  <input 
                                    type="text" 
                                    defaultValue={organizations.find(org => org.id === selectedOrg)?.address}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">電話番号</label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                    <PhoneIcon className="w-4 h-4" />
                                  </span>
                                  <input 
                                    type="tel" 
                                    defaultValue={organizations.find(org => org.id === selectedOrg)?.phone}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タイムゾーン</label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                    <ClockIcon className="w-4 h-4" />
                                  </span>
                                  <select 
                                    defaultValue={organizations.find(org => org.id === selectedOrg)?.timezone}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  >
                                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                    <option value="UTC">UTC</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">通貨</label>
                                <div className="flex">
                                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                    <CurrencyDollarIcon className="w-4 h-4" />
                                  </span>
                                  <select 
                                    defaultValue={organizations.find(org => org.id === selectedOrg)?.currency}
                                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  >
                                    <option value="JPY">日本円 (JPY)</option>
                                    <option value="USD">米ドル (USD)</option>
                                    <option value="EUR">ユーロ (EUR)</option>
                                    <option value="GBP">英ポンド (GBP)</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {orgDetailTab === 'members' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">メンバー管理</h4>
                              <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                <PlusIcon className="w-3 h-3 mr-1" />
                                メンバーを招待
                              </button>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                現在 {organizations.find(org => org.id === selectedOrg)?.memberCount} 名のメンバーが参加しています。
                                メンバーの詳細管理機能は今後追加予定です。
                              </p>
                            </div>
                          </div>
                        )}

                        {orgDetailTab === 'security' && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">セキュリティポリシー</h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">二要素認証を必須にする</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">組織メンバー全員に2FAを強制します</p>
                                </div>
                                <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">IPアドレス制限</h5>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">特定のIPアドレスからのみアクセスを許可</p>
                                </div>
                                <button className="bg-gray-200 dark:bg-gray-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                                  <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {orgDetailTab === 'billing' && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">プラン・請求情報</h4>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {organizations.find(org => org.id === selectedOrg)?.plan} プラン
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    月額 ¥{organizations.find(org => org.id === selectedOrg)?.plan === 'Enterprise' ? '50,000' : 
                                            organizations.find(org => org.id === selectedOrg)?.plan === 'Professional' ? '20,000' : '5,000'}
                                  </p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                                  プランを変更
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {orgDetailTab === 'integrations' && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">外部連携設定</h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {[
                                { name: 'Slack', status: 'connected', icon: '💬' },
                                { name: 'GitHub', status: 'connected', icon: '🐙' },
                                { name: 'Jira', status: 'disconnected', icon: '🔵' },
                                { name: 'Microsoft Teams', status: 'disconnected', icon: '👥' },
                              ].map((integration) => (
                                <div key={integration.name} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{integration.icon}</span>
                                    <div>
                                      <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">{integration.name}</h6>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {integration.status === 'connected' ? '接続済み' : '未接続'}
                                      </p>
                                    </div>
                                  </div>
                                  <button className={`px-3 py-1 text-xs font-medium rounded-md ${
                                    integration.status === 'connected' 
                                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800' 
                                      : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                                  }`}>
                                    {integration.status === 'connected' ? '切断' : '接続'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                          <CheckIcon className="w-4 h-4 mr-2" />
                          変更を保存
                        </button>
                      </div>
                    </div>
                  )}
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