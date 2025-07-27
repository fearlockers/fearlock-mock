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
  ChevronLeftIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  CreditCardIcon,
  CodeBracketIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

const settingsTabs = [
  { id: 'general', name: '一般設定', icon: Cog6ToothIcon },
  { id: 'organization', name: '組織設定', icon: BuildingOfficeIcon },
  { id: 'domain', name: 'ドメイン設定', icon: GlobeAltIcon },
  { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
  { id: 'notifications', name: '通知設定', icon: BellIcon },
  { id: 'profile', name: 'プロフィール', icon: UserIcon },
  { id: 'api', name: 'API設定', icon: KeyIcon },
  { id: 'help', name: 'ヘルプ', icon: InformationCircleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const { theme, setTheme } = useTheme()
  
  // Organization settings state - single organization
  const [organization] = useState({
    id: 1, 
    name: '株式会社サンプル', 
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
  })
  const [orgDetailTab, setOrgDetailTab] = useState('basic')
  
  // Domain management state
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [showAddDomainModal, setShowAddDomainModal] = useState(false)
  const [domainSetupStep, setDomainSetupStep] = useState(1)
  const [newDomainForm, setNewDomainForm] = useState({
    name: '',
    description: '',
    isPrimary: false
  })
  const [aiBlockOption, setAiBlockOption] = useState('block-all')
  const [robotsManagement, setRobotsManagement] = useState(true)
  const [scannedRecords, setScannedRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [nameservers] = useState([
    'ns1.fearlock.com',
    'ns2.fearlock.com'
  ])
  const [setupComplete, setSetupComplete] = useState(false)
  const [domains, setDomains] = useState([
    {
      id: 'sample-co-jp',
      name: 'sample.co.jp',
      description: 'メインドメイン - 本番環境',
      status: 'active',
      isPrimary: true,
      dnsVerified: true,
      sslEnabled: true,
      subdomains: [
        { name: 'api', description: 'API エンドポイント', status: 'active', ssl: true },
        { name: 'app', description: 'アプリケーション', status: 'active', ssl: true },
        { name: 'admin', description: '管理画面', status: 'active', ssl: true },
        { name: 'docs', description: 'ドキュメント', status: 'inactive', ssl: false },
      ],
      verifiedAt: '2024-01-15 14:30',
      sslExpiresAt: '2024-12-15',
    },
    {
      id: 'example-co-jp',
      name: 'example.co.jp',
      description: 'セカンダリドメイン - 開発・テスト環境',
      status: 'active',
      isPrimary: false,
      dnsVerified: true,
      sslEnabled: true,
      subdomains: [
        { name: 'staging', description: 'ステージング環境', status: 'active', ssl: true },
        { name: 'test', description: 'テスト環境', status: 'active', ssl: true },
        { name: 'dev', description: '開発環境', status: 'active', ssl: true },
      ],
      verifiedAt: '2024-01-10 09:15',
      sslExpiresAt: '2024-11-20',
    },
    {
      id: 'mydomain-com',
      name: 'mydomain.com',
      description: 'グローバル展開用ドメイン',
      status: 'pending',
      isPrimary: false,
      dnsVerified: false,
      sslEnabled: false,
      subdomains: [],
      verifiedAt: '',
      sslExpiresAt: '',
    },
  ])

  // Domain management functions
  const handleScanRecords = async () => {
    setIsScanning(true)
    // Simulate DNS record scanning
    setTimeout(() => {
      const mockRecords = [
        { type: 'A', name: '@', value: '192.168.1.100', ttl: 3600, selected: true },
        { type: 'CNAME', name: 'www', value: newDomainForm.name, ttl: 3600, selected: true },
        { type: 'MX', name: '@', value: `mail.${newDomainForm.name}`, ttl: 3600, selected: true },
        { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: 3600, selected: false },
      ]
      setScannedRecords(mockRecords)
      setSelectedRecords(mockRecords.filter(r => r.selected))
      setIsScanning(false)
    }, 2000)
  }

  const handleRecordToggle = (index: number) => {
    const updatedRecords = [...scannedRecords]
    updatedRecords[index].selected = !updatedRecords[index].selected
    setScannedRecords(updatedRecords)
    setSelectedRecords(updatedRecords.filter(r => r.selected))
  }

  const handleAddNewRecord = () => {
    const newRecord = { type: 'A', name: '', value: '', ttl: 3600, selected: true, isNew: true }
    setScannedRecords([...scannedRecords, newRecord])
    setSelectedRecords([...selectedRecords, newRecord])
  }

  const handleRemoveRecord = (index: number) => {
    const updatedRecords = scannedRecords.filter((_, i) => i !== index)
    setScannedRecords(updatedRecords)
    setSelectedRecords(updatedRecords.filter(r => r.selected))
  }

  const handleRecordChange = (index: number, field: string, value: string) => {
    const updatedRecords = [...scannedRecords]
    updatedRecords[index] = { ...updatedRecords[index], [field]: value }
    setScannedRecords(updatedRecords)
    if (updatedRecords[index].selected) {
      setSelectedRecords(updatedRecords.filter(r => r.selected))
    }
  }

  const checkNameservers = async () => {
    // Simulate nameserver check
    return Math.random() > 0.5 // 50% chance of being correctly configured
  }

  const handleActivateDomain = async () => {
    const isConfigured = await checkNameservers()
    setSetupComplete(isConfigured)
    setDomainSetupStep(5)
  }

  const handleAddDomain = () => {
    const newDomain = {
      id: newDomainForm.name.replace(/\./g, '-'),
      name: newDomainForm.name.trim(),
      description: newDomainForm.description.trim() || `${newDomainForm.name.trim()} のドメイン`,
      status: setupComplete ? 'active' : 'pending',
      isPrimary: newDomainForm.isPrimary && domains.length === 0,
      dnsVerified: setupComplete,
      sslEnabled: false,
      subdomains: [],
      verifiedAt: setupComplete ? new Date().toLocaleString('ja-JP').replace(/\//g, '-') : '',
      sslExpiresAt: '',
    }

    setDomains([...domains, newDomain])
    resetDomainModal()
  }

  const resetDomainModal = () => {
    setShowAddDomainModal(false)
    setDomainSetupStep(1)
    setNewDomainForm({ name: '', description: '', isPrimary: false })
    setScannedRecords([])
    setSelectedRecords([])
    setSetupComplete(false)
    setAiBlockOption('block-all')
    setRobotsManagement(true)
  }

  const handleDomainFormChange = (field: string, value: string | boolean) => {
    setNewDomainForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="h-full flex gap-6">
      {/* Fixed Left Sidebar */}
      <div className="flex-shrink-0 w-64">
        <div className="sticky top-0">
          {/* Header in left sidebar */}
          <div className="mb-6">
            <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
              設定
            </h1>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              アプリケーションとセキュリティの設定管理
            </p>
          </div>
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
      </div>

      {/* Scrollable Right Content */}
      <div className="flex-1 min-w-0">
        <div className="h-full overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">一般設定</h3>
                  
                  {/* 基本設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">基本設定</h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">タイムゾーン</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                              <ClockIcon className="w-4 h-4" />
                            </span>
                            <select className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                              <option>Asia/Tokyo (JST)</option>
                              <option>UTC</option>
                              <option>America/New_York (EST)</option>
                              <option>America/Los_Angeles (PST)</option>
                              <option>Europe/London (GMT)</option>
                              <option>Europe/Berlin (CET)</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">言語</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>日本語</option>
                            <option>English</option>
                            <option>中文</option>
                            <option>한국어</option>
                            <option>Français</option>
                            <option>Deutsch</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日付形式</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>YYYY/MM/DD</option>
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">時間形式</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>24時間表示</option>
                            <option>12時間表示（AM/PM）</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 表示設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">表示設定</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">テーマ</label>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => setTheme('light')}
                              className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
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
                              className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
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
                              className={`flex items-center justify-center px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
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
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ダッシュボード表示</label>
                            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                              <option>コンパクト</option>
                              <option>標準</option>
                              <option>詳細</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1ページあたりの表示件数</label>
                            <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                              <option>10件</option>
                              <option>25件</option>
                              <option>50件</option>
                              <option>100件</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ダッシュボード設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">ダッシュボード設定</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">自動更新を有効にする</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">ダッシュボードのデータを自動的に更新します</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked="true"
                          >
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">リアルタイム通知</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">脅威検出時に即座に通知を表示</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked="true"
                          >
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">更新間隔</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>30秒</option>
                            <option>1分</option>
                            <option>5分</option>
                            <option>10分</option>
                            <option>30分</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* セッション設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">セッション設定</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">セッション有効期限</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>1時間</option>
                            <option>4時間</option>
                            <option>8時間</option>
                            <option>24時間</option>
                            <option>1週間</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">アイドルタイムアウト</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>15分</option>
                            <option>30分</option>
                            <option>1時間</option>
                            <option>2時間</option>
                            <option>無効</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ログイン状態を記憶する</label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ブラウザを閉じてもログイン状態を維持</p>
                        </div>
                        <button
                          type="button"
                          className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          role="switch"
                          aria-checked="false"
                        >
                          <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">セキュリティ設定</h3>
                  
                  {/* パスワード設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue-500" />
                        パスワード設定
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">現在のパスワード</label>
                          <input 
                            type="password" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新しいパスワード</label>
                            <input 
                              type="password" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">パスワード確認</label>
                            <input 
                              type="password" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">パスワード要件:</p>
                          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                            <li>• 最低8文字以上</li>
                            <li>• 大文字と小文字を含む</li>
                            <li>• 数字を含む</li>
                            <li>• 特殊文字を含む (!@#$%^&*)</li>
                          </ul>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                          パスワードを更新
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 二要素認証 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <KeyIcon className="w-5 h-5 mr-2 text-green-500" />
                        二要素認証 (2FA)
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <CheckCircleIcon className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                              <h5 className="text-sm font-medium text-green-800 dark:text-green-200">認証アプリ（推奨）</h5>
                              <p className="text-sm text-green-700 dark:text-green-300">Google Authenticator、Authy等</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                            有効
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="flex items-center">
                              <PhoneIcon className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-sm text-gray-900 dark:text-gray-100">SMS認証</span>
                            </div>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              設定
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div className="flex items-center">
                              <KeyIcon className="w-4 h-4 text-gray-400 mr-3" />
                              <span className="text-sm text-gray-900 dark:text-gray-100">ハードウェアキー</span>
                            </div>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              追加
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                          <div className="flex">
                            <InformationCircleIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mt-0.5 mr-2" />
                            <div>
                              <h6 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">バックアップコード</h6>
                              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                2FAデバイスを紛失した場合のバックアップコードを生成することをお勧めします。
                              </p>
                              <button className="mt-2 text-xs text-yellow-800 dark:text-yellow-200 underline hover:no-underline">
                                バックアップコードを生成
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ログイン履歴とセッション管理 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ClockIcon className="w-5 h-5 mr-2 text-purple-500" />
                        ログイン履歴・セッション管理
                      </h4>
                      <div className="space-y-4">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">デバイス</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">場所</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">最終アクセス</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">状態</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"></th>
                              </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                              {[
                                { device: 'MacBook Pro (Chrome)', location: '東京, 日本', time: '5分前', active: true },
                                { device: 'iPhone (Safari)', location: '東京, 日本', time: '2時間前', active: false },
                                { device: 'Windows PC (Edge)', location: '大阪, 日本', time: '1日前', active: false },
                              ].map((session, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{session.device}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{session.location}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{session.time}</td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      session.active 
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {session.active ? 'アクティブ' : '非アクティブ'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    {!session.active && (
                                      <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                                        削除
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                          すべてのセッションを無効化
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* IPアクセス制限 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <GlobeAltIcon className="w-5 h-5 mr-2 text-orange-500" />
                        IPアクセス制限
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">IPアクセス制限を有効にする</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">指定したIPアドレスからのみアクセスを許可</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 dark:bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked="false"
                          >
                            <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">許可するIPアドレス</label>
                          <div className="space-y-2">
                            <div className="flex">
                              <input 
                                type="text" 
                                placeholder="192.168.1.0/24 または 203.0.113.1"
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                              />
                              <button className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-blue-600 text-white hover:bg-blue-700">
                                追加
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">通知設定</h3>
                  
                  {/* メール通知 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <BellIcon className="w-5 h-5 mr-2 text-blue-500" />
                        メール通知
                      </h4>
                      <div className="space-y-4">
                        {[
                          { id: 'security_alerts', name: 'セキュリティアラート', desc: '重要なセキュリティ脅威の検出時', enabled: true },
                          { id: 'vulnerability_scan', name: '脆弱性スキャン結果', desc: 'スキャン完了時と新しい脆弱性発見時', enabled: true },
                          { id: 'system_maintenance', name: 'システムメンテナンス', desc: '定期メンテナンスとアップデート情報', enabled: true },
                          { id: 'weekly_report', name: '週次レポート', desc: '週次のセキュリティサマリーレポート', enabled: true },
                          { id: 'user_activity', name: 'ユーザーアクティビティ', desc: '新規ユーザー登録と権限変更', enabled: false },
                          { id: 'integration_status', name: '連携ステータス', desc: '外部ツールとの連携状態変更', enabled: false },
                        ].map((notification) => (
                          <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{notification.name}</h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{notification.desc}</p>
                            </div>
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                notification.enabled
                                  ? 'bg-blue-600 focus:ring-blue-500'
                                  : 'bg-gray-200 dark:bg-gray-600 focus:ring-gray-500'
                              }`}
                              role="switch"
                              aria-checked={notification.enabled}
                            >
                              <span 
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  notification.enabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* プッシュ通知 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <PhoneIcon className="w-5 h-5 mr-2 text-green-500" />
                        プッシュ通知
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ブラウザ通知を許可</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">重要なアラートをブラウザ通知で受け取る</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked="true"
                          >
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">通知の優先度</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>すべて</option>
                            <option>高・緊急のみ</option>
                            <option>緊急のみ</option>
                            <option>無効</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">通知時間帯</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">開始時間</label>
                              <input 
                                type="time" 
                                defaultValue="09:00"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">終了時間</label>
                              <input 
                                type="time" 
                                defaultValue="18:00"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slack/Teams連携 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <LinkIcon className="w-5 h-5 mr-2 text-purple-500" />
                        チャット連携
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Slack</h5>
                              <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800 px-2 py-1 rounded">
                                接続済み
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">#security-alerts</p>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              設定を変更
                            </button>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Microsoft Teams</h5>
                              <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                未接続
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Teamsチャンネルに通知を送信</p>
                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              接続を設定
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アラート設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <XMarkIcon className="w-5 h-5 mr-2 text-red-500" />
                        アラート設定
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">脅威レベル閾値</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>低以上（すべて）</option>
                            <option>中以上</option>
                            <option>高以上</option>
                            <option>緊急のみ</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">アラート頻度制限</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>制限なし</option>
                            <option>同じ種類のアラートは5分間隔</option>
                            <option>同じ種類のアラートは15分間隔</option>
                            <option>同じ種類のアラートは1時間間隔</option>
                          </select>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">自動エスカレーション</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">未対応のアラートを自動的に上位者に通知</p>
                          </div>
                          <button
                            type="button"
                            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            role="switch"
                            aria-checked="true"
                          >
                            <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">プロフィール設定</h3>
                  
                  {/* 基本情報 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-blue-500" />
                        基本情報
                      </h4>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-6">
                          <div className="flex-shrink-0">
                            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <UserIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                            </div>
                          </div>
                          <div>
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 mr-2">
                              画像を変更
                            </button>
                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                              削除
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              JPG、PNG形式。最大サイズ: 2MB
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">姓</label>
                            <input 
                              type="text" 
                              defaultValue="田中" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">名</label>
                            <input 
                              type="text" 
                              defaultValue="太郎" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">表示名</label>
                            <input 
                              type="text" 
                              defaultValue="田中太郎" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">メールアドレス</label>
                            <input 
                              type="email" 
                              defaultValue="tanaka@example.com" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">電話番号</label>
                            <input 
                              type="tel" 
                              defaultValue="03-1234-5678" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">携帯電話</label>
                            <input 
                              type="tel" 
                              defaultValue="090-1234-5678" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 組織情報 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 mr-2 text-green-500" />
                        組織情報
                      </h4>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">部署</label>
                          <input 
                            type="text" 
                            defaultValue="セキュリティ部" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">役職</label>
                          <input 
                            type="text" 
                            defaultValue="セキュリティエンジニア" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">従業員ID</label>
                          <input 
                            type="text" 
                            defaultValue="EMP001234" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">マネージャー</label>
                          <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                            <option>山田花子 (部長)</option>
                            <option>佐藤次郎 (課長)</option>
                            <option>未設定</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">所在地</label>
                          <input 
                            type="text" 
                            defaultValue="東京都渋谷区道玄坂1-2-3 オフィスビル5F" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 権限・ロール */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ShieldCheckIcon className="w-5 h-5 mr-2 text-purple-500" />
                        権限・ロール
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">現在のロール</label>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              セキュリティアナリスト
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              管理者
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">アクセス権限</label>
                          <div className="space-y-2">
                            {[
                              { name: 'ダッシュボード閲覧', granted: true },
                              { name: '脆弱性管理', granted: true },
                              { name: 'ユーザー管理', granted: true },
                              { name: 'システム設定', granted: true },
                              { name: '監査ログ', granted: false },
                              { name: '請求情報', granted: false },
                            ].map((permission, index) => (
                              <div key={index} className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-900 dark:text-gray-100">{permission.name}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  permission.granted 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}>
                                  {permission.granted ? '許可' : '拒否'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アカウント情報 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <ClockIcon className="w-5 h-5 mr-2 text-orange-500" />
                        アカウント情報
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">作成日</label>
                          <p className="text-sm text-gray-900 dark:text-gray-100">2024年1月15日</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">最終ログイン</label>
                          <p className="text-sm text-gray-900 dark:text-gray-100">2024年1月28日 14:30</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ログイン回数</label>
                          <p className="text-sm text-gray-900 dark:text-gray-100">127回</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">アカウント状態</label>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            アクティブ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'organization' && (
                <div className="space-y-6">
                  {/* Organization Header */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {organization.name} の組織設定
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      組織の基本情報、ドメイン、セキュリティ、請求、連携設定を管理します。
                    </p>
                  </div>

                      {/* Organization Detail Tabs */}
                      <div className="border-b border-gray-200 dark:border-gray-600">
                        <nav className="-mb-px flex space-x-8">
                          {[
                            { id: 'basic', name: '基本情報', icon: InformationCircleIcon },
                            { id: 'domain', name: '管理ドメイン', icon: GlobeAltIcon },
                            { id: 'security', name: 'セキュリティ', icon: ShieldCheckIcon },
                            { id: 'integrations', name: '連携設定', icon: LinkIcon },
                            { id: 'billing', name: '請求・プラン', icon: CreditCardIcon },
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
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">組織名</label>
                                <input 
                                  type="text" 
                                  defaultValue={organization.name}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">説明</label>
                                <textarea 
                                  rows={3}
                                  defaultValue={organization.description}
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
                                    defaultValue={organization.address}
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
                                    defaultValue={organization.phone}
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
                                    defaultValue={organization.timezone}
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
                                    defaultValue={organization.currency}
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

                        {orgDetailTab === 'domain' && (
                          <div className="space-y-4">
                            <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">プライマリドメイン</h4>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <GlobeAltIcon className="w-5 h-5 text-blue-500" />
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{organization.domain}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">組織のプライマリドメイン</p>
                                  </div>
                                </div>
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                  ✓ 認証済み
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <p>詳細なドメイン管理は「ドメイン設定」タブで行えます。</p>
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
                                    {organization.plan} プラン
                                  </h5>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    月額 ¥{organization.plan === 'Enterprise' ? '50,000' : 
                                            organization.plan === 'Professional' ? '20,000' : '5,000'}
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
                          <div className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">外部連携設定</h4>
                              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <PlusIcon className="w-4 h-4 mr-1" />
                                新しい連携を追加
                              </button>
                            </div>

                            {/* 統計カード */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                              <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <LinkIcon className="h-5 w-5 text-blue-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">接続済み</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">2</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <CodeBracketIcon className="h-5 w-5 text-green-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">監視中リポジトリ</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">20</p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <KeyIcon className="h-5 w-5 text-purple-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">アクティブなWebhook</p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">1</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 接続済み連携サービス */}
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">接続済み連携サービス</h5>
                              <div className="space-y-3">
                                {[
                                  {
                                    name: 'GitHub Enterprise',
                                    type: 'github',
                                    url: 'https://github.com/company',
                                    status: 'connected',
                                    lastSync: '2024-01-15 14:30',
                                    repositories: 12,
                                    webhooksEnabled: true,
                                  },
                                  {
                                    name: 'GitLab Self-Hosted',
                                    type: 'gitlab',
                                    url: 'https://gitlab.company.com',
                                    status: 'error',
                                    lastSync: '2024-01-14 10:15',
                                    repositories: 8,
                                    webhooksEnabled: false,
                                  },
                                ].map((integration, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
                                    <div className="flex items-center space-x-4">
                                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                        integration.type === 'github' ? 'bg-gray-900' : 'bg-orange-500'
                                      }`}>
                                        <CodeBracketIcon className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">{integration.name}</h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{integration.url}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            integration.status === 'connected' 
                                              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                          }`}>
                                            {integration.status === 'connected' ? '✓ 接続済み' : '⚠ エラー'}
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {integration.repositories} リポジトリ
                                          </span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            最終同期: {integration.lastSync}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                        <Cog6ToothIcon className="w-4 h-4" />
                                      </button>
                                      <button className="p-1 text-gray-400 hover:text-red-500">
                                        <TrashIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* 利用可能な連携サービス */}
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">利用可能な連携サービス</h5>
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {[
                                  {
                                    name: 'Bitbucket',
                                    description: 'Bitbucket リポジトリとの連携',
                                    color: 'bg-blue-600',
                                    features: ['リポジトリスキャン', 'PR統合', 'Pipelines統合'],
                                  },
                                  {
                                    name: 'Azure DevOps',
                                    description: 'Azure DevOps との連携',
                                    color: 'bg-blue-500',
                                    features: ['リポジトリスキャン', 'Work Items', 'Build統合'],
                                  },
                                ].map((service, index) => (
                                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                                    <div className="flex items-start space-x-3">
                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${service.color}`}>
                                        <CodeBracketIcon className="w-4 h-4 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h6 className="text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {service.features.map((feature, featureIndex) => (
                                            <span key={featureIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                              {feature}
                                            </span>
                                          ))}
                                        </div>
                                        <button className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800">
                                          接続を設定
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                </div>
              )}

              {activeTab === 'domain' && (
                <div className="space-y-6">
                  {!selectedDomain ? (
                    /* Domain Selection View */
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">ドメイン管理</h3>
                        <button 
                          onClick={() => setShowAddDomainModal(true)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          新しいドメインを追加
                        </button>
                      </div>

                      {/* Statistics Cards */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                                  <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                              </div>
                              <div className="ml-4 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                                    管理中ドメイン
                                  </dt>
                                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {domains.length}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                                  <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                              </div>
                              <div className="ml-4 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                                    認証済み
                                  </dt>
                                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {domains.filter(d => d.dnsVerified).length}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-xl transition-shadow duration-200">
                          <div className="p-5">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                                  <ShieldCheckIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                              </div>
                              <div className="ml-4 w-0 flex-1">
                                <dl>
                                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                                    SSL有効
                                  </dt>
                                  <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {domains.filter(d => d.sslEnabled).length}
                                  </dd>
                                </dl>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Domains List */}
                      <div className="space-y-4">
                        {domains.map((domain) => (
                          <div key={domain.id} className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg p-6 hover:shadow-lg dark:hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600" onClick={() => setSelectedDomain(domain.id)}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  domain.isPrimary ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-600'
                                }`}>
                                  <GlobeAltIcon className={`w-6 h-6 ${
                                    domain.isPrimary ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'
                                  }`} />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{domain.name}</h4>
                                    {domain.isPrimary && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                        プライマリ
                                      </span>
                                    )}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                      domain.status === 'active' ? 'bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' :
                                      domain.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/70 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700' :
                                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                                    }`}>
                                      {domain.status === 'active' ? 'アクティブ' : domain.status === 'pending' ? '設定中' : '無効'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{domain.description}</p>
                                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <CheckCircleIcon className={`w-3 h-3 mr-1 ${domain.dnsVerified ? 'text-green-500 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                      DNS: <span className={domain.dnsVerified ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>{domain.dnsVerified ? '認証済み' : '未認証'}</span>
                                    </span>
                                    <span className="flex items-center">
                                      <ShieldCheckIcon className={`w-3 h-3 mr-1 ${domain.sslEnabled ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                      SSL: <span className={domain.sslEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}>{domain.sslEnabled ? '有効' : '無効'}</span>
                                    </span>
                                    <span className="flex items-center">
                                      <Cog6ToothIcon className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                                      サブドメイン: {domain.subdomains.length}個
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Domain Detail View */
                    <>
                      {(() => {
                        const domain = domains.find(d => d.id === selectedDomain);
                        if (!domain) return null;
                        
                        return (
                          <div className="space-y-6">
                            {/* Back Button and Domain Header */}
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => setSelectedDomain(null)}
                                className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                              >
                                <ChevronLeftIcon className="w-4 h-4 mr-1" />
                                ドメイン一覧に戻る
                              </button>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {domain.name} の設定
                                </h3>
                              </div>
                            </div>

                            {/* プライマリドメイン設定 */}
                            <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="px-4 py-5 sm:p-6">
                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">ドメイン情報</h4>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ドメイン名</label>
                                    <div className="flex">
                                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                                        <GlobeAltIcon className="w-4 h-4" />
                                      </span>
                                      <input 
                                        type="text" 
                                        defaultValue={domain.name}
                                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                                      />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                      {domain.description}
                                    </p>
                                  </div>
                                  
                                  {domain.dnsVerified ? (
                                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                        </div>
                                        <div className="ml-3">
                                          <h5 className="text-sm font-medium text-green-800 dark:text-green-200">DNS認証済み</h5>
                                          <p className="text-sm text-green-700 dark:text-green-300">ドメインの所有権が確認されています</p>
                                        </div>
                                      </div>
                                      <span className="text-xs text-green-600 dark:text-green-400">
                                        {domain.verifiedAt || '設定中'}
                                      </span>
                                    </div>
                                  ) : (
                                    <div 
                                      className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors duration-200"
                                      onClick={() => {
                                        setSelectedDomain(null)
                                        setActiveTab('help')
                                      }}
                                    >
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <InformationCircleIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                                        </div>
                                        <div className="ml-3">
                                          <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            {domain.status === 'pending' ? 'DNS設定保留中' : 'DNS認証未完了'}
                                          </h5>
                                          <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            ネームサーバーの設定が完了していません
                                          </p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                          ヘルプを見る
                                        </span>
                                        <ChevronRightIcon className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* サブドメイン管理 */}
                            <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-md font-medium text-gray-900 dark:text-white">サブドメイン管理</h4>
                                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200">
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    サブドメインを追加
                                  </button>
                                </div>
                                
                                <div className="space-y-3">
                                  {domain.subdomains.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                      <div className="flex items-center space-x-4">
                                        <div>
                                          <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                              {item.name}.{domain.name}
                                            </span>
                                            {item.ssl && (
                                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/70 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">
                                                🔒 SSL
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-xs text-gray-600 dark:text-gray-300">{item.description}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                                          item.status === 'active' 
                                            ? 'bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                                        }`}>
                                          {item.status === 'active' ? 'アクティブ' : '無効'}
                                        </span>
                                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200">
                                          <Cog6ToothIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* SSL証明書管理 */}
                            {domain.sslEnabled && (
                              <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                                <div className="px-4 py-5 sm:p-6">
                                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">SSL証明書</h4>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 rounded-lg">
                                      <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                          <ShieldCheckIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-3">
                                          <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200">ワイルドカード証明書</h5>
                                          <p className="text-sm text-blue-700 dark:text-blue-300">*.{domain.name}</p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs text-blue-600 dark:text-blue-400">有効期限</span>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{domain.sslExpiresAt}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">自動更新</h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">SSL証明書の自動更新を有効にする</p>
                                      </div>
                                      <button className="bg-blue-600 dark:bg-blue-500 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out hover:bg-blue-700 dark:hover:bg-blue-600">
                                        <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* DNS設定 */}
                            <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                              <div className="px-4 py-5 sm:p-6">
                                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">DNS設定</h4>
                                <div className="space-y-3">
                                  {[
                                    { type: 'A', name: '@', value: '192.168.1.100', ttl: '3600' },
                                    { type: 'CNAME', name: 'www', value: domain.name, ttl: '3600' },
                                    { type: 'MX', name: '@', value: 'mail.' + domain.name, ttl: '3600' },
                                    { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.google.com ~all', ttl: '3600' },
                                  ].map((record, index) => (
                                    <div key={index} className="grid grid-cols-5 gap-4 p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                      <div className="font-medium text-gray-900 dark:text-white">{record.type}</div>
                                      <div className="text-gray-700 dark:text-gray-300">{record.name}</div>
                                      <div className="col-span-2 text-gray-700 dark:text-gray-300 truncate">{record.value}</div>
                                      <div className="text-gray-500 dark:text-gray-400">{record.ttl}s</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4">
                                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                                    <PlusIcon className="w-4 h-4 mr-1" />
                                    DNSレコードを追加
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </>
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
                  <div className="space-y-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">API設定</h3>
                    
                    {/* APIキー管理 */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <KeyIcon className="w-5 h-5 mr-2 text-blue-500" />
                          APIキー管理
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">プライマリAPIキー</label>
                            <div className="flex">
                              <input 
                                type={showApiKey ? 'text' : 'password'} 
                                value="sk-1234567890abcdef..." 
                                readOnly 
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                              />
                              <button 
                                onClick={() => setShowApiKey(!showApiKey)} 
                                className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                              >
                                {showApiKey ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                              </button>
                              <button className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-blue-600 text-white hover:bg-blue-700">
                                再生成
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              作成日: 2024年1月15日 | 最終使用: 2時間前 | 使用回数: 1,247回
                            </p>
                          </div>
                          
                          {/* 追加のAPIキー */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">追加のAPIキー</label>
                              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                新しいキーを作成
                              </button>
                            </div>
                            <div className="space-y-2">
                              {[
                                { name: 'テスト用キー', key: 'sk-test789...', created: '2024/01/20', usage: '34回', status: 'active' },
                                { name: 'CI/CD用キー', key: 'sk-ci456...', created: '2024/01/18', usage: '156回', status: 'active' },
                                { name: '開発用キー', key: 'sk-dev123...', created: '2024/01/10', usage: '0回', status: 'disabled' },
                              ].map((apiKey, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">{apiKey.name}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {apiKey.key} • 作成日: {apiKey.created} • 使用回数: {apiKey.usage}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                      apiKey.status === 'active' 
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {apiKey.status === 'active' ? 'アクティブ' : '無効'}
                                    </span>
                                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                      編集
                                    </button>
                                    <button className="text-sm text-red-600 dark:text-red-400 hover:underline">
                                      削除
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* API使用統計 */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                                     <UsersIcon className="w-5 h-5 mr-2 text-green-500" />
                          API使用統計
                        </h4>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <KeyIcon className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">今月のAPI呼び出し</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">12,847</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <ClockIcon className="h-5 w-5 text-green-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">平均レスポンス時間</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">124ms</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-purple-500" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">成功率</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">99.8%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* レート制限設定 */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <ClockIcon className="w-5 h-5 mr-2 text-orange-500" />
                          レート制限設定
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1分あたりのリクエスト数</label>
                              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                <option>100リクエスト/分</option>
                                <option>500リクエスト/分</option>
                                <option>1000リクエスト/分</option>
                                <option>無制限</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1日あたりのリクエスト数</label>
                              <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                <option>10,000リクエスト/日</option>
                                <option>50,000リクエスト/日</option>
                                <option>100,000リクエスト/日</option>
                                <option>無制限</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">レート制限通知</label>
                              <p className="text-xs text-gray-500 dark:text-gray-400">制限に近づいた時にアラートを送信</p>
                            </div>
                            <button
                              type="button"
                              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              role="switch"
                              aria-checked="true"
                            >
                              <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Webhook設定 */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <LinkIcon className="w-5 h-5 mr-2 text-purple-500" />
                          Webhook設定
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Webhook URL</label>
                            <input 
                              type="url" 
                              placeholder="https://webhook.example.com/alerts" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">イベント選択</label>
                            <div className="space-y-2">
                              {[
                                { id: 'security_alert', name: 'セキュリティアラート', enabled: true },
                                { id: 'vulnerability_found', name: '脆弱性発見', enabled: true },
                                { id: 'scan_complete', name: 'スキャン完了', enabled: false },
                                { id: 'user_login', name: 'ユーザーログイン', enabled: false },
                                { id: 'api_error', name: 'APIエラー', enabled: true },
                              ].map((event) => (
                                <div key={event.id} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-900 dark:text-gray-100">{event.name}</span>
                                  <button
                                    type="button"
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                      event.enabled
                                        ? 'bg-blue-600 focus:ring-blue-500'
                                        : 'bg-gray-200 dark:bg-gray-600 focus:ring-gray-500'
                                    }`}
                                    role="switch"
                                    aria-checked={event.enabled}
                                  >
                                    <span 
                                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                        event.enabled ? 'translate-x-5' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">署名シークレット</label>
                            <div className="flex">
                              <input 
                                type="password" 
                                value="wh_secret_abc123..." 
                                readOnly
                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                              />
                              <button className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-blue-600 text-white hover:bg-blue-700">
                                再生成
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Webhookペイロードの署名検証に使用されます
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                              テスト送信
                            </button>
                            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                              配信履歴を表示
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* API ドキュメント */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <CodeBracketIcon className="w-5 h-5 mr-2 text-indigo-500" />
                          API ドキュメント・リソース
                        </h4>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">API リファレンス</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">すべてのエンドポイントと使用方法</p>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              ドキュメントを開く →
                            </a>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">SDKダウンロード</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Python、Node.js、Go SDK</p>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              SDKを取得 →
                            </a>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">サンプルコード</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">実装例とベストプラクティス</p>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              例を見る →
                            </a>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Postmanコレクション</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">API テスト用コレクション</p>
                            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              インポート →
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {activeTab === 'help' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">DNS設定ヘルプ</h3>
                  
                  {/* DNS認証について */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <InformationCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
                        DNS認証とは
                      </h4>
                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <p>
                          DNS認証は、あなたがドメインの正当な所有者であることを確認するプロセスです。
                          FearlockでドメインのDNSを管理するには、ドメインレジストラーでネームサーバーの変更が必要です。
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                          <p className="text-blue-800 dark:text-blue-200">
                            💡 DNS認証が完了すると、Fearlockがドメインの全てのDNSレコードを管理できるようになります。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ネームサーバー設定手順 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <GlobeAltIcon className="w-5 h-5 mr-2 text-green-500" />
                        ネームサーバー設定手順
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Fearlockネームサーバー:
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                                ns1.fearlock.com
                              </code>
                              <button
                                onClick={() => navigator.clipboard.writeText('ns1.fearlock.com')}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                コピー
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                                ns2.fearlock.com
                              </code>
                              <button
                                onClick={() => navigator.clipboard.writeText('ns2.fearlock.com')}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                コピー
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">設定手順:</h5>
                          <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300 list-decimal list-inside">
                            <li>ドメインレジストラー（お名前.com、ムームードメインなど）にログインする</li>
                            <li>ドメイン管理画面またはDNS設定画面を開く</li>
                            <li>「ネームサーバー設定」または「DNS設定」を選択</li>
                            <li>上記のFearlockネームサーバーに変更する</li>
                            <li>変更を保存する</li>
                            <li>反映まで24-48時間待つ</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* よくある質問 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2 text-purple-500" />
                        よくある質問
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Q: DNS設定の反映にはどのくらい時間がかかりますか？
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            A: 通常は数時間から24時間以内に反映されますが、最大48時間かかる場合があります。
                            これは各プロバイダーのDNSキャッシュの更新頻度によって異なります。
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Q: ネームサーバーを変更すると既存のメールやウェブサイトは停止しますか？
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            A: ドメイン追加時にDNSレコードをスキャンし、既存の設定を移行するため、
                            適切に設定すれば停止時間を最小限に抑えることができます。
                          </p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Q: DNS認証が失敗する場合はどうすればよいですか？
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            A: 以下をご確認ください：<br />
                            • ネームサーバーが正しく設定されているか<br />
                            • 24-48時間経過しているか<br />
                            • ドメインレジストラーでの変更が保存されているか
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* サポート情報 */}
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-start">
                      <InformationCircleIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2" />
                      <div>
                        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                          サポートが必要ですか？
                        </h5>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          DNS設定でお困りの場合は、サポートチームがお手伝いします。
                          <a href="mailto:support@fearlock.com" className="underline hover:no-underline ml-1">
                            support@fearlock.com
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddDomainModal && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetDomainModal()
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              resetDomainModal()
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 m-4 max-w-3xl w-full max-h-[95vh] overflow-y-auto">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  ドメインを追加
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ステップ {domainSetupStep} / 5
                </span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${
                      step <= domainSetupStep
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Domain Input */}
            {domainSetupStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    既存のドメインを入力 または新しいドメインを登録する
                  </h4>
                </div>
                
                <div>
                  <input
                    type="text"
                    value={newDomainForm.name}
                    onChange={(e) => handleDomainFormChange('name', e.target.value)}
                    placeholder="example.com"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* AI Crawler Control Section */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h5 className="text-base font-medium text-gray-900 dark:text-white mb-4">
                    AI クローラーがサイトにアクセスする方法を制御する
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    AI クローラーがユーザーの許可なくトレーニング用のコンテンツをスクレイピングするのを防ぎます。
                  </p>

                  {/* AI Training Bot Block Options */}
                  <div className="space-y-4 mb-6">
                    <h6 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                      AI トレーニング ボットをブロックする
                      <InformationCircleIcon className="w-4 h-4 ml-1 text-gray-400" />
                    </h6>

                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       {/* Block All Pages */}
                       <div 
                         className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                           aiBlockOption === 'block-all' 
                             ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                             : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                         }`}
                         onClick={() => setAiBlockOption('block-all')}
                       >
                         <div className="text-center">
                           <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                             すべてのページでブロック
                           </h5>
                           <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                             AI ボットはサイト上のコンテンツをスクレイピングすることはできません
                           </p>
                         </div>
                       </div>

                       {/* Block Ads Only */}
                       <div 
                         className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                           aiBlockOption === 'block-ads' 
                             ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                             : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                         }`}
                         onClick={() => setAiBlockOption('block-ads')}
                       >
                         <div className="text-center">
                           <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                             広告のあるホスト名のみをブロックする
                           </h5>
                           <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                             AI トレーニングボットは広告が表示されるサブドメインではブロックされますが、それ以外の場合は許可されます
                           </p>
                         </div>
                       </div>

                       {/* No Block */}
                       <div 
                         className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                           aiBlockOption === 'no-block' 
                             ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                             : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                         }`}
                         onClick={() => setAiBlockOption('no-block')}
                       >
                         <div className="text-center">
                           <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                             ブロックしない（オフ）
                           </h5>
                           <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                             AI ボットがコンテンツをスクレイピングできるようになる
                           </p>
                         </div>
                       </div>
                     </div>
                  </div>

                  {/* robots.txt Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-start">
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          robots.txt で AI ボットのトラフィックを管理する
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          有効にすると、Fearlock が robots.txt を更新してAIボットアクセスを制御します
                        </p>
                      </div>
                    </div>
                                         <div className="flex items-center">
                       <button
                         type="button"
                         onClick={() => setRobotsManagement(!robotsManagement)}
                         className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                           robotsManagement 
                             ? 'bg-green-600 focus:ring-green-500' 
                             : 'bg-gray-200 dark:bg-gray-600 focus:ring-gray-500'
                         }`}
                         role="switch"
                         aria-checked={robotsManagement}
                       >
                         <span 
                           className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                             robotsManagement ? 'translate-x-5' : 'translate-x-0'
                           }`}
                         />
                       </button>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Record Scanning */}
            {domainSetupStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    既存のDNSレコードをスキャン
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {newDomainForm.name} の既存のDNSレコードをスキャンして、Fearlockに移行します。
                  </p>
                </div>

                {!isScanning && scannedRecords.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <GlobeAltIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      DNSレコードをスキャンしてドメインの移行を簡単にします
                    </p>
                    <button
                      onClick={handleScanRecords}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      レコードをスキャン
                    </button>
                  </div>
                )}

                {isScanning && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      DNSレコードをスキャン中...
                    </p>
                  </div>
                )}

                {!isScanning && scannedRecords.length > 0 && (
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                      ✓ {scannedRecords.length} 個のレコードが見つかりました
                    </p>
                    <button
                      onClick={() => setDomainSetupStep(3)}
                      className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      レコードを確認
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Record Selection */}
            {domainSetupStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    DNSレコードを選択
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Fearlockに移行するレコードを選択してください。
                  </p>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {scannedRecords.map((record, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={record.selected}
                          onChange={() => handleRecordToggle(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        />
                        
                        {record.isNew ? (
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <h6 className="text-sm font-medium text-gray-900 dark:text-white">新しいレコード</h6>
                              <button
                                onClick={() => handleRemoveRecord(index)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <select
                                value={record.type}
                                onChange={(e) => handleRecordChange(index, 'type', e.target.value)}
                                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              >
                                <option value="A">A</option>
                                <option value="AAAA">AAAA</option>
                                <option value="CNAME">CNAME</option>
                                <option value="MX">MX</option>
                                <option value="TXT">TXT</option>
                              </select>
                              <input
                                type="text"
                                placeholder="名前"
                                value={record.name}
                                onChange={(e) => handleRecordChange(index, 'name', e.target.value)}
                                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                              <input
                                type="text"
                                placeholder="値"
                                value={record.value}
                                onChange={(e) => handleRecordChange(index, 'value', e.target.value)}
                                className="col-span-2 text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {record.type}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {record.name === '@' ? newDomainForm.name : `${record.name}.${newDomainForm.name}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              → {record.value}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddNewRecord}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  + 新しいレコードを追加
                </button>
              </div>
            )}

            {/* Step 4: Activation */}
            {domainSetupStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    ネームサーバーを変更
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    ドメインレジストラーで以下のネームサーバーに変更してください。
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Fearlockネームサーバー:
                  </h5>
                  <div className="space-y-2">
                    {nameservers.map((ns, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <code className="text-sm bg-white dark:bg-gray-800 px-2 py-1 rounded border">
                          {ns}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(ns)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          コピー
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 変更が反映されるまで最大48時間かかる場合があります。
                  </p>
                </div>

                <button
                  onClick={handleActivateDomain}
                  className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  設定を確認
                </button>
              </div>
            )}

            {/* Step 5: Completion */}
            {domainSetupStep === 5 && (
              <div className="space-y-4 text-center">
                {setupComplete ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      セットアップが完了しました！
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {newDomainForm.name} がFearlockで正常に設定されました。
                    </p>
                    <button
                      onClick={handleAddDomain}
                      className="px-6 py-2 bg-green-600 dark:bg-green-500 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600"
                    >
                      完了
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                      <InformationCircleIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      ネームサーバーの変更を確認
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      まだネームサーバーが変更されていません。以下の手順に従って設定してください。
                    </p>
                    <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        設定手順:
                      </h5>
                      <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                        <li>ドメインレジストラーにログイン</li>
                        <li>DNS設定またはネームサーバー設定を開く</li>
                        <li>上記のFearlockネームサーバーに変更</li>
                        <li>変更を保存</li>
                      </ol>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleActivateDomain}
                        className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
                      >
                        再確認
                      </button>
                      <button
                        onClick={handleAddDomain}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        後で設定
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            {domainSetupStep < 5 && (
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    if (domainSetupStep === 1) {
                      resetDomainModal()
                    } else {
                      setDomainSetupStep(domainSetupStep - 1)
                    }
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {domainSetupStep === 1 ? 'キャンセル' : '戻る'}
                </button>
                
                {domainSetupStep < 4 && (
                  <button
                    onClick={() => {
                      if (domainSetupStep === 1 && !newDomainForm.name.trim()) return
                      setDomainSetupStep(domainSetupStep + 1)
                    }}
                    disabled={domainSetupStep === 1 && !newDomainForm.name.trim()}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {domainSetupStep === 1 ? '続行' : domainSetupStep === 2 && scannedRecords.length === 0 ? 'スキップ' : '次へ'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 