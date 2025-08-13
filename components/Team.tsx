'use client'

import { useState, useEffect } from 'react'
import {
  UserGroupIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  CalendarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import type { OrganizationMember } from '@/lib/auth'
import EmailTemplateSetup from './EmailTemplateSetup'

const roles = [
  { id: 'admin', name: '管理者', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
  { id: 'security_analyst', name: 'セキュリティアナリスト', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
  { id: 'developer', name: '開発者', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
  { id: 'viewer', name: '閲覧者', color: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300' },
]

const sampleTeamMembers = [
  {
    id: 1,
    name: '田中太郎',
    email: 'tanaka@example.com',
    phone: '+81-90-1234-5678',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    joinDate: '2023-06-01',
    avatar: 'T',
    department: 'セキュリティ部',
    projects: ['Webアプリケーション監査', 'API セキュリティ検証'],
    recentActivity: '脆弱性レポートを承認',
  },
  {
    id: 2,
    name: '佐藤花子',
    email: 'sato@example.com',
    phone: '+81-80-2345-6789',
    role: 'security_analyst',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    joinDate: '2023-08-15',
    avatar: 'S',
    department: 'セキュリティ部',
    projects: ['API セキュリティ検証'],
    recentActivity: '脆弱性スキャンを実行',
  },
  {
    id: 3,
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    phone: '+81-70-3456-7890',
    role: 'developer',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00Z',
    joinDate: '2023-09-01',
    avatar: 'S',
    department: 'エンジニア部',
    projects: ['ネットワーク監視強化'],
    recentActivity: 'WAFルールを更新',
  },
  {
    id: 4,
    name: '山田太郎',
    email: 'yamada@example.com',
    phone: '+81-60-4567-8901',
    role: 'viewer',
    status: 'pending',
    lastLogin: null,
    joinDate: '2024-01-12',
    avatar: 'Y',
    department: '監査部',
    projects: [],
    recentActivity: '招待メール送信済み',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Team() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEmailTemplateModal, setShowEmailTemplateModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [inviteForm, setInviteForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'member'
  })
  const [isInviting, setIsInviting] = useState(false)
  
  const { organization, getOrganizationMembers, updateMemberRole, inviteMember } = useAuth()

  // 組織メンバーを取得
  const loadMembers = async () => {
    if (!organization) return
    
    setIsLoading(true)
    try {
      const result = await getOrganizationMembers()
      if (result.success && result.data) {
        setMembers(result.data)
      } else {
        setMessage({ type: 'error', text: result.error || 'メンバーの取得に失敗しました' })
      }
    } catch (error) {
      console.error('メンバー取得エラー:', error)
      setMessage({ type: 'error', text: 'メンバーの取得に失敗しました' })
    } finally {
      setIsLoading(false)
    }
  }

  // 組織が変更された時にメンバーを再取得
  useEffect(() => {
    if (organization) {
      loadMembers()
    }
  }, [organization])

  // メンバー招待処理
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)
    setMessage(null)

    try {
      const result = await inviteMember(inviteForm)
      if (result.success) {
        setMessage({ type: 'success', text: 'メンバー招待を送信しました' })
        setShowInviteModal(false)
        setInviteForm({ email: '', first_name: '', last_name: '', role: 'member' })
        loadMembers() // メンバー一覧を更新
      } else {
        setMessage({ type: 'error', text: result.error || 'メンバー招待に失敗しました' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'メンバー招待に失敗しました' })
    } finally {
      setIsInviting(false)
    }
  }

  const handleInviteFormChange = (field: string, value: string) => {
    setInviteForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim()
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return null
    return (
      <span className={classNames('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', role.color)}>
        {role.name}
      </span>
    )
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
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <ClockIcon className="w-3 h-3 mr-1" />
            招待中
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
            <XCircleIcon className="w-3 h-3 mr-1" />
            非アクティブ
          </span>
        )
      default:
        return null
    }
  }

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return '未ログイン'
    const date = new Date(lastLogin)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '1時間以内'
    if (diffInHours < 24) return `${diffInHours}時間前`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}日前`
    return date.toLocaleDateString('ja-JP')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold leading-6 text-gray-900 dark:text-gray-100 sm:text-xl sm:tracking-tight">
            チーム
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            チームメンバーの管理と権限設定
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowEmailTemplateModal(true)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Cog6ToothIcon className="w-3 h-3 mr-1.5" />
            メール設定
          </button>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlusIcon className="w-3 h-3 mr-1.5" />
          メンバーを招待
        </button>
        </div>
      </div>

      {/* フィルターとサーチ */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">役職</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">すべての役職</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ステータス</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">すべてのステータス</option>
                <option value="active">アクティブ</option>
                <option value="pending">招待中</option>
                <option value="inactive">非アクティブ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">検索</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="メンバーを検索..."
                />
              </div>
            </div>

            <div className="flex items-end">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                エクスポート
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* チーム統計 */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">総メンバー数</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{members.length}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">アクティブメンバー</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {members.filter(m => m.role !== 'viewer').length}
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
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">閲覧者</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {members.filter(m => m.role === 'viewer').length}
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
                <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">管理者</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {members.filter(m => m.role === 'admin').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">メンバー一覧</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">チームメンバーの詳細情報と最近のアクティビティ</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-600">
          {isLoading ? (
            <li className="px-4 py-8 text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2 text-gray-500 dark:text-gray-400">メンバーを読み込み中...</span>
              </div>
            </li>
          ) : filteredMembers.length === 0 ? (
            <li className="px-4 py-8 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">メンバーが見つかりません</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? '検索条件に一致するメンバーがいません。' : '組織にメンバーが追加されると、ここに表示されます。'}
              </p>
            </li>
          ) : (
            filteredMembers.map((member) => (
            <motion.li
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => setSelectedMember(member)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={member.avatar_url || '/default-avatar.svg'}
                        alt={`${member.first_name} ${member.last_name}`}
                      />
                  </div>
                  <div className="min-w-0 flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {member.first_name} {member.last_name}
                          </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getRoleBadge(member.role)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            参加日: {new Date(member.created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                      </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.li>
            ))
          )}
        </ul>
      </div>

      {/* メッセージ表示 */}
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* メンバー招待モーダル */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">新しいメンバーを招待</h3>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="sr-only">閉じる</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleInviteMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => handleInviteFormChange('email', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="user@example.com"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      姓 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.last_name}
                      onChange={(e) => handleInviteFormChange('last_name', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="田中"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.first_name}
                      onChange={(e) => handleInviteFormChange('first_name', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="太郎"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    権限 <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={inviteForm.role}
                    onChange={(e) => handleInviteFormChange('role', e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="member">メンバー</option>
                    <option value="manager">マネージャー</option>
                    <option value="admin">管理者</option>
                    <option value="viewer">閲覧者</option>
                  </select>
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleInviteMember}
                  disabled={isInviting || !inviteForm.email.trim() || !inviteForm.first_name.trim() || !inviteForm.last_name.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isInviting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      送信中...
                    </>
                  ) : (
                    '招待を送信'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メンバー詳細モーダル */}
      {selectedMember && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-[500px] shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">メンバー詳細</h3>
                <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={selectedMember.avatar_url || '/default-avatar.svg'}
                    alt={`${selectedMember.first_name} ${selectedMember.last_name}`}
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {selectedMember.first_name} {selectedMember.last_name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.email}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      {getRoleBadge(selectedMember.role)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">メールアドレス</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedMember.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">参加日</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedMember.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">権限設定</label>
                  <select
                    defaultValue={selectedMember.role}
                    onChange={async (e) => {
                      const result = await updateMemberRole(selectedMember.id, e.target.value)
                      if (result.success) {
                        setMessage({ type: 'success', text: '権限が更新されました' })
                        loadMembers() // メンバー一覧を更新
                        setSelectedMember(null) // モーダルを閉じる
                      } else {
                        setMessage({ type: 'error', text: result.error || '権限の更新に失敗しました' })
                      }
                      setTimeout(() => setMessage(null), 3000)
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="admin">管理者</option>
                    <option value="manager">マネージャー</option>
                    <option value="member">メンバー</option>
                    <option value="viewer">閲覧者</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    権限を変更すると、即座にデータベースに反映されます。
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setSelectedMember(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メールテンプレート設定モーダル */}
      {showEmailTemplateModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-[800px] max-h-[90vh] shadow-lg rounded-md bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">メールテンプレート設定</h3>
                <button onClick={() => setShowEmailTemplateModal(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              
              <EmailTemplateSetup />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 