'use client'

import { useState } from 'react'
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ShareIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const reportTypes = [
  { id: 'vulnerability', name: '脆弱性レポート', icon: DocumentTextIcon, color: 'bg-red-500 dark:bg-red-700' },
  { id: 'security', name: 'セキュリティサマリー', icon: ChartBarIcon, color: 'bg-blue-500 dark:bg-blue-700' },
  { id: 'compliance', name: 'コンプライアンス', icon: DocumentTextIcon, color: 'bg-green-500 dark:bg-green-700' },
  { id: 'incident', name: 'インシデント分析', icon: ChartBarIcon, color: 'bg-yellow-500 dark:bg-yellow-700' },
]

const sampleReports = [
  {
    id: 1,
    title: '月次セキュリティサマリー',
    type: 'security',
    date: '2024-01-15',
    status: 'completed',
    format: 'PDF',
    size: '2.4MB',
    description: '1月のセキュリティ脅威分析と対策レポート',
  },
  {
    id: 2,
    title: '脆弱性スキャン結果',
    type: 'vulnerability',
    date: '2024-01-14',
    status: 'completed',
    format: 'PDF',
    size: '1.8MB',
    description: 'Webアプリケーションの脆弱性検出結果',
  },
  {
    id: 3,
    title: 'コンプライアンス監査',
    type: 'compliance',
    date: '2024-01-12',
    status: 'generating',
    format: 'PDF',
    size: '-',
    description: 'ISO 27001準拠状況の監査レポート',
  },
  {
    id: 4,
    title: 'インシデント対応分析',
    type: 'incident',
    date: '2024-01-10',
    status: 'completed',
    format: 'PDF',
    size: '3.1MB',
    description: '12月のセキュリティインシデント対応レポート',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Reports() {
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const filteredReports = sampleReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">完了</span>
      case 'generating':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">生成中</span>
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">失敗</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">不明</span>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vulnerability':
        return 'bg-red-500 dark:bg-red-700'
      case 'security':
        return 'bg-blue-500 dark:bg-blue-700'
      case 'compliance':
        return 'bg-green-500 dark:bg-green-700'
      case 'incident':
        return 'bg-yellow-500 dark:bg-yellow-700'
      default:
        return 'bg-gray-500 dark:bg-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
            レポート
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            セキュリティレポートの生成と管理
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <DocumentTextIcon className="w-3 h-3 mr-1.5" />
          新規レポート生成
        </button>
      </div>

      {/* フィルターとサーチ */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                レポートタイプ
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">すべてのタイプ</option>
                {reportTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                検索
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="レポートを検索..."
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                フィルター
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* レポート統計 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reportTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={classNames(type.color, 'p-2 rounded-md')}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {type.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {sampleReports.filter(r => r.type === type.id).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* レポート一覧 */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            レポート履歴
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            過去に生成されたレポートの一覧です
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {filteredReports.map((report) => (
            <motion.li
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className={classNames(
                    getTypeColor(report.type),
                    'flex-shrink-0 w-2 h-2 rounded-full mr-3'
                  )} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {report.title}
                      </p>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(report.status)}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.format} • {report.size}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.description}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      {new Date(report.date).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                  {report.status === 'completed' && (
                    <>
                      <button
                        type="button"
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                        title="プレビュー"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                        title="ダウンロード"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300"
                        title="共有"
                      >
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {report.status === 'generating' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* 新規レポート生成モーダル */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                新規レポート生成
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    レポートタイプ
                  </label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {reportTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    期間
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="date"
                      className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    形式
                  </label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  生成開始
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 