'use client'

import { useState } from 'react'
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
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

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
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const filteredMembers = sampleTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
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
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <UserPlusIcon className="w-3 h-3 mr-1.5" />
          メンバーを招待
        </button>
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
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">{sampleTeamMembers.length}</dd>
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
                    {sampleTeamMembers.filter(m => m.status === 'active').length}
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
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">招待中</dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {sampleTeamMembers.filter(m => m.status === 'pending').length}
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
                    {sampleTeamMembers.filter(m => m.role === 'admin').length}
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
          {filteredMembers.map((member) => (
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
                    <div className="h-10 w-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-medium">
                      {member.avatar}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(member.status)}
                        {getRoleBadge(member.role)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {member.department}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          最終ログイン: {formatLastLogin(member.lastLogin)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.recentActivity}</p>
                      </div>
                    </div>
                    {member.projects.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {member.projects.slice(0, 2).map((project, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                              {project}
                            </span>
                          ))}
                          {member.projects.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                              +{member.projects.length - 2}個
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* メンバー招待モーダル */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-75 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-200 dark:border-gray-600 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">新しいメンバーを招待</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">メールアドレス</label>
                  <input type="email" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">氏名</label>
                  <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="田中太郎" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">役職</label>
                  <select className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">部署</label>
                  <input type="text" className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="セキュリティ部" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                  キャンセル
                </button>
                <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  招待を送信
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
                  <div className="h-16 w-16 rounded-full bg-gray-500 text-white flex items-center justify-center text-xl font-medium">
                    {selectedMember.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedMember.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedMember.department}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      {getStatusBadge(selectedMember.status)}
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">電話番号</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedMember.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">入社日</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(selectedMember.joinDate).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">最終ログイン</label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{formatLastLogin(selectedMember.lastLogin)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">参加プロジェクト</label>
                  {selectedMember.projects.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.projects.map((project: string, index: number) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {project}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">参加プロジェクトなし</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">最近のアクティビティ</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{selectedMember.recentActivity}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setSelectedMember(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">
                  閉じる
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                  編集
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 