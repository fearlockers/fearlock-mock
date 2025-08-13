'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Project } from '@/lib/auth'
import {
  PlayIcon,
  StopIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const codeIssues = [
  {
    id: 1,
    title: 'ハードコードされた認証情報',
    severity: 'critical',
    file: 'src/config/database.js',
    line: 15,
    description: 'データベースパスワードがソースコードにハードコードされています',
    category: 'Security',
    cwe: 'CWE-798',
    status: 'open',
  },
  {
    id: 2,
    title: '未検証のユーザー入力',
    severity: 'high',
    file: 'src/controllers/userController.js',
    line: 42,
    description: 'ユーザー入力がサニタイズされずに使用されています',
    category: 'Security',
    cwe: 'CWE-20',
    status: 'in_progress',
  },
  {
    id: 3,
    title: '非推奨のライブラリ使用',
    severity: 'medium',
    file: 'package.json',
    line: 23,
    description: 'セキュリティ脆弱性があるライブラリのバージョンを使用',
    category: 'Dependencies',
    cwe: 'CWE-1104',
    status: 'resolved',
  },
  {
    id: 4,
    title: 'エラー情報の漏洩',
    severity: 'medium',
    file: 'src/middleware/errorHandler.js',
    line: 28,
    description: 'エラーメッセージに機密情報が含まれる可能性',
    category: 'Information Disclosure',
    cwe: 'CWE-209',
    status: 'open',
  },
]

const repositories = [
  { id: 1, name: 'web-frontend', language: 'JavaScript', lastScan: '2024-01-15 14:30' },
  { id: 2, name: 'api-backend', language: 'Python', lastScan: '2024-01-14 09:15' },
  { id: 3, name: 'mobile-app', language: 'React Native', lastScan: '2024-01-13 16:45' },
  { id: 4, name: 'payment-service', language: 'Java', lastScan: '2024-01-12 11:20' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700'
    case 'high':
      return 'text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700'
    case 'low':
      return 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
    default:
      return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'open':
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
    case 'in_progress':
      return <ClockIcon className="w-5 h-5 text-yellow-500" />
    case 'resolved':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    default:
      return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
  }
}

export default function CodeAnalysis() {
  const [selectedRepo, setSelectedRepo] = useState<number>(1)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)

  const { getOrganizationProjects, organization, profile } = useAuth()

  // プロジェクト一覧を読み込み
  const loadProjects = async () => {
    setIsLoadingProjects(true)
    try {
      console.log('🔍 CodeAnalysis: プロジェクト読み込み開始')
      const result = await getOrganizationProjects()
      console.log('🔍 CodeAnalysis: プロジェクト取得結果:', result)
      
      if (result.success && result.data) {
        console.log('🔍 CodeAnalysis: プロジェクト取得成功:', result.data.length, '件')
        setProjects(result.data)
        // 初期状態ではプロジェクトを選択しない
      } else {
        console.error('❌ CodeAnalysis: プロジェクト取得失敗:', result.error)
      }
    } catch (error) {
      console.error('❌ CodeAnalysis: プロジェクト取得エラー:', error)
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // 組織情報が読み込まれた後にプロジェクトを読み込み（初回のみ）
  useEffect(() => {
    if ((organization?.id || profile?.organization_id) && projects.length === 0) {
      console.log('🔍 CodeAnalysis: 組織情報が利用可能、プロジェクトを読み込み')
      loadProjects()
    } else if (!organization?.id && !profile?.organization_id) {
      console.log('🔍 CodeAnalysis: 組織情報がまだ利用不可')
    }
  }, [organization?.id, profile?.organization_id])

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
        return prev + 15
      })
    }, 800)
  }

  const stopScan = () => {
    setIsScanning(false)
    setScanProgress(0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
          ソースコード診断
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          静的解析によるソースコードのセキュリティ診断と品質チェック
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 左側: プロジェクト作成とスキャン設定 */}
        <div className="lg:col-span-1 space-y-6">
          {/* プロジェクト選択 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                プロジェクト選択
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    プロジェクト
                  </label>
                  {isLoadingProjects ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <div className="text-center py-4">
                      <FolderIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">プロジェクトがありません</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">プロジェクト画面でプロジェクトを作成してください</p>
                      {/* デバッグ情報 */}
                      <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        <p>組織: {organization?.name || 'なし'}</p>
                        <p>組織ID: {organization?.id || 'なし'}</p>
                        <p>プロフィール組織ID: {profile?.organization_id || 'なし'}</p>
                      </div>
                    </div>
                  ) : (
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">プロジェクトを選択してください</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {selectedProject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      選択されたプロジェクト
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                      {projects.find(p => p.id === selectedProject) && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {projects.find(p => p.id === selectedProject)?.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {projects.find(p => p.id === selectedProject)?.description || '説明なし'}
                          </p>
                          {projects.find(p => p.id === selectedProject)?.url && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                              {projects.find(p => p.id === selectedProject)?.url}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* スキャン設定 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
              スキャン設定
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  リポジトリ選択
                </label>
                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(Number(e.target.value))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.name} ({repo.language})
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
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">セキュリティ脆弱性</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">依存関係チェック</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">コード品質</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">ライセンス検証</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                {isScanning ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">解析中...</span>
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
                    解析開始
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        </div>

        {/* 右側: 検出された問題 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                検出された問題
              </h3>
              <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-300/20">
                {codeIssues.length} 件
              </span>
            </div>

            <div className="space-y-3">
              {codeIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(issue.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{issue.title}</h4>
                          <span className={classNames(
                            getSeverityColor(issue.severity),
                            'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border'
                          )}>
                            {issue.severity.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{issue.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>ファイル: {issue.file}</span>
                          <span>行: {issue.line}</span>
                          <span>CWE: {issue.cwe}</span>
                          <span>カテゴリ: {issue.category}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Critical</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">1</dd>
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">High</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">1</dd>
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Medium</dt>
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
                <CodeBracketIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">解析済みファイル</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">1,247</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 