'use client'

import { useState, useRef, useEffect } from 'react'
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
  BookOpenIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  BugAntIcon,
  PlayIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/useAuth'
import OrganizationSettings from './OrganizationSettings'
import DomainSettings from './DomainSettings'
import OrganizationMembershipManager from './OrganizationMembershipManager'

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
  const [helpSubTab, setHelpSubTab] = useState('getting-started')
  const { theme, setTheme } = useTheme()
  const { user, profile, organization, updateProfile, updateAvatar } = useAuth()
  
  // プロフィール編集用の状態
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
  })
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // プロフィールデータが更新された時にフォームを同期
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      })
  }
  }, [profile])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 handleProfileSubmit called')
    console.log('🔍 profileForm data:', profileForm)
    setIsUpdatingProfile(true)
    setUpdateMessage(null)

    try {
      console.log('🔍 Calling updateProfile...')
      const result = await updateProfile(profileForm)
      console.log('🔍 updateProfile result:', result)
      
      if (result.success) {
        console.log('✅ Profile update successful')
        setUpdateMessage({ type: 'success', text: 'プロフィールが正常に更新されました' })
        setTimeout(() => setUpdateMessage(null), 3000)
      } else {
        console.error('❌ Profile update failed:', result.error)
        setUpdateMessage({ type: 'error', text: result.error?.message || 'プロフィールの更新に失敗しました' })
      }
    } catch (error) {
      console.error('❌ Unexpected error in handleProfileSubmit:', error)
      setUpdateMessage({ type: 'error', text: 'プロフィールの更新に失敗しました' })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ファイルサイズチェック（2MB制限）
    if (file.size > 2 * 1024 * 1024) {
      setUpdateMessage({ type: 'error', text: 'ファイルサイズは2MB以下にしてください' })
      return
    }

    // ファイル形式チェック
    if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
      setUpdateMessage({ type: 'error', text: 'JPEG、PNG、GIF形式のファイルを選択してください' })
      return
    }

    setIsUploadingAvatar(true)
    setUpdateMessage(null)

    try {
      const result = await updateAvatar(file)
      if (result.success) {
        setUpdateMessage({ type: 'success', text: 'プロフィール画像が正常に更新されました' })
        setTimeout(() => setUpdateMessage(null), 3000)
      } else {
        setUpdateMessage({ type: 'error', text: result.error?.message || 'プロフィール画像の更新に失敗しました' })
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'プロフィール画像の更新に失敗しました' })
    } finally {
      setIsUploadingAvatar(false)
      // ファイル入力をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleProfileFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({
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
        <div className="h-full overflow-y-auto custom-scrollbar">
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

                  {/* テーマ設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">テーマ設定</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <button
                              onClick={() => setTheme('light')}
                          className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                                theme === 'light'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                          <SunIcon className="w-6 h-6 text-yellow-500" />
                          <span className="ml-2 text-sm font-medium">ライト</span>
                            </button>
                            <button
                              onClick={() => setTheme('dark')}
                          className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                                theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                          <MoonIcon className="w-6 h-6 text-blue-500" />
                          <span className="ml-2 text-sm font-medium">ダーク</span>
                            </button>
                            <button
                              onClick={() => setTheme('system')}
                          className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                                theme === 'system'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                              }`}
                            >
                          <ComputerDesktopIcon className="w-6 h-6 text-gray-500" />
                          <span className="ml-2 text-sm font-medium">システム</span>
                            </button>
                          </div>
                        </div>
                          </div>
                          </div>
              )}

              {activeTab === 'organization' && (
                <OrganizationSettings organization={organization} />
              )}

              {activeTab === 'domain' && (
                <DomainSettings />
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">セキュリティ設定</h3>
                  
                  {/* パスワード設定 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">パスワード設定</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">現在のパスワード</label>
                          <input 
                            type="password" 
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                          />
                        </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新しいパスワード</label>
                            <input 
                              type="password" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                          <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">新しいパスワード（確認）</label>
                            <input 
                              type="password" 
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                            />
                          </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          パスワードを変更
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 二要素認証 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">二要素認証</h4>
                        <div className="flex items-center justify-between">
                          <div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">二要素認証を有効にする</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">セキュリティを強化するために2FAを設定してください</p>
                          </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          設定
                          </button>
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
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">メール通知</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">セキュリティアラート</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">重要なセキュリティイベントの通知</p>
                          </div>
                          <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">スキャン完了通知</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">脆弱性スキャンの完了通知</p>
                          </div>
                          <button className="bg-blue-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
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
                  
                  {/* アバター設定 */}
                    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">プロフィール画像</h4>
                          <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                <img 
                            className="h-20 w-20 rounded-full object-cover"
                            src={profile?.avatar_url || '/default-avatar.svg'}
                                  alt="プロフィール画像"
                                />
                            </div>
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                            accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                              >
                            {isUploadingAvatar ? 'アップロード中...' : '画像を変更'}
                              </button>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG, GIF形式、最大2MB
                              </p>
                        </div>
                      </div>
                            </div>
                          </div>
                          
                  {/* 基本情報 */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">基本情報</h4>
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">姓</label>
                              <input 
                                type="text" 
                                value={profileForm.last_name}
                                onChange={(e) => handleProfileFormChange('last_name', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">名</label>
                              <input 
                                type="text" 
                                value={profileForm.first_name}
                                onChange={(e) => handleProfileFormChange('first_name', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                              />
                            </div>
                        </div>
                        <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">メールアドレス</label>
                              <input 
                                type="email" 
                            value={profile?.email || ''}
                                disabled
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
                              />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            メールアドレスの変更は管理者にお問い合わせください
                              </p>
                            </div>
                            <button
                              type="submit"
                              disabled={isUpdatingProfile}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                          {isUpdatingProfile ? '更新中...' : 'プロフィールを更新'}
                            </button>
                  </form>
                    </div>
                  </div>

                  {/* 更新メッセージ */}
                  {updateMessage && (
                    <div className={`p-4 rounded-md ${
                      updateMessage.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                                }`}>
                      {updateMessage.text}
                </div>
              )}

                  {/* 組織メンバーシップ管理 */}
                  <OrganizationMembershipManager />
                          </div>
                        )}

              {activeTab === 'api' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">API設定</h3>
                  
                  {/* APIキー */}
                  <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">APIキー</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">現在のAPIキー</label>
                          <div className="flex">
                            <input 
                              type={showApiKey ? 'text' : 'password'} 
                              value="sk_test_1234567890abcdef1234567890abcdef12345678"
                              readOnly 
                              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-3 py-2 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                            />
                            <button 
                              onClick={() => setShowApiKey(!showApiKey)} 
                              className="px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700"
                            >
                              {showApiKey ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            新しいキーを生成
                            </button>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                            コピー
                                  </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">ヘルプ・サポート</h3>
                  
                  {/* ヘルプタブ */}
                  <div className="border-b border-gray-200 dark:border-gray-600">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { id: 'getting-started', name: 'はじめに', icon: LightBulbIcon },
                        { id: 'faq', name: 'よくある質問', icon: QuestionMarkCircleIcon },
                        { id: 'contact', name: 'お問い合わせ', icon: InformationCircleIcon },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setHelpSubTab(tab.id)}
                          className={`${
                            helpSubTab === tab.id
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

                  {/* ヘルプコンテンツ */}
                  <div className="py-4">
                  {helpSubTab === 'getting-started' && (
                    <div className="space-y-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Fearlockの使い方</h4>
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fearlockは、Webアプリケーションとネットワークのセキュリティを包括的に監視・保護するプラットフォームです。
                          </p>
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-4">主な機能</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                            <li>脆弱性診断とスキャン</li>
                            <li>リアルタイムセキュリティ監視</li>
                            <li>インシデント検出とアラート</li>
                            <li>セキュリティレポート生成</li>
                            </ul>
                      </div>
                    </div>
                  )}

                    {helpSubTab === 'faq' && (
                    <div className="space-y-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">よくある質問</h4>
                          <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Q: スキャンの頻度はどのくらいが適切ですか？</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              A: 本番環境では週1回、開発環境では日次でのスキャンを推奨しています。
                            </p>
                              </div>
                                    <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">Q: 誤検知の報告はどうすればよいですか？</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              A: 各脆弱性の詳細画面から「誤検知を報告」ボタンで報告できます。
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                    {helpSubTab === 'contact' && (
                    <div className="space-y-6">
                        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">お問い合わせ</h4>
                          <div className="space-y-4">
                            <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">サポートチーム</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              メール: support@fearlock.com<br />
                              電話: 03-1234-5678<br />
                              受付時間: 平日 9:00-18:00
                              </p>
                            </div>
                            <div>
                            <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">緊急時</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              セキュリティインシデントの場合は、24時間対応の緊急連絡先までご連絡ください。
                            </p>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 