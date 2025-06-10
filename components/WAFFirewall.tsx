'use client'

import { useState } from 'react'
import {
  ShieldCheckIcon,
  FireIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PowerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  StopIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const firewallRules = [
  {
    id: 1,
    name: 'Block Malicious IPs',
    type: 'IP Block',
    source: '192.168.1.0/24',
    destination: 'Any',
    port: 'Any',
    action: 'Block',
    status: 'active',
    priority: 1,
    description: '悪意のあるIPアドレスからのアクセスをブロック',
    created: '2024-01-15',
    hitCount: 1247,
  },
  {
    id: 2,
    name: 'Allow HTTP/HTTPS',
    type: 'Port Allow',
    source: 'Any',
    destination: 'Web Servers',
    port: '80,443',
    action: 'Allow',
    status: 'active',
    priority: 2,
    description: 'HTTP/HTTPSトラフィックを許可',
    created: '2024-01-14',
    hitCount: 45234,
  },
  {
    id: 3,
    name: 'Block SQL Injection',
    type: 'WAF Rule',
    source: 'Any',
    destination: 'API Gateway',
    port: '443',
    action: 'Block',
    status: 'active',
    priority: 3,
    description: 'SQLインジェクション攻撃をブロック',
    created: '2024-01-13',
    hitCount: 89,
  },
  {
    id: 4,
    name: 'DDoS Protection',
    type: 'Rate Limit',
    source: 'Any',
    destination: 'Load Balancer',
    port: 'Any',
    action: 'Rate Limit',
    status: 'inactive',
    priority: 4,
    description: 'DDoS攻撃を防ぐためのレート制限',
    created: '2024-01-12',
    hitCount: 0,
  },
]

const wafAttacks = [
  {
    id: 1,
    type: 'SQL Injection',
    source: '203.0.113.45',
    target: '/api/users',
    blocked: true,
    severity: 'high',
    timestamp: '2024-01-15 14:32:15',
    payload: "'; DROP TABLE users; --",
  },
  {
    id: 2,
    type: 'XSS Attempt',
    source: '198.51.100.22',
    target: '/profile',
    blocked: true,
    severity: 'medium',
    timestamp: '2024-01-15 14:28:43',
    payload: '<script>alert("xss")</script>',
  },
  {
    id: 3,
    type: 'Path Traversal',
    source: '192.0.2.15',
    target: '/files',
    blocked: true,
    severity: 'high',
    timestamp: '2024-01-15 14:15:22',
    payload: '../../../etc/passwd',
  },
  {
    id: 4,
    type: 'Brute Force',
    source: '203.0.113.78',
    target: '/login',
    blocked: false,
    severity: 'low',
    timestamp: '2024-01-15 14:10:05',
    payload: 'Multiple login attempts',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getRuleStatusColor(status: string) {
  return status === 'active' ? 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30' : 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high':
      return 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30'
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30'
    case 'low':
      return 'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
    default:
      return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
  }
}

export default function WAFFirewall() {
  const [selectedTab, setSelectedTab] = useState('rules')
  const [showRuleModal, setShowRuleModal] = useState(false)

  const tabs = [
    { id: 'rules', name: 'ファイアウォールルール', icon: ShieldCheckIcon },
    { id: 'attacks', name: '攻撃ログ', icon: FireIcon },
    { id: 'monitoring', name: 'リアルタイム監視', icon: EyeIcon },
  ]

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          WAF / Firewall
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Web Application Firewallとネットワークファイアウォールの統合管理
        </p>
      </div>

      {/* 統計カード */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">アクティブルール</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {firewallRules.filter(rule => rule.status === 'active').length}
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
                <FireIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">今日のブロック</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">1,423</dd>
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">攻撃試行</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">89</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">稼働率</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">99.9%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 dark:border-gray-600">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={classNames(
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2'
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ファイアウォールルール */}
      {selectedTab === 'rules' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                ファイアウォールルール
              </h3>
              <button
                onClick={() => setShowRuleModal(true)}
                className="flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                <PlusIcon className="w-4 h-4" />
                新しいルール
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ルール名
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      送信元
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      宛先
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ポート
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      アクション
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ヒット数
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">アクション</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {firewallRules.map((rule, index) => (
                    <motion.tr
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{rule.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{rule.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {rule.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {rule.source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {rule.destination}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {rule.port}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={classNames(
                          rule.action === 'Block' ? 'text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/30' :
                          rule.action === 'Allow' ? 'text-green-600 dark:text-green-300 bg-green-100 dark:bg-green-900/30' :
                          'text-yellow-600 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30',
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                        )}>
                          {rule.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={classNames(
                          getRuleStatusColor(rule.status),
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                        )}>
                          {rule.status === 'active' ? 'アクティブ' : '無効'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {rule.hitCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                            <PowerIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* 攻撃ログ */}
      {selectedTab === 'attacks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-6">
              攻撃ログ（最新100件）
            </h3>

            <div className="space-y-4">
              {wafAttacks.map((attack, index) => (
                <motion.div
                  key={attack.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {attack.blocked ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{attack.type}</h4>
                          <span className={classNames(
                            getSeverityColor(attack.severity),
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium'
                          )}>
                            {attack.severity.toUpperCase()}
                          </span>
                          <span className={classNames(
                            attack.blocked ? 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30' : 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30',
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium'
                          )}>
                            {attack.blocked ? 'ブロック済み' : '通過'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>送信元: {attack.source}</span>
                          <span>対象: {attack.target}</span>
                          <span>時刻: {attack.timestamp}</span>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-600 rounded p-2 text-xs font-mono text-gray-700 dark:text-gray-300">
                          {attack.payload}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* リアルタイム監視 */}
      {selectedTab === 'monitoring' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-6">
              リアルタイム監視
            </h3>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">現在のトラフィック</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>総リクエスト/秒</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>ブロック済み/秒</span>
                    <span className="font-medium text-red-600 dark:text-red-400">23</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>許可済み/秒</span>
                    <span className="font-medium text-green-600 dark:text-green-400">1,224</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">システム状態</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>WAF状態</span>
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      稼働中
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>ファイアウォール状態</span>
                    <span className="inline-flex items-center text-green-600 dark:text-green-400">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      稼働中
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>最終更新</span>
                    <span className="font-medium">2024-01-15 14:35:22</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 