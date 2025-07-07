'use client'

import { useState } from 'react'
import {
  LinkIcon,
  CodeBracketIcon,
  PlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  TrashIcon,
  EyeIcon,
  KeyIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const integrationTypes = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub リポジトリとの連携',
    icon: CodeBracketIcon,
    color: 'bg-gray-900',
    textColor: 'text-white',
    features: ['リポジトリスキャン', 'PR統合', 'Issues連携', 'Webhooks'],
  },
  {
    id: 'gitlab',
    name: 'GitLab',
    description: 'GitLab リポジトリとの連携',
    icon: CodeBracketIcon,
    color: 'bg-orange-500',
    textColor: 'text-white',
    features: ['リポジトリスキャン', 'MR統合', 'Issues連携', 'CI/CD統合'],
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description: 'Bitbucket リポジトリとの連携',
    icon: CodeBracketIcon,
    color: 'bg-blue-600',
    textColor: 'text-white',
    features: ['リポジトリスキャン', 'PR統合', 'Pipelines統合'],
  },
  {
    id: 'azure',
    name: 'Azure DevOps',
    description: 'Azure DevOps との連携',
    icon: CodeBracketIcon,
    color: 'bg-blue-500',
    textColor: 'text-white',
    features: ['リポジトリスキャン', 'Work Items', 'Build統合'],
  },
]

const connectedIntegrations = [
  {
    id: 1,
    type: 'github',
    name: 'GitHub Enterprise',
    url: 'https://github.com/company',
    status: 'connected',
    lastSync: '2024-01-15 14:30',
    repositories: 12,
    webhooksEnabled: true,
  },
  {
    id: 2,
    type: 'gitlab',
    name: 'GitLab Self-Hosted',
    url: 'https://gitlab.company.com',
    status: 'error',
    lastSync: '2024-01-14 10:15',
    repositories: 8,
    webhooksEnabled: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'connected':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'error':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    case 'pending':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />
    default:
      return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'connected':
      return 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30'
    case 'error':
      return 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30'
    case 'pending':
      return 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30'
    default:
      return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
  }
}

export default function Integrations() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)

  const tabs = [
    { id: 'overview', name: '概要', icon: EyeIcon },
    { id: 'connected', name: '接続済み', icon: LinkIcon },
    { id: 'settings', name: '設定', icon: Cog6ToothIcon },
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          外部連携管理
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          GitHub、GitLab等のソースコード管理システムとの連携設定
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium flex items-center space-x-1'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 概要タブ */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* 統計カード */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <LinkIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        接続済み
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {connectedIntegrations.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CodeBracketIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        監視中リポジトリ
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {connectedIntegrations.reduce((sum, integration) => sum + integration.repositories, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        正常稼働
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {connectedIntegrations.filter(i => i.status === 'connected').length}/{connectedIntegrations.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 利用可能な連携 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  利用可能な連携
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  新規連携
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {integrationTypes.map((integration) => (
                  <div
                    key={integration.id}
                    className="relative rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <div className="flex-shrink-0">
                      <div className={classNames(
                        integration.color,
                        integration.textColor,
                        'h-10 w-10 rounded-lg flex items-center justify-center'
                      )}>
                        <integration.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href="#" className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {integration.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {integration.description}
                        </p>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 接続済みタブ */}
      {selectedTab === 'connected' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              接続済み連携
            </h3>
            
            <div className="space-y-4">
              {connectedIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(integration.status)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {integration.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {integration.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={classNames(
                        getStatusColor(integration.status),
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                      )}>
                        {integration.status === 'connected' ? '接続中' : 
                         integration.status === 'error' ? 'エラー' : '保留中'}
                      </span>
                      <button className="text-gray-400 hover:text-gray-500">
                        <Cog6ToothIcon className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">リポジトリ数:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                        {integration.repositories}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">最終同期:</span>
                      <span className="ml-1 font-medium text-gray-900 dark:text-gray-100">
                        {integration.lastSync}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Webhooks:</span>
                      <span className={classNames(
                        integration.webhooksEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
                        'ml-1 font-medium'
                      )}>
                        {integration.webhooksEnabled ? '有効' : '無効'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 設定タブ */}
      {selectedTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              連携設定
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  自動スキャン間隔
                </label>
                <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>毎時</option>
                  <option>4時間毎</option>
                  <option>12時間毎</option>
                  <option>24時間毎</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Webhook設定
                </label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">プッシュイベント</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">プルリクエストイベント</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">リリースイベント</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API率制限
                </label>
                <input
                  type="number"
                  defaultValue={1000}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  1時間あたりのAPI呼び出し回数制限
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 