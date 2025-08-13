'use client'

import { useState, useEffect } from 'react'
import {
  BuildingOfficeIcon,
  InformationCircleIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LinkIcon,
  CreditCardIcon,
  PlusIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import type { Organization } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

interface OrganizationSettingsProps {
  organization: Organization | null
}

export default function OrganizationSettings({ organization }: OrganizationSettingsProps) {
  const [orgDetailTab, setOrgDetailTab] = useState('basic')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createMessage, setCreateMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [primaryDomain, setPrimaryDomain] = useState<{ name: string; id: string } | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    size: ''
  })
  
  const { createOrganization, getOrganizationPrimaryDomain, organization: currentOrg } = useAuth()

  // 組織情報が更新された場合の処理
  useEffect(() => {
    if (currentOrg && !organization) {
      // 組織が作成された場合、フォームを閉じる
      setShowCreateForm(false)
      setFormData({ name: '', description: '', industry: '', size: '' })
    }
  }, [currentOrg, organization])

  // 現在の組織情報を決定（propsまたはuseAuthから取得）
  const displayOrganization = organization || currentOrg

  // プライマリドメインを取得
  useEffect(() => {
    const fetchPrimaryDomain = async () => {
      if (displayOrganization?.id) {
        try {
          const result = await getOrganizationPrimaryDomain()
          if (result.success && result.data) {
            setPrimaryDomain({
              name: result.data.name,
              id: result.data.id
            })
          }
        } catch (error) {
          console.error('プライマリドメインの取得に失敗しました:', error)
        }
      }
    }

    fetchPrimaryDomain()
  }, [displayOrganization?.id, getOrganizationPrimaryDomain])

  // 組織作成処理
  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreateMessage(null)

    try {
      console.log('🔍 組織作成開始:', formData)
      const result = await createOrganization(formData)
      
      if (result.success) {
        setCreateMessage({ type: 'success', text: '組織が正常に作成されました' })
        setShowCreateForm(false)
        setFormData({ name: '', description: '', industry: '', size: '' })
        
        // 成功メッセージを3秒後に消す
        setTimeout(() => setCreateMessage(null), 3000)
        
        console.log('✅ 組織作成成功')
      } else {
        console.error('❌ 組織作成失敗:', result.error)
        setCreateMessage({ type: 'error', text: result.error || '組織の作成に失敗しました' })
      }
    } catch (error) {
      console.error('❌ 組織作成エラー:', error)
      setCreateMessage({ type: 'error', text: '組織の作成に失敗しました' })
    } finally {
      setIsCreating(false)
    }
  }

  // フォーム入力処理
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!displayOrganization) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">組織が設定されていません</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            組織を作成して、チームでのセキュリティ管理を開始しましょう。
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              組織を作成
            </button>
          </div>
        </div>

        {/* 組織作成フォーム */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">組織を作成</h4>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="sr-only">閉じる</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateOrganization} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    組織名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="例: 株式会社サンプル"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="組織の説明を入力してください"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      業界
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleFormChange('industry', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">選択してください</option>
                      <option value="technology">テクノロジー</option>
                      <option value="finance">金融</option>
                      <option value="healthcare">ヘルスケア</option>
                      <option value="education">教育</option>
                      <option value="retail">小売</option>
                      <option value="manufacturing">製造業</option>
                      <option value="consulting">コンサルティング</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      組織規模
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => handleFormChange('size', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">選択してください</option>
                      <option value="1-10">1-10人</option>
                      <option value="11-50">11-50人</option>
                      <option value="51-200">51-200人</option>
                      <option value="201-500">201-500人</option>
                      <option value="501-1000">501-1000人</option>
                      <option value="1000+">1000人以上</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !formData.name.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        作成中...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2" />
                        組織を作成
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* メッセージ表示 */}
              {createMessage && (
                <div className={`mt-4 p-4 rounded-md ${
                  createMessage.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {createMessage.text}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {displayOrganization.name} の組織設定
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
                  defaultValue={displayOrganization.name}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">説明</label>
                <textarea 
                  rows={3}
                  defaultValue={displayOrganization.description || ''}
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
                    defaultValue={primaryDomain?.name || displayOrganization.domain_id || '未設定'}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">プラン</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
                    <CreditCardIcon className="w-4 h-4" />
                  </span>
                  <select 
                    defaultValue={displayOrganization.plan}
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
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
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {primaryDomain?.name || displayOrganization.domain_id || '未設定'}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {primaryDomain ? '組織のプライマリドメイン' : 'ドメインが設定されていません'}
                    </p>
                  </div>
                </div>
                {primaryDomain ? (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    ✓ 認証済み
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                    未設定
                  </span>
                )}
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
                    {displayOrganization.plan} プラン
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    月額 ¥{displayOrganization.plan === 'enterprise' ? '50,000' : 
                           displayOrganization.plan === 'pro' ? '20,000' : '0'}
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
                    <LinkIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">アクティブ連携</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">5</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">セキュア接続</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">3</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 overflow-hidden rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCardIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">支払い方法</dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">2</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 