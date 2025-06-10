'use client'

import { useState } from 'react'
import {
  PlayIcon,
  StopIcon,
  ServerIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const networkTargets = [
  { id: 1, name: 'Web Server (192.168.1.10)', type: 'server', status: 'online' },
  { id: 2, name: 'Database Server (192.168.1.20)', type: 'database', status: 'online' },
  { id: 3, name: 'Load Balancer (192.168.1.5)', type: 'network', status: 'online' },
  { id: 4, name: 'API Gateway (192.168.1.30)', type: 'api', status: 'warning' },
]

const scanResults = [
  {
    id: 1,
    target: '192.168.1.10',
    service: 'HTTP (80)',
    vulnerability: 'HTTPヘッダ情報漏洩',
    severity: 'medium',
    description: 'サーバー情報がHTTPヘッダに露出しています',
    cve: 'CVE-2023-1001',
    status: 'open',
  },
  {
    id: 2,
    target: '192.168.1.20',
    service: 'MySQL (3306)',
    vulnerability: '弱いパスワード認証',
    severity: 'high',
    description: 'デフォルトパスワードが使用されている可能性があります',
    cve: 'CVE-2023-1002',
    status: 'open',
  },
  {
    id: 3,
    target: '192.168.1.30',
    service: 'HTTPS (443)',
    vulnerability: 'SSL証明書期限切れ',
    severity: 'critical',
    description: 'SSL証明書の有効期限が切れています',
    cve: 'CVE-2023-1003',
    status: 'open',
  },
  {
    id: 4,
    target: '192.168.1.5',
    service: 'SSH (22)',
    vulnerability: '古いSSHプロトコル',
    severity: 'low',
    description: 'SSH v1プロトコルが有効になっています',
    cve: 'CVE-2023-1004',
    status: 'resolved',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'text-red-600 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700 dark:text-red-300'
    case 'high':
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-700 dark:text-orange-300'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700 dark:text-yellow-300'
    case 'low':
      return 'text-green-600 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700 dark:text-green-300'
    default:
      return 'text-gray-600 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 dark:text-gray-300'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'open':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    case 'resolved':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />
  }
}

export default function NetworkScan() {
  const [selectedTarget, setSelectedTarget] = useState<string>('all')
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          return 100
        }
        return prev + 12
      })
    }, 600)
  }

  const stopScan = () => {
    setIsScanning(false)
    setScanProgress(0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          ネットワーク診断
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          ネットワークインフラストラクチャの包括的なセキュリティ診断
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              スキャン設定
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  対象選択
                </label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">すべてのターゲット</option>
                  {networkTargets.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  スキャンタイプ
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">ポートスキャン</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">OS検出</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">サービス検出</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">脆弱性スキャン</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">スキャン中...</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <button
                      onClick={stopScan}
                      className="w-full flex items-center justify-center gap-x-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                    >
                      <StopIcon className="w-4 h-4" />
                      停止
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={startScan}
                    className="w-full flex items-center justify-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    <PlayIcon className="w-4 h-4" />
                    スキャン開始
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                検出された脆弱性
              </h3>
              <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-700/10 dark:ring-red-300/20">
                {scanResults.length} 件
              </span>
            </div>

            <div className="space-y-3">
              {scanResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(result.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.vulnerability}</h4>
                          <span className={classNames(
                            getSeverityColor(result.severity),
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border'
                          )}>
                            {result.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{result.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>ターゲット: {result.target}</span>
                          <span>サービス: {result.service}</span>
                          <span>CVE: {result.cve}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ServerIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">アクティブホスト</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">4</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <GlobeAltIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">開放ポート</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">23</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">脆弱性</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CpuChipIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">サービス</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">12</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
            ネットワークターゲット
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {networkTargets.map((target) => (
              <div key={target.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={classNames(
                    target.status === 'online' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30',
                    'flex-shrink-0 w-2 h-2 rounded-full'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {target.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {target.type} • {target.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 