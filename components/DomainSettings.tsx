'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  GlobeAltIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import type { Domain, Subdomain, DnsRecord } from '@/lib/auth'

export default function DomainSettings() {
  const { getOrganizationDomains, createDomain, updateDomain, deleteDomain, organization } = useAuth()
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [showAddDomainModal, setShowAddDomainModal] = useState(false)
  const [editingDomainId, setEditingDomainId] = useState<string | null>(null)
  const [editDomainForm, setEditDomainForm] = useState({
    name: '',
    description: '',
    isPrimary: false,
    status: 'active' as 'active' | 'pending' | 'inactive',
    ssl_enabled: false,
    ai_blocking: 'block-harmful' as 'block-all' | 'block-harmful' | 'allow-all',
    robots_management: true
  })
  const [domainSetupStep, setDomainSetupStep] = useState(1)
  const [newDomainForm, setNewDomainForm] = useState({
    name: '',
    description: '',
    isPrimary: false
  })
  const [aiBlockOption, setAiBlockOption] = useState<'block-all' | 'block-harmful' | 'allow-all'>('block-harmful')
  const [robotsManagement, setRobotsManagement] = useState(true)
  const [scannedRecords, setScannedRecords] = useState<any[]>([])
  const [selectedRecords, setSelectedRecords] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [nameservers] = useState([
    'ns1.fearlock.com',
    'ns2.fearlock.com'
  ])
  const [setupComplete, setSetupComplete] = useState(false)
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [domainCreationSuccess, setDomainCreationSuccess] = useState(false)
  const [domainUpdateSuccess, setDomainUpdateSuccess] = useState(false)
  const [isCreatingDomain, setIsCreatingDomain] = useState(false)

  // ドメイン一覧を読み込み
  const loadDomains = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getOrganizationDomains()
      if (result.success && result.data) {
        setDomains(result.data)
      } else {
        setError(result.error || 'ドメインの読み込みに失敗しました')
      }
    } catch (error: any) {
      setError(error.message || 'ドメインの読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  // 組織が利用可能になったらドメインを読み込み
  useEffect(() => {
    if (organization?.id) {
      loadDomains()
    }
  }, [organization?.id])

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
    const newRecord = {
      type: 'A',
      name: '',
      value: '',
      ttl: 3600,
      selected: true
    }
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
  }

  const checkNameservers = async () => {
    // Simulate nameserver check
    setTimeout(() => {
      setSetupComplete(true)
    }, 3000)
  }

  const handleActivateDomain = async () => {
    await checkNameservers()
  }

  const handleAddDomain = async () => {
    if (domainSetupStep === 1 && newDomainForm.name.trim()) {
      // ドメイン名の基本的なバリデーション
      const domainName = newDomainForm.name.trim()
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      
      if (!domainRegex.test(domainName)) {
        setError('有効なドメイン名を入力してください（例: example.com）')
        return
      }

      if (domainName.length > 253) {
        setError('ドメイン名が長すぎます（最大253文字）')
        return
      }

      setDomainSetupStep(2)
      handleScanRecords()
    } else if (domainSetupStep === 2) {
      setDomainSetupStep(3)
    } else if (domainSetupStep === 3) {
      setDomainSetupStep(4)
    } else if (domainSetupStep === 4) {
      setDomainSetupStep(5)
      handleActivateDomain()
    } else if (domainSetupStep === 5) {
      // ドメインをデータベースに追加
      try {
        setIsCreatingDomain(true)
        setError(null)
        
        console.log('🔍 ドメイン作成開始:', {
          name: newDomainForm.name,
          description: newDomainForm.description,
          is_primary: newDomainForm.isPrimary,
          ai_blocking: aiBlockOption,
          robots_management: robotsManagement
        })

        // 組織IDの確認
        if (!organization?.id) {
          setError('組織情報が見つかりません。ページを再読み込みしてください。')
          return
        }

        const result = await createDomain({
          name: newDomainForm.name,
          description: newDomainForm.description,
          is_primary: newDomainForm.isPrimary,
          ai_blocking: aiBlockOption,
          robots_management: robotsManagement
        })

        console.log('🔍 ドメイン作成結果:', result)

        if (result.success && result.data) {
          // ドメイン一覧を再読み込み
          await loadDomains()
          // 成功状態を設定
          setDomainCreationSuccess(true)
          // 成功メッセージを表示してからモーダルを閉じる
          setTimeout(() => {
            resetDomainModal()
          }, 3000)
        } else {
          console.error('❌ ドメイン作成失敗:', result.error)
          setError(result.error || 'ドメインの作成に失敗しました')
        }
      } catch (error: any) {
        console.error('❌ ドメイン作成エラー:', error)
        setError(error.message || 'ドメインの作成に失敗しました')
      } finally {
        setIsCreatingDomain(false)
      }
    }
  }

  const resetDomainModal = () => {
    setShowAddDomainModal(false)
    setDomainSetupStep(1)
    setNewDomainForm({ name: '', description: '', isPrimary: false })
    setScannedRecords([])
    setSelectedRecords([])
    setSetupComplete(false)
    setDomainCreationSuccess(false)
    setError(null)
  }

  const handleDomainFormChange = (field: string, value: string | boolean) => {
    setNewDomainForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEditDomainFormChange = (field: string, value: string | boolean) => {
    setEditDomainForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAiBlockOptionChange = (value: 'block-all' | 'block-harmful' | 'allow-all') => {
    setAiBlockOption(value)
  }

  const handleDomainClick = (domain: Domain) => {
    setEditingDomainId(domain.id)
    setEditDomainForm({
      name: domain.name,
      description: domain.description || '',
      isPrimary: domain.is_primary,
      status: domain.status,
      ssl_enabled: domain.ssl_enabled,
      ai_blocking: domain.ai_blocking,
      robots_management: domain.robots_management
    })
  }

  const handleUpdateDomain = async () => {
    if (!editingDomainId) return

    try {
      const result = await updateDomain(editingDomainId, {
        name: editDomainForm.name,
        description: editDomainForm.description,
        is_primary: editDomainForm.isPrimary,
        status: editDomainForm.status,
        ssl_enabled: editDomainForm.ssl_enabled,
        ai_blocking: editDomainForm.ai_blocking,
        robots_management: editDomainForm.robots_management
      })

      if (result.success && result.data) {
        // ドメイン一覧を再読み込み
        await loadDomains()
        setDomainUpdateSuccess(true)
        // 成功メッセージを表示してから編集モードを終了
        setTimeout(() => {
          resetEditDomain()
        }, 2000)
      } else {
        setError(result.error || 'ドメインの更新に失敗しました')
      }
    } catch (error: any) {
      setError(error.message || 'ドメインの更新に失敗しました')
    }
  }

  const resetEditDomain = () => {
    setEditingDomainId(null)
    setEditDomainForm({
      name: '',
      description: '',
      isPrimary: false,
      status: 'active',
      ssl_enabled: false,
      ai_blocking: 'block-harmful',
      robots_management: true
    })
    setDomainUpdateSuccess(false)
    setError(null)
  }

  const cancelEdit = () => {
    resetEditDomain()
  }

  return (
    <div className="space-y-6">
      {/* Domain Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ドメイン管理</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            組織のドメインとサブドメインを管理します
          </p>
        </div>
        <button
          onClick={() => setShowAddDomainModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          ドメインを追加
        </button>
      </div>

      {/* Domain List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">ドメインを読み込み中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={loadDomains}
              className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              再試行
            </button>
          </div>
        ) : domains.length === 0 ? (
          <div className="text-center py-8">
            <GlobeAltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">ドメインが登録されていません</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">「ドメインを追加」ボタンから新しいドメインを追加してください</p>
          </div>
        ) : (
          domains.map((domain) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-600 transition-shadow duration-200 ${
                editingDomainId === domain.id ? 'ring-2 ring-blue-500' : 'cursor-pointer hover:shadow-lg'
              }`}
              onClick={() => editingDomainId !== domain.id && handleDomainClick(domain)}
            >
              <div className="px-4 py-5 sm:p-6">
                {editingDomainId === domain.id ? (
                  // インライン編集モード
                  <div className="space-y-4">
                    {domainUpdateSuccess && (
                      <div className="p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm">
                        ドメインの更新が完了しました！
                      </div>
                    )}
                    {error && (
                      <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ドメイン名
                        </label>
                        <input
                          type="text"
                          value={editDomainForm.name}
                          onChange={(e) => handleEditDomainFormChange('name', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ステータス
                        </label>
                        <select
                          value={editDomainForm.status}
                          onChange={(e) => handleEditDomainFormChange('status', e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="active">アクティブ</option>
                          <option value="pending">保留中</option>
                          <option value="inactive">非アクティブ</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        説明
                      </label>
                      <textarea
                        rows={3}
                        value={editDomainForm.description}
                        onChange={(e) => handleEditDomainFormChange('description', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editDomainForm.isPrimary}
                          onChange={(e) => handleEditDomainFormChange('isPrimary', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          プライマリドメイン
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editDomainForm.ssl_enabled}
                          onChange={(e) => handleEditDomainFormChange('ssl_enabled', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          SSL有効
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editDomainForm.robots_management}
                          onChange={(e) => handleEditDomainFormChange('robots_management', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          robots.txt管理
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        AIブロッキング設定
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="block-all"
                            checked={editDomainForm.ai_blocking === 'block-all'}
                            onChange={(e) => handleEditDomainFormChange('ai_blocking', e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">すべてのAIボットをブロック</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="block-harmful"
                            checked={editDomainForm.ai_blocking === 'block-harmful'}
                            onChange={(e) => handleEditDomainFormChange('ai_blocking', e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">有害なAIボットのみブロック</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="allow-all"
                            checked={editDomainForm.ai_blocking === 'allow-all'}
                            onChange={(e) => handleEditDomainFormChange('ai_blocking', e.target.value)}
                            className="h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">すべて許可</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleUpdateDomain}
                        disabled={!editDomainForm.name.trim()}
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        更新
                      </button>
                    </div>
                  </div>
                ) : (
                  // 通常表示モード
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="w-6 h-6 text-blue-500" />
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{domain.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{domain.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {domain.is_primary && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            プライマリ
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          domain.status === 'active' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          domain.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {domain.status === 'active' ? 'アクティブ' : domain.status === 'pending' ? '保留中' : '非アクティブ'}
                        </span>
                      </div>
                    </div>

                {/* Domain Status */}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    {domain.dns_status === 'verified' ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      DNS: {domain.dns_status === 'verified' ? '認証済み' : domain.dns_status === 'failed' ? '認証失敗' : '未認証'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {domain.ssl_enabled ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      SSL: {domain.ssl_enabled ? '有効' : '無効'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      AIブロック: {domain.ai_blocking === 'block-all' ? '全ブロック' : domain.ai_blocking === 'block-harmful' ? '有害のみ' : '許可'}
                    </span>
                  </div>
                </div>
              </>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Domain Modal */}
      {showAddDomainModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">ドメインを追加</h3>
                <button
                  onClick={resetDomainModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* エラーメッセージ表示 */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md text-sm">
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    <span>{error}</span>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                  >
                    エラーをクリア
                  </button>
                </div>
              )}

              {/* 成功メッセージ表示 */}
              {domainCreationSuccess && (
                <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md text-sm">
                  <div className="flex items-center">
                    <CheckCircleIcon className="w-4 h-4 mr-2" />
                    <span>ドメインが正常に作成されました！</span>
                  </div>
                </div>
              )}

              {/* Step 1: Domain Information */}
              {domainSetupStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      ドメイン名
                    </label>
                    <input
                      type="text"
                      value={newDomainForm.name}
                      onChange={(e) => handleDomainFormChange('name', e.target.value)}
                      placeholder="example.com"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      説明
                    </label>
                    <textarea
                      rows={3}
                      value={newDomainForm.description}
                      onChange={(e) => handleDomainFormChange('description', e.target.value)}
                      placeholder="ドメインの用途や説明"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newDomainForm.isPrimary}
                      onChange={(e) => handleDomainFormChange('isPrimary', e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      プライマリドメインとして設定
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: DNS Records */}
              {domainSetupStep === 2 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">DNSレコードの確認</h4>
                  {isScanning ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">DNSレコードをスキャン中...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {scannedRecords.map((record, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={record.selected}
                            onChange={() => handleRecordToggle(index)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {record.type} {record.name} → {record.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: AI Blocking */}
              {domainSetupStep === 3 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">AIブロッキング設定</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="block-all"
                        checked={aiBlockOption === 'block-all'}
                        onChange={(e) => handleAiBlockOptionChange(e.target.value as 'block-all' | 'block-harmful' | 'allow-all')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">すべてのAIボットをブロック</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="block-harmful"
                        checked={aiBlockOption === 'block-harmful'}
                        onChange={(e) => handleAiBlockOptionChange(e.target.value as 'block-all' | 'block-harmful' | 'allow-all')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">有害なAIボットのみブロック</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="allow-all"
                        checked={aiBlockOption === 'allow-all'}
                        onChange={(e) => handleAiBlockOptionChange(e.target.value as 'block-all' | 'block-harmful' | 'allow-all')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">すべて許可</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Robots.txt Management */}
              {domainSetupStep === 4 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Robots.txt管理</h4>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={robotsManagement}
                      onChange={(e) => setRobotsManagement(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Fearlockでrobots.txtを管理する
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    このオプションを有効にすると、Fearlockが自動的にrobots.txtファイルを生成・管理します。
                  </p>
                </div>
              )}

              {/* Step 5: Completion */}
              {domainSetupStep === 5 && (
                <div className="space-y-4 text-center">
                  {domainCreationSuccess ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        ドメインの追加が完了しました！
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {newDomainForm.name} が正常に追加されました。
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        このウィンドウは自動的に閉じられます...
                      </p>
                    </>
                  ) : setupComplete ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        セットアップが完了しました！
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {newDomainForm.name} がFearlockで正常に設定されました。
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                        <InformationCircleIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                        ネームサーバーの変更を確認
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        まだネームサーバーが変更されていません。以下の手順に従って設定してください。
                      </p>
                      <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                          設定手順:
                        </h5>
                        <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
                          <li>ドメインレジストラーにログイン</li>
                          <li>DNS設定またはネームサーバー設定を開く</li>
                          <li>上記のFearlockネームサーバーに変更</li>
                          <li>変更を保存</li>
                        </ol>
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
                  
                  <button
                    onClick={handleAddDomain}
                    disabled={domainSetupStep === 1 && !newDomainForm.name.trim() || isCreatingDomain}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isCreatingDomain ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        作成中...
                      </div>
                    ) : domainSetupStep === 5 ? (
                      'ドメインを作成'
                    ) : (
                      '次へ'
                    )}
                  </button>
                </div>
              )}

              {domainSetupStep === 5 && !domainCreationSuccess && (
                <div className="mt-6 flex space-x-3">
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
                    ドメインを追加
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  )
} 