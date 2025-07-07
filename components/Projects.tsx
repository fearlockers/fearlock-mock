'use client'

import { useState } from 'react'
import {
  FolderIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const sampleProjects = [
  {
    id: 1,
    name: 'Webアプリケーション監査',
    description: 'メインWebアプリケーションのセキュリティ監査プロジェクト',
    status: 'active',
    priority: 'high',
    progress: 75,
    created: '2024-01-10',
    lastScan: '2024-01-15',
    vulnerabilities: {
      critical: 2,
      high: 8,
      medium: 15,
      low: 23,
    },
    members: [
      { id: 1, name: '田中太郎', avatar: 'T', role: 'リーダー' },
      { id: 2, name: '佐藤花子', avatar: 'S', role: 'アナリスト' },
      { id: 3, name: '鈴木一郎', avatar: 'S', role: 'エンジニア' },
    ],
    tags: ['Web', 'Critical', 'OWASP'],
  },
  {
    id: 2,
    name: 'API セキュリティ検証',
    description: 'REST API エンドポイントのセキュリティ検証',
    status: 'planning',
    priority: 'medium',
    progress: 25,
    created: '2024-01-12',
    lastScan: null,
    vulnerabilities: {
      critical: 0,
      high: 3,
      medium: 7,
      low: 12,
    },
    members: [
      { id: 2, name: '佐藤花子', avatar: 'S', role: 'リーダー' },
      { id: 4, name: '山田太郎', avatar: 'Y', role: 'アナリスト' },
    ],
    tags: ['API', 'REST', 'Auth'],
  },
  {
    id: 3,
    name: 'ネットワーク監視強化',
    description: 'ネットワーク監視システムの強化プロジェクト',
    status: 'completed',
    priority: 'low',
    progress: 100,
    created: '2023-12-01',
    lastScan: '2024-01-14',
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
    },
    members: [
      { id: 3, name: '鈴木一郎', avatar: 'S', role: 'リーダー' },
    ],
    tags: ['Network', 'Monitoring'],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredProjects = sampleProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            アクティブ
          </span>
        )
      case 'planning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            計画中
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            完了
          </span>
        )
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            高
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            中
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            低
          </span>
        )
      default:
        return null
    }
  }

  const getTotalVulnerabilities = (vulnerabilities: any) => {
    return vulnerabilities.critical + vulnerabilities.high + vulnerabilities.medium + vulnerabilities.low
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
            プロジェクト
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            セキュリティプロジェクトの管理と監視
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-3 h-3 mr-1.5" />
          新規プロジェクト
        </button>
      </div>

      {/* フィルターとサーチ */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ステータス
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">すべてのステータス</option>
                <option value="active">アクティブ</option>
                <option value="planning">計画中</option>
                <option value="completed">完了</option>
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
                  placeholder="プロジェクトを検索..."
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                フィルター
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト統計 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    総プロジェクト数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {sampleProjects.length}
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    アクティブ
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {sampleProjects.filter(p => p.status === 'active').length}
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
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    クリティカル脆弱性
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {sampleProjects.reduce((sum, p) => sum + p.vulnerabilities.critical, 0)}
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
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    参加メンバー
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {new Set(sampleProjects.flatMap(p => p.members.map(m => m.id))).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト一覧 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FolderIcon className="h-6 w-6 text-gray-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                    {project.name}
                  </h3>
                </div>
                <button className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
              </div>

              {/* プログレスバー */}
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">進捗</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{project.progress}%</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* 脆弱性統計 */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-xs font-medium text-red-600 dark:text-red-400">{project.vulnerabilities.critical}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Critical</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-orange-600 dark:text-orange-400">{project.vulnerabilities.high}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">High</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400">{project.vulnerabilities.medium}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Medium</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{project.vulnerabilities.low}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Low</div>
                </div>
              </div>

              {/* メンバー */}
              <div className="mt-4">
                <div className="flex -space-x-2 overflow-hidden">
                  {project.members.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="inline-block h-6 w-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white dark:border-gray-800"
                      title={member.name}
                    >
                      {member.avatar}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="inline-block h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs flex items-center justify-center border-2 border-white dark:border-gray-800">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* タグ */}
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 最終スキャン日時 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {project.lastScan ? 
                      `最終スキャン: ${new Date(project.lastScan).toLocaleDateString('ja-JP')}` : 
                      'スキャン未実行'
                    }
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    <Cog6ToothIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 新規プロジェクト作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                新規プロジェクト作成
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    プロジェクト名
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="プロジェクト名を入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="プロジェクトの説明を入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    優先度
                  </label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  作成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 