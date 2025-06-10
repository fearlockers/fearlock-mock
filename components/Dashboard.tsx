'use client'

import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ChartBarIcon,
  ClockIcon,
  EyeIcon,
  CodeBracketIcon,
  CpuChipIcon,
  FireIcon,
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const stats = [
  {
    name: '検出された脆弱性',
    stat: '127',
    icon: ExclamationTriangleIcon,
    change: '+5.4%',
    changeType: 'increase',
    color: 'text-red-600 dark:text-red-300',
    bgColor: 'bg-red-50 dark:bg-red-700',
  },
  {
    name: '修正済み',
    stat: '342',
    icon: CheckCircleIcon,
    change: '+2.02%',
    changeType: 'increase',
    color: 'text-green-600 dark:text-green-300',
    bgColor: 'bg-green-50 dark:bg-green-700',
  },
  {
    name: 'コードベース',
    stat: '15',
    icon: CodeBracketIcon,
    change: '+19.1%',
    changeType: 'increase',
    color: 'text-blue-600 dark:text-blue-300',
    bgColor: 'bg-blue-50 dark:bg-blue-700',
  },
  {
    name: 'ネットワーク監視',
    stat: '24/7',
    icon: EyeIcon,
    change: '100%',
    changeType: 'neutral',
    color: 'text-purple-600 dark:text-purple-300',
    bgColor: 'bg-purple-50 dark:bg-purple-700',
  },
]

const vulnerabilityData = [
  { name: '1月', critical: 5, high: 12, medium: 23, low: 45 },
  { name: '2月', critical: 3, high: 8, medium: 18, low: 38 },
  { name: '3月', critical: 7, high: 15, medium: 28, low: 52 },
  { name: '4月', critical: 2, high: 6, medium: 15, low: 30 },
  { name: '5月', critical: 4, high: 9, medium: 20, low: 41 },
  { name: '6月', critical: 1, high: 4, medium: 12, low: 25 },
]

const severityData = [
  { name: 'Critical', value: 12, color: '#DC2626' },
  { name: 'High', value: 28, color: '#EA580C' },
  { name: 'Medium', value: 45, color: '#D97706' },
  { name: 'Low', value: 78, color: '#65A30D' },
]

const recentActivities = [
  {
    id: 1,
    type: 'vulnerability',
    title: 'SQLインジェクション脆弱性を検出',
    project: 'web-app-frontend',
    time: '2分前',
    severity: 'critical',
    icon: ShieldCheckIcon,
  },
  {
    id: 2,
    type: 'scan',
    title: 'ネットワークスキャン完了',
    project: 'production-servers',
    time: '15分前',
    severity: 'info',
    icon: CpuChipIcon,
  },
  {
    id: 3,
    type: 'firewall',
    title: 'WAFルール更新',
    project: 'api-gateway',
    time: '1時間前',
    severity: 'low',
    icon: FireIcon,
  },
  {
    id: 4,
    type: 'code',
    title: 'ソースコード解析完了',
    project: 'payment-service',
    time: '2時間前',
    severity: 'medium',
    icon: CodeBracketIcon,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const tooltipStyle = isDark ? {
    backgroundColor: '#374151',
    border: '1px solid #4B5563',
    borderRadius: '6px',
    color: '#F9FAFB',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
  } : {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    color: '#1F2937',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          セキュリティダッシュボード
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          すべてのセキュリティメトリクスとアクティビティの概要
        </p>
      </div>

      {/* 統計カード */}
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-3 py-3 shadow ring-1 ring-black ring-opacity-5 dark:ring-gray-700"
          >
            <div>
              <dd className="flex items-baseline">
                <div className={classNames(
                  item.bgColor,
                  'flex items-center justify-center w-6 h-6 rounded-md mr-2'
                )}>
                  <item.icon className={classNames(item.color, 'h-3 w-3')} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.stat}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
                </div>
              </dd>
              <p className={classNames(
                item.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : item.changeType === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400',
                'absolute bottom-0 right-0 text-xs font-medium p-2'
              )}>
                {item.change}
              </p>
            </div>
          </motion.div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 脆弱性トレンド */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-4">
            <h3 className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-100 mb-3">
              脆弱性検出トレンド
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vulnerabilityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#4B5563' : '#E5E7EB'} />
                  <XAxis dataKey="name" fontSize={10} tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                  <YAxis fontSize={10} tick={{ fill: isDark ? '#9CA3AF' : '#6B7280' }} />
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    itemStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                    labelStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar dataKey="critical" stackId="a" fill="#DC2626" name="Critical" />
                  <Bar dataKey="high" stackId="a" fill="#EA580C" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#D97706" name="Medium" />
                  <Bar dataKey="low" stackId="a" fill="#65A30D" name="Low" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* 脆弱性重要度分布 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
        >
          <div className="p-4">
            <h3 className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-100 mb-3">
              脆弱性重要度分布
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={10}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle}
                    itemStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      backgroundColor: 'transparent',
                      border: 'none'
                    }}
                    labelStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 最新のアクティビティ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow rounded-lg"
      >
        <div className="px-3 py-4 sm:p-4">
          <h3 className="text-sm leading-5 font-medium text-gray-900 dark:text-gray-100 mb-3">
            最新のアクティビティ
          </h3>
          <div className="flow-root">
            <ul role="list" className="-mb-6">
              {recentActivities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-6">
                    {activityIdx !== recentActivities.length - 1 ? (
                      <span
                        className="absolute left-3 top-3 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-2">
                      <div>
                        <span className={classNames(
                          activity.severity === 'critical' ? 'bg-red-500' :
                          activity.severity === 'high' ? 'bg-orange-500' :
                          activity.severity === 'medium' ? 'bg-yellow-500' :
                          activity.severity === 'low' ? 'bg-green-500' :
                          'bg-blue-500',
                          'h-6 w-6 rounded-full flex items-center justify-center ring-6 ring-white dark:ring-gray-800'
                        )}>
                          <activity.icon className="h-3 w-3 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-3 pt-1">
                        <div>
                          <p className="text-xs text-gray-900 dark:text-gray-100">
                            {activity.title}
                            <span className="font-medium text-gray-700 dark:text-gray-300 ml-1">
                              in {activity.project}
                            </span>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 