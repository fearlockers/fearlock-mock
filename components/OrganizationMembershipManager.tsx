'use client'

import { useState, useEffect } from 'react'
import {
  BuildingOfficeIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

interface OrganizationMembershipManagerProps {
  className?: string
}

export default function OrganizationMembershipManager({ className = '' }: OrganizationMembershipManagerProps) {
  const { organizations, currentOrganizationId, setCurrentOrganization, leaveOrganization } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // 組織を切り替え
  const handleOrganizationSwitch = async (organizationId: string) => {
    try {
      setIsLoading(true)
      setMessage(null)
      await setCurrentOrganization(organizationId)
      setMessage({ type: 'success', text: '組織を切り替えました' })
      
      // 3秒後にメッセージを消す
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('組織切り替えエラー:', error)
      setMessage({ type: 'error', text: '組織の切り替えに失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  // 組織から脱退（現在の組織の場合は無効化）
  const handleLeaveOrganization = async (organizationId: string) => {
    if (organizationId === currentOrganizationId) {
      setMessage({ type: 'error', text: '現在の組織からは脱退できません。別の組織に切り替えてから脱退してください。' })
      return
    }

    if (!confirm('この組織から脱退しますか？この操作は取り消せません。')) {
      return
    }

    try {
      setIsLoading(true)
      setMessage(null)
      
      const result = await leaveOrganization(organizationId)
      
      if (result.success) {
        setMessage({ type: 'success', text: '組織から脱退しました' })
      } else {
        setMessage({ type: 'error', text: result.error || '組織からの脱退に失敗しました' })
      }
      
      // 3秒後にメッセージを消す
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('組織脱退エラー:', error)
      setMessage({ type: 'error', text: '組織からの脱退に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  // 組織に参加（招待リンクなど）
  const handleJoinOrganization = () => {
    // TODO: 組織参加の実装（招待リンク、検索など）
    setMessage({ type: 'info', text: '組織への参加は招待リンクまたは管理者からの招待が必要です。' })
    
    // 3秒後にメッセージを消す
    setTimeout(() => setMessage(null), 3000)
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 ${className}`}>
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2" />
            組織メンバーシップ
          </h4>
          
          <div className="text-center py-8">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">組織に所属していません</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              組織に参加するには招待リンクまたは管理者からの招待が必要です。
            </p>
            <div className="mt-6">
              <button
                onClick={handleJoinOrganization}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                組織に参加
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-md dark:shadow-lg rounded-lg border border-gray-200 dark:border-gray-600 ${className}`}>
      <div className="px-4 py-5 sm:p-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <BuildingOfficeIcon className="w-5 h-5 mr-2" />
          組織メンバーシップ
        </h4>

        {/* メッセージ表示 */}
        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : message.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' && <CheckIcon className="w-4 h-4 mr-2" />}
              {message.type === 'error' && <ExclamationTriangleIcon className="w-4 h-4 mr-2" />}
              {message.type === 'info' && <InformationCircleIcon className="w-4 h-4 mr-2" />}
              <span className="text-sm">{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 組織一覧 */}
        <div className="space-y-3">
          {organizations.map((org) => (
            <div
              key={org.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                org.id === currentOrganizationId
                  ? 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  org.id === currentOrganizationId
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`} />
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {org.name}
                  </h5>
                  {org.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {org.description}
                    </p>
                  )}
                  {(org as any).industry && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      業界: {(org as any).industry}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {org.id === currentOrganizationId ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    <CheckIcon className="w-3 h-3 mr-1" />
                    現在の組織
                  </span>
                ) : (
                  <button
                    onClick={() => handleOrganizationSwitch(org.id)}
                    disabled={isLoading}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    切り替え
                  </button>
                )}
                
                {organizations.length > 1 && org.id !== currentOrganizationId && (
                  <button
                    onClick={() => handleLeaveOrganization(org.id)}
                    disabled={isLoading}
                    className="inline-flex items-center p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-50"
                    title="組織から脱退"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 組織参加ボタン */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={handleJoinOrganization}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            新しい組織に参加
          </button>
        </div>

        {/* ヘルプテキスト */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>組織の切り替え:</strong> 異なる組織に切り替えると、その組織のプロジェクトや設定にアクセスできます。
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            <strong>組織からの脱退:</strong> 組織から脱退するには、別の組織に切り替えてから行ってください。
          </p>
        </div>
      </div>
    </div>
  )
}
