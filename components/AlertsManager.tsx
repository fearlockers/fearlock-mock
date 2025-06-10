'use client'

import { useState } from 'react'
import {
  BellIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const alerts = [
  {
    id: 1,
    type: 'critical',
    title: 'セキュリティ侵害検知',
    message: '不正なログイン試行が複数回検知されました',
    source: 'Authentication System',
    timestamp: '2024-01-15 14:23:45',
    status: 'unread',
    severity: 'critical',
  },
  {
    id: 2,
    type: 'warning',
    title: 'SSL証明書期限警告',
    message: 'SSL証明書の有効期限が7日以内に切れます',
    source: 'Certificate Monitor',
    timestamp: '2024-01-15 13:45:23',
    status: 'read',
    severity: 'high',
  },
  {
    id: 3,
    type: 'info',
    title: 'システムメンテナンス完了',
    message: '定期メンテナンスが正常に完了しました',
    source: 'System Manager',
    timestamp: '2024-01-15 12:00:00',
    status: 'acknowledged',
    severity: 'low',
  },
  {
    id: 4,
    type: 'warning',
    title: 'リソース使用率警告',
    message: 'CPU使用率が90%を超えています',
    source: 'Resource Monitor',
    timestamp: '2024-01-15 11:30:15',
    status: 'unread',
    severity: 'medium',
  },
  {
    id: 5,
    type: 'critical',
    title: 'データベース接続エラー',
    message: 'メインデータベースへの接続が失敗しています',
    source: 'Database Monitor',
    timestamp: '2024-01-15 10:15:30',
    status: 'escalated',
    severity: 'critical',
  },
]

const alertRules = [
  { id: 1, name: 'セキュリティ侵害検知', enabled: true, severity: 'critical' },
  { id: 2, name: 'SSL証明書期限警告', enabled: true, severity: 'high' },
  { id: 3, name: 'リソース使用率警告', enabled: true, severity: 'medium' },
  { id: 4, name: 'ネットワーク遅延警告', enabled: false, severity: 'medium' },
  { id: 5, name: 'ディスク容量警告', enabled: true, severity: 'low' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getAlertColor(type: string) {
  switch (type) {
    case 'critical':
      return 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
    case 'info':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
    default:
      return 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600'
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'unread':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
    case 'read':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    case 'acknowledged':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    case 'escalated':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
  }
}

export default function AlertsManager() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showRules, setShowRules] = useState(false)

  const filteredAlerts = alerts.filter(alert => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return alert.status === 'unread'
    if (selectedFilter === 'critical') return alert.severity === 'critical'
    return alert.type === selectedFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
            アラート管理
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            セキュリティアラートとインシデント管理
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRules(!showRules)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            アラートルール
          </button>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            {alerts.filter(a => a.status === 'unread').length} 未読
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">クリティカル</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {alerts.filter(a => a.severity === 'critical').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">警告</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {alerts.filter(a => a.type === 'warning').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BellIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">未読</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {alerts.filter(a => a.status === 'unread').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">対応済み</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {alerts.filter(a => a.status === 'acknowledged').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              アラート一覧
            </h3>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">すべて</option>
                <option value="unread">未読</option>
                <option value="critical">クリティカル</option>
                <option value="warning">警告</option>
                <option value="info">情報</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={classNames(
                  getAlertColor(alert.type),
                  'rounded-lg p-4 border'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      <span className={classNames(
                        getSeverityBadge(alert.severity),
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium'
                      )}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={classNames(
                        getStatusBadge(alert.status),
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium'
                      )}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs">
                      <span>ソース: {alert.source}</span>
                      <span>•</span>
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="確認済みにする"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="アラートを削除"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              アラートルール設定
            </h3>
            <div className="space-y-3">
              {alertRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        className="h-4 w-4 text-blue-600 rounded"
                        readOnly
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                      <span className={classNames(
                        getSeverityBadge(rule.severity),
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-1'
                      )}>
                        {rule.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {rule.enabled ? (
                      <EyeIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 