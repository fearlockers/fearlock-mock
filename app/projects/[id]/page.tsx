'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { Project } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useSidebar } from '@/contexts/SidebarContext'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  PencilIcon,
  XMarkIcon,
  FolderIcon,
  CalendarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  CheckIcon,
  CodeBracketIcon,
  WifiIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ShareIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

// サンプルデータ（後で削除予定）
const sampleVulnerabilities = {
  critical: 2,
  high: 8,
  medium: 15,
  low: 23,
}

// レポートタイプ
const reportTypes = [
  { id: 'vulnerability', name: '脆弱性レポート', icon: DocumentTextIcon, color: 'bg-red-500 dark:bg-red-700' },
  { id: 'security', name: 'セキュリティサマリー', icon: ChartBarIcon, color: 'bg-blue-500 dark:bg-blue-700' },
  { id: 'compliance', name: 'コンプライアンス', icon: DocumentTextIcon, color: 'bg-green-500 dark:bg-green-700' },
  { id: 'incident', name: 'インシデント分析', icon: ChartBarIcon, color: 'bg-yellow-500 dark:bg-yellow-700' },
]

// サンプルレポート
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

// 診断結果のサンプルデータ
const sampleScanResults = {
  vulnerability: {
    lastScan: '2024-01-15T10:30:00Z',
    status: 'completed',
    totalIssues: 48,
    critical: 2,
    high: 8,
    medium: 15,
    low: 23,
    scanDuration: '15分30秒',
    coverage: '95%'
  },
  codeAnalysis: {
    lastScan: '2024-01-14T14:20:00Z',
    status: 'completed',
    totalIssues: 156,
    critical: 5,
    high: 23,
    medium: 67,
    low: 61,
    scanDuration: '8分45秒',
    coverage: '100%',
    codeQuality: 'B+'
  },
  networkScan: {
    lastScan: '2024-01-13T09:15:00Z',
    status: 'completed',
    totalIssues: 12,
    critical: 1,
    high: 3,
    medium: 5,
    low: 3,
    scanDuration: '22分10秒',
    coverage: '100%',
    openPorts: 8
  }
}

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { collapsed } = useSidebar()
  
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    url: '',
    status: 'active' as 'active' | 'inactive' | 'archived'
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerability' | 'code' | 'network' | 'reports'>('overview')
  const [selectedReportType, setSelectedReportType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const { getProject, updateProject, deleteProject } = useAuth()

  // プロジェクト詳細を読み込み
  const loadProject = async () => {
    if (!projectId) return
    
    setIsLoading(true)
    try {
      const result = await getProject(projectId)
      if (result.success && result.data) {
        setProject(result.data)
        setEditForm({
          name: result.data.name,
          description: result.data.description || '',
          url: result.data.url || '',
          status: result.data.status
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'プロジェクトの取得に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'プロジェクトの取得に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
  }, [projectId])

  // 編集フォームの変更を処理
  const handleEditFormChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // プロジェクトを更新
  const handleSaveProject = async () => {
    if (!project) return
    
    setIsSaving(true)
    try {
      const result = await updateProject(project.id, editForm)
      if (result.success && result.data) {
        setProject(result.data)
        setIsEditing(false)
        setMessage({ type: 'success', text: 'プロジェクトが更新されました' })
        
        // 3秒後にメッセージを消す
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      } else {
        setMessage({ type: 'error', text: result.error || 'プロジェクトの更新に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'プロジェクトの更新に失敗しました' })
    } finally {
      setIsSaving(false)
    }
  }

  // プロジェクトを削除
  const handleDeleteProject = async () => {
    if (!project || !confirm('このプロジェクトを削除しますか？この操作は元に戻せません。')) return
    
    try {
      const result = await deleteProject(project.id)
      if (result.success) {
        setMessage({ type: 'success', text: 'プロジェクトが削除されました' })
        setTimeout(() => {
          router.push('/projects')
        }, 1000)
      } else {
        setMessage({ type: 'error', text: result.error || 'プロジェクトの削除に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'プロジェクトの削除に失敗しました' })
    }
  }

  // 診断を実行
  const handleRunScan = (scanType: 'vulnerability' | 'code' | 'network') => {
    switch (scanType) {
      case 'vulnerability':
        router.push('/vulnerability')
        break
      case 'code':
        router.push('/code-analysis')
        break
      case 'network':
        router.push('/network-scan')
        break
    }
  }

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

  const getScanStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            完了
          </span>
        )
      case 'running':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            実行中
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
            失敗
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            未実行
          </span>
        )
    }
  }

  const getTotalVulnerabilities = (vulnerabilities: any) => {
    return vulnerabilities.critical + vulnerabilities.high + vulnerabilities.medium + vulnerabilities.low
  }

  const filteredReports = sampleReports.filter(report => {
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const getReportStatusBadge = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="h-screen flex">
        <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        }`}>
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4">
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen flex">
        <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        }`}>
          <Sidebar />
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">プロジェクトが見つかりません</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">プロジェクトが存在しないか、アクセス権限がありません。</p>
                  <div className="mt-6">
                    <button
                      onClick={() => router.push('/projects')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ArrowLeftIcon className="w-4 h-4 mr-2" />
                      プロジェクト一覧に戻る
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      <div className={`hidden lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-4">
            <div className="space-y-6">
              {/* ヘッダー */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/projects')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    戻る
                  </button>
                  <div>
                    <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
                      {project.name}
                    </h1>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      プロジェクトの詳細とセキュリティ診断結果
                    </p>
                  </div>
                </div>
              </div>

              {/* タブナビゲーション */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'overview', name: '概要', icon: ChartBarIcon },
                    { id: 'vulnerability', name: '脆弱性診断', icon: ShieldCheckIcon },
                    { id: 'code', name: 'ソースコード診断', icon: CodeBracketIcon },
                    { id: 'network', name: 'ネットワーク診断', icon: WifiIcon },
                    { id: 'reports', name: 'レポート', icon: DocumentTextIcon }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* コンテンツ */}
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 左側: プロジェクト情報 */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* 基本情報 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                              基本情報
                            </h3>
                            {!isEditing ? (
                              <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                編集
                              </button>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setIsEditing(false)
                                    setEditForm({
                                      name: project.name,
                                      description: project.description || '',
                                      url: project.url || '',
                                      status: project.status
                                    })
                                  }}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                  <XMarkIcon className="w-4 h-4 mr-2" />
                                  キャンセル
                                </button>
                                <button
                                  onClick={handleSaveProject}
                                  disabled={isSaving || !editForm.name.trim()}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSaving ? (
                                    <div className="flex items-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      保存中...
                                    </div>
                                  ) : (
                                    <>
                                      <CheckIcon className="w-4 h-4 mr-2" />
                                      保存
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                プロジェクト名
                              </label>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => handleEditFormChange('name', e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  placeholder="プロジェクト名を入力"
                                  required
                                />
                              ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100">{project.name}</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                説明
                              </label>
                              {isEditing ? (
                                <textarea
                                  rows={3}
                                  value={editForm.description}
                                  onChange={(e) => handleEditFormChange('description', e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  placeholder="プロジェクトの説明を入力"
                                />
                              ) : (
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                  {project.description || '説明なし'}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                URL
                              </label>
                              {isEditing ? (
                                <input
                                  type="url"
                                  value={editForm.url}
                                  onChange={(e) => handleEditFormChange('url', e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  placeholder="https://example.com"
                                />
                              ) : project.url ? (
                                <a 
                                  href={project.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                                >
                                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                                  {project.url}
                                </a>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">URLなし</p>
                              )}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ステータス
                              </label>
                              {isEditing ? (
                                <select
                                  value={editForm.status}
                                  onChange={(e) => handleEditFormChange('status', e.target.value)}
                                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                  <option value="active">アクティブ</option>
                                  <option value="inactive">非アクティブ</option>
                                  <option value="archived">アーカイブ</option>
                                </select>
                              ) : (
                                <div>{getStatusBadge(project.status)}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* セキュリティ概要 */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                            セキュリティ概要
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {sampleVulnerabilities.critical + sampleVulnerabilities.high}
                              </div>
                              <div className="text-sm text-red-600 dark:text-red-400">重要脆弱性</div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {getTotalVulnerabilities(sampleVulnerabilities)}
                              </div>
                              <div className="text-sm text-orange-600 dark:text-orange-400">総脆弱性</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* 右側: メタデータとアクション */}
                    <div className="space-y-6">
                      {/* メタデータ */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white dark:bg-gray-800 shadow rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                            メタデータ
                          </h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-500 dark:text-gray-400">作成日:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {new Date(project.created_at).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-500 dark:text-gray-400">最終更新:</span>
                              <span className="ml-2 text-gray-900 dark:text-gray-100">
                                {new Date(project.updated_at).toLocaleDateString('ja-JP')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* 危険なアクション */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg leading-6 font-medium text-red-800 dark:text-red-200 mb-4">
                            危険なアクション
                          </h3>
                          
                          <button
                            onClick={handleDeleteProject}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            プロジェクトを削除
                          </button>
                          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                            この操作は元に戻せません。プロジェクトと関連するすべてのデータが削除されます。
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* 脆弱性診断タブ */}
                {activeTab === 'vulnerability' && (
                  <div className="space-y-6">
                    {/* 診断結果カード */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                            脆弱性診断結果
                          </h3>
                          <div className="flex space-x-2">
                            {getScanStatusBadge(sampleScanResults.vulnerability.status)}
                            <button
                              onClick={() => handleRunScan('vulnerability')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <ShieldCheckIcon className="w-4 h-4 mr-2" />
                              再診断
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {sampleScanResults.vulnerability.critical}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400">Critical</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {sampleScanResults.vulnerability.high}
                            </div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">High</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {sampleScanResults.vulnerability.medium}
                            </div>
                            <div className="text-sm text-yellow-600 dark:text-yellow-400">Medium</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {sampleScanResults.vulnerability.low}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Low</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">最終診断</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {new Date(sampleScanResults.vulnerability.lastScan).toLocaleString('ja-JP')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">診断時間</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.vulnerability.scanDuration}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">カバレッジ</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.vulnerability.coverage}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* ソースコード診断タブ */}
                {activeTab === 'code' && (
                  <div className="space-y-6">
                    {/* 診断結果カード */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                            ソースコード診断結果
                          </h3>
                          <div className="flex space-x-2">
                            {getScanStatusBadge(sampleScanResults.codeAnalysis.status)}
                            <button
                              onClick={() => handleRunScan('code')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <CodeBracketIcon className="w-4 h-4 mr-2" />
                              再診断
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {sampleScanResults.codeAnalysis.critical}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400">Critical</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {sampleScanResults.codeAnalysis.high}
                            </div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">High</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {sampleScanResults.codeAnalysis.medium}
                            </div>
                            <div className="text-sm text-yellow-600 dark:text-yellow-400">Medium</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {sampleScanResults.codeAnalysis.low}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Low</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">最終診断</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {new Date(sampleScanResults.codeAnalysis.lastScan).toLocaleString('ja-JP')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">診断時間</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.codeAnalysis.scanDuration}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">カバレッジ</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.codeAnalysis.coverage}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">コード品質</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.codeAnalysis.codeQuality}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* レポートタブ */}
                {activeTab === 'reports' && (
                  <div className="space-y-6">
                    {/* ヘッダー */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
                          レポート
                        </h2>
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              レポートタイプ
                            </label>
                            <select
                              value={selectedReportType}
                              onChange={(e) => setSelectedReportType(e.target.value)}
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
                    </motion.div>

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
                                <div className={`${type.color} p-2 rounded-md`}>
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md"
                    >
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
                                <div className={`${getTypeColor(report.type)} flex-shrink-0 w-2 h-2 rounded-full mr-3`} />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                      {report.title}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                      {getReportStatusBadge(report.status)}
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
                    </motion.div>
                  </div>
                )}

                {/* ネットワーク診断タブ */}
                {activeTab === 'network' && (
                  <div className="space-y-6">
                    {/* 診断結果カード */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 shadow rounded-lg"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                            ネットワーク診断結果
                          </h3>
                          <div className="flex space-x-2">
                            {getScanStatusBadge(sampleScanResults.networkScan.status)}
                            <button
                              onClick={() => handleRunScan('network')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <WifiIcon className="w-4 h-4 mr-2" />
                              再診断
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                              {sampleScanResults.networkScan.critical}
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400">Critical</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {sampleScanResults.networkScan.high}
                            </div>
                            <div className="text-sm text-orange-600 dark:text-orange-400">High</div>
                          </div>
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                              {sampleScanResults.networkScan.medium}
                            </div>
                            <div className="text-sm text-yellow-600 dark:text-yellow-400">Medium</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {sampleScanResults.networkScan.low}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Low</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">最終診断</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {new Date(sampleScanResults.networkScan.lastScan).toLocaleString('ja-JP')}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">診断時間</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.networkScan.scanDuration}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">カバレッジ</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.networkScan.coverage}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">開放ポート</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {sampleScanResults.networkScan.openPorts}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

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
          </div>
        </main>
      </div>
    </div>
  )
} 