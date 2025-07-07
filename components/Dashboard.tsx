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
  { name: '7月', critical: 6, high: 11, medium: 24, low: 48 },
  { name: '8月', critical: 2, high: 7, medium: 19, low: 35 },
  { name: '9月', critical: 8, high: 16, medium: 31, low: 56 },
  { name: '10月', critical: 3, high: 9, medium: 17, low: 32 },
  { name: '11月', critical: 5, high: 13, medium: 26, low: 44 },
  { name: '12月', critical: 1, high: 5, medium: 14, low: 28 },
]

const severityData = [
  { name: 'Critical', value: 47, color: '#DC2626' },
  { name: 'High', value: 124, color: '#EA580C' },
  { name: 'Medium', value: 247, color: '#D97706' },
  { name: 'Low', value: 438, color: '#65A30D' },
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
    <div className="space-y-8">
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
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-gray-700 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
          >
            <div>
              <dd className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{item.stat}</p>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.name}</p>
                </div>
                <div className={classNames(
                  item.bgColor,
                  'flex items-center justify-center w-12 h-12 rounded-xl'
                )}>
                  <item.icon className={classNames(item.color, 'h-6 w-6')} />
                </div>
              </dd>
              <div className="mt-4 flex items-center">
                <span className={classNames(
                  item.changeType === 'increase' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30' : 
                  item.changeType === 'decrease' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30' : 
                  'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700',
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                )}>
                  {item.changeType === 'increase' && '↗'}
                  {item.changeType === 'decrease' && '↘'}
                  {item.changeType === 'neutral' && '→'}
                  <span className="ml-1">{item.change}</span>
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {item.changeType === 'increase' ? '前月比増加' : 
                   item.changeType === 'decrease' ? '前月比減少' : 
                   '安定'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </dl>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 脆弱性トレンド */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  脆弱性検出トレンド
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  過去12ヶ月間の脆弱性検出状況
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Critical</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">High</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Medium</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Low</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vulnerabilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#16A34A" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDark ? '#374151' : '#F3F4F6'} 
                    strokeOpacity={0.5}
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12} 
                    tick={{ fill: isDark ? '#D1D5DB' : '#4B5563' }}
                    axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                    tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                  />
                  <YAxis 
                    fontSize={12} 
                    tick={{ fill: isDark ? '#D1D5DB' : '#4B5563' }}
                    axisLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                    tickLine={{ stroke: isDark ? '#4B5563' : '#D1D5DB' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      ...tooltipStyle,
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    itemStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '13px'
                    }}
                    labelStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                  />
                  <Bar 
                    dataKey="critical" 
                    stackId="a" 
                    fill="url(#criticalGradient)" 
                    name="Critical" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="high" 
                    stackId="a" 
                    fill="url(#highGradient)" 
                    name="High" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="medium" 
                    stackId="a" 
                    fill="url(#mediumGradient)" 
                    name="Medium" 
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="low" 
                    stackId="a" 
                    fill="url(#lowGradient)" 
                    name="Low" 
                    radius={[2, 2, 0, 0]}
                  />
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
          className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                脆弱性重要度分布
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                過去12ヶ月間の総計
              </p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="criticalPie" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="highPie" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#EA580C" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="mediumPie" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#D97706" stopOpacity={0.8}/>
                    </linearGradient>
                    <linearGradient id="lowPie" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#16A34A" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent, value }) => 
                      percent > 8 ? `${name}\n${value} (${(percent * 100).toFixed(1)}%)` : ''
                    }
                    outerRadius={85}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    fontSize={11}
                    fontWeight="600"
                    stroke={isDark ? '#374151' : '#F3F4F6'}
                    strokeWidth={2}
                  >
                    {severityData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          entry.name === 'Critical' ? 'url(#criticalPie)' :
                          entry.name === 'High' ? 'url(#highPie)' :
                          entry.name === 'Medium' ? 'url(#mediumPie)' :
                          'url(#lowPie)'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      ...tooltipStyle,
                      borderRadius: '12px',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    itemStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '13px'
                    }}
                    labelStyle={{ 
                      color: isDark ? '#F9FAFB' : '#1F2937',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}
                    formatter={(value, name) => [
                      `${value} 件 (${((value / severityData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {severityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
              ))}
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