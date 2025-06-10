'use client'

import { useState } from 'react'
import {
  EyeIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  SignalIcon,
  ChartBarIcon,
  WifiIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useTheme } from '@/contexts/ThemeContext'

const networkData = [
  { time: '00:00', inbound: 120, outbound: 80, latency: 15 },
  { time: '02:00', inbound: 130, outbound: 90, latency: 18 },
  { time: '04:00', inbound: 110, outbound: 75, latency: 12 },
  { time: '06:00', inbound: 180, outbound: 120, latency: 25 },
  { time: '08:00', inbound: 350, outbound: 280, latency: 45 },
  { time: '10:00', inbound: 420, outbound: 320, latency: 38 },
  { time: '12:00', inbound: 380, outbound: 290, latency: 42 },
  { time: '14:00', inbound: 440, outbound: 350, latency: 35 },
  { time: '16:00', inbound: 390, outbound: 310, latency: 40 },
  { time: '18:00', inbound: 320, outbound: 240, latency: 28 },
  { time: '20:00', inbound: 250, outbound: 180, latency: 22 },
  { time: '22:00', inbound: 190, outbound: 140, latency: 18 },
]

const monitoringAlerts = [
  {
    id: 1,
    type: 'critical',
    message: 'サーバー応答時間が閾値を超過',
    target: 'web-server-01',
    timestamp: '2024-01-15 14:23:45',
    status: 'active',
  },
  {
    id: 2,
    type: 'warning',
    message: 'ネットワーク帯域使用率が80%を超過',
    target: 'network-gateway',
    timestamp: '2024-01-15 14:18:12',
    status: 'acknowledged',
  },
  {
    id: 3,
    type: 'info',
    message: '定期ヘルスチェック完了',
    target: 'all-systems',
    timestamp: '2024-01-15 14:00:00',
    status: 'resolved',
  },
  {
    id: 4,
    type: 'warning',
    message: 'SSL証明書の有効期限が近づいています',
    target: 'api.example.com',
    timestamp: '2024-01-15 13:45:23',
    status: 'active',
  },
]

const networkNodes = [
  { id: 1, name: 'Web Server 01', ip: '192.168.1.10', status: 'online', cpu: 45, memory: 62, latency: 15 },
  { id: 2, name: 'Database Server', ip: '192.168.1.20', status: 'online', cpu: 78, memory: 85, latency: 12 },
  { id: 3, name: 'Load Balancer', ip: '192.168.1.5', status: 'online', cpu: 23, memory: 34, latency: 8 },
  { id: 4, name: 'API Gateway', ip: '192.168.1.30', status: 'warning', cpu: 89, memory: 76, latency: 45 },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getAlertColor(type: string) {
  switch (type) {
    case 'critical':
      return 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30'
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30'
    case 'info':
      return 'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30'
    default:
      return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'online':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'warning':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
    case 'offline':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    default:
      return <ClockIcon className="w-5 h-5 text-gray-500" />
  }
}

export default function NetworkMonitoring() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const tooltipStyle = isDark ? {
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    color: '#F3F4F6'
  } : {
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    color: '#111827'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          ネットワーク監視
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          24/7リアルタイムネットワーク監視とアラート管理
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">稼働ノード</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">3/4</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SignalIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">平均レイテンシ</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">25ms</dd>
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">アクティブアラート</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">2</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <WifiIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">帯域使用率</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">78%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                ネットワークトラフィック
              </h3>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="1h">1時間</option>
                <option value="24h">24時間</option>
                <option value="7d">7日間</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="time" tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }} />
                <YAxis tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="受信 (Mbps)"
                />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.3}
                  name="送信 (Mbps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              レイテンシ監視
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={networkData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="time" tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }} />
                <YAxis tick={{ fill: isDark ? '#D1D5DB' : '#6B7280' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ fill: '#EF4444' }}
                  name="レイテンシ (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              アクティブアラート
            </h3>
            <div className="space-y-3">
              {monitoringAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={classNames(
                    getAlertColor(alert.type),
                    'rounded-lg p-3 border border-gray-200 dark:border-gray-600'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="mt-1 flex items-center space-x-2 text-xs">
                        <span>ターゲット: {alert.target}</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                    <span className={classNames(
                      alert.status === 'active' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 
                      alert.status === 'acknowledged' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' : 
                      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
                      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium'
                    )}>
                      {alert.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              ノード監視
            </h3>
            <div className="space-y-4">
              {networkNodes.map((node) => (
                <div key={node.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(node.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{node.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{node.ip}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{node.latency}ms</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">CPU</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{node.cpu}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={classNames(
                            node.cpu > 80 ? 'bg-red-500' : node.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500',
                            'h-1.5 rounded-full transition-all duration-300'
                          )}
                          style={{ width: `${node.cpu}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500 dark:text-gray-400">Memory</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{node.memory}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={classNames(
                            node.memory > 80 ? 'bg-red-500' : node.memory > 60 ? 'bg-yellow-500' : 'bg-green-500',
                            'h-1.5 rounded-full transition-all duration-300'
                          )}
                          style={{ width: `${node.memory}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 