'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/auth'
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
  XCircleIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

// サンプルデータ（後で削除予定）
const sampleVulnerabilities = {
      critical: 2,
      high: 8,
      medium: 15,
      low: 23,
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    url: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  const { organization, getOrganizationProjects, createProject } = useAuth()
  const router = useRouter()

  // プロジェクト一覧を読み込み
  const loadProjects = async () => {
    if (!organization) return
    
    setIsLoading(true)
    try {
      const result = await getOrganizationProjects()
      if (result.success && result.data) {
        setProjects(result.data)
      } else {
        setMessage({ type: 'error', text: result.error || 'プロジェクトの取得に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'プロジェクトの取得に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  // 組織が変更されたときにプロジェクトを再読み込み
  useEffect(() => {
    loadProjects()
  }, [organization])

  // プロジェクト作成
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.name.trim()) {
      setMessage({ type: 'error', text: 'プロジェクト名を入力してください' })
      return
    }

    setIsCreating(true)
    try {
      const result = await createProject({
        name: createForm.name,
        description: createForm.description,
        url: createForm.url
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'プロジェクトが作成されました' })
        setShowCreateModal(false)
        setCreateForm({ name: '', description: '', url: '' })
        loadProjects() // プロジェクト一覧を更新
        
        // 3秒後にメッセージを消す
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'プロジェクトの作成に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'プロジェクトの作成に失敗しました' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateFormChange = (field: string, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`)
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            非アクティブ
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            アーカイブ
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
                <option value="inactive">非アクティブ</option>
                <option value="archived">アーカイブ</option>
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
                    {projects.length}
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
                    {projects.filter(p => p.status === 'active').length}
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
                    {projects.length * sampleVulnerabilities.critical}
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
                    {projects.length * 3}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト一覧 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">プロジェクトがありません</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">新しいプロジェクトを作成してセキュリティ監査を開始しましょう。</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              プロジェクトを作成
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    プロジェクト名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    説明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    脆弱性
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    作成日
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredProjects.map((project) => (
                  <motion.tr
            key={project.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleProjectClick(project)}
          >
                    <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                        <FolderIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {project.name}
                </div>
              </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {project.description || '説明なし'}
                </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.url ? (
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                          <GlobeAltIcon className="w-4 h-4 mr-1" />
                          <span className="truncate max-w-32">{project.url}</span>
                </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getTotalVulnerabilities(sampleVulnerabilities)}
                </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.created_at).toLocaleDateString('ja-JP')}
                    </td>
                  </motion.tr>
                  ))}
              </tbody>
            </table>
                </div>
              </div>
      )}

      {/* 新規プロジェクト作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                新規プロジェクト作成
              </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    プロジェクト名 *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => handleCreateFormChange('name', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="プロジェクト名を入力"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    説明
                  </label>
                  <textarea
                    rows={3}
                    value={createForm.description}
                    onChange={(e) => handleCreateFormChange('description', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="プロジェクトの説明を入力"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={createForm.url}
                    onChange={(e) => handleCreateFormChange('url', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://example.com"
                  />
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={isCreating || !createForm.name.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      作成中...
                    </div>
                  ) : (
                    '作成'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* メッセージ表示 */}
      {message && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-md shadow-lg ${
            message.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              ) : (
                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 