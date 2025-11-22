// 🚨 モックモード: 開発用に認証機能を無効化 🚨
// 本番環境では、元の実装に戻してください

import { useState, useEffect } from 'react'
import type { User, Session } from '@supabase/supabase-js'

// モック用の型定義
type UserProfile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: string
  organization_id: string | null
  created_at: string
  updated_at: string
}

type Organization = {
  id: string
  name: string
  description: string | null
  domain: string | null
  industry: string | null
  size: string | null
  plan: string
  created_at: string
  updated_at: string
}

type OrganizationMember = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  avatar_url: string | null
}

type Project = {
  id: string
  organization_id: string
  name: string
  description: string | null
  url: string | null
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

type Domain = {
  id: string
  organization_id: string
  project_id?: string | null
  name: string
  is_primary: boolean
  dns_status: string
  verification_token?: string | null
  nameservers?: any
  created_at: string
  updated_at: string
}

type Subdomain = any
type DnsRecord = any
type DomainVerification = any
type ProfileUpdateData = any

interface UseAuthReturn {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  organization: Organization | null
  organizations: Organization[]
  currentOrganizationId: string | null
  loading: boolean
  isAuthenticated: boolean
  setCurrentOrganization: (organizationId: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  updateProfile: (data: ProfileUpdateData) => Promise<{ success: boolean, error?: any }>
  updateAvatar: (file: File) => Promise<{ success: boolean, error?: any }>
  createOrganization: (data: { name: string, description?: string, industry?: string, size?: string }) => Promise<{ success: boolean, error?: any, data?: Organization }>
  getOrganizationMembers: () => Promise<{ success: boolean, error?: any, data?: OrganizationMember[] }>
  updateMemberRole: (memberId: string, newRole: string) => Promise<{ success: boolean, error?: any }>
  removeMemberFromOrganization: (memberId: string) => Promise<{ success: boolean, error?: any }>
  leaveOrganization: (organizationId: string) => Promise<{ success: boolean, error?: any }>
  inviteMember: (data: { email: string, first_name: string, last_name: string, role: string }) => Promise<{ success: boolean, error?: any }>
  getInviteInfo: () => Promise<{ success: boolean, error?: any, data?: { first_name: string, last_name: string, organization_id: string, role: string, organization_name?: string, invited_by?: string } }>
  updateInvitedUserProfile: (userId: string, profileData: { first_name: string, last_name: string, organization_id: string, role: string }) => Promise<{ success: boolean, error?: any }>
  getOrganizationProjects: () => Promise<{ success: boolean, error?: any, data?: Project[] }>
  createProject: (data: { name: string, description?: string, url?: string }) => Promise<{ success: boolean, error?: any, data?: Project }>
  updateProject: (projectId: string, data: { name?: string, description?: string, url?: string, status?: 'active' | 'inactive' | 'archived' }) => Promise<{ success: boolean, error?: any, data?: Project }>
  deleteProject: (projectId: string) => Promise<{ success: boolean, error?: any }>
  getProject: (projectId: string) => Promise<{ success: boolean, error?: any, data?: Project }>
  getOrganizationDomains: () => Promise<{ success: boolean, error?: any, data?: Domain[] }>
  createDomain: (data: { name: string, description?: string, is_primary: boolean, ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all', robots_management?: boolean }) => Promise<{ success: boolean, error?: any, data?: Domain }>
  updateDomain: (domainId: string, data: { name?: string, description?: string, is_primary?: boolean, status?: 'active' | 'pending' | 'inactive', ssl_enabled?: boolean, ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all', robots_management?: boolean }) => Promise<{ success: boolean, error?: any, data?: Domain }>
  deleteDomain: (domainId: string) => Promise<{ success: boolean, error?: any }>
  getDomain: (domainId: string) => Promise<{ success: boolean, error?: any, data?: Domain & { subdomains: Subdomain[], dns_records: DnsRecord[] } }>
  createSubdomain: (data: { domain_id: string, name: string, description?: string, ssl_enabled?: boolean }) => Promise<{ success: boolean, error?: any, data?: Subdomain }>
  updateSubdomain: (subdomainId: string, data: { name?: string, description?: string, status?: 'active' | 'inactive', ssl_enabled?: boolean }) => Promise<{ success: boolean, error?: any, data?: Subdomain }>
  deleteSubdomain: (subdomainId: string) => Promise<{ success: boolean, error?: any }>
  createDnsRecord: (data: { domain_id: string, type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV', name: string, value: string, ttl?: number, priority?: number }) => Promise<{ success: boolean, error?: any, data?: DnsRecord }>
  updateDnsRecord: (dnsRecordId: string, data: { type?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV', name?: string, value?: string, ttl?: number, priority?: number }) => Promise<{ success: boolean, error?: any, data?: DnsRecord }>
  deleteDnsRecord: (dnsRecordId: string) => Promise<{ success: boolean, error?: any }>
  verifyDomain: (domainId: string, verificationType: 'dns' | 'ssl' | 'nameserver') => Promise<{ success: boolean, error?: any, data?: DomainVerification }>
  getOrganizationPrimaryDomain: () => Promise<{ success: boolean, error?: any, data?: Domain }>
  setOrganizationPrimaryDomain: (domainId: string) => Promise<{ success: boolean, error?: any }>
}

// モックデータ
const mockUser: User = {
  id: 'mock-user-id-123',
  email: 'demo@fearlock.dev',
  user_metadata: { first_name: 'デモ', last_name: 'ユーザー' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User

const mockProfile: UserProfile = {
  id: 'mock-user-id-123',
  email: 'demo@fearlock.dev',
  first_name: 'デモ',
  last_name: 'ユーザー',
  avatar_url: null,
  role: 'admin',
  organization_id: 'mock-org-id-123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockOrganization: Organization = {
  id: 'mock-org-id-123',
  name: 'デモ組織',
  description: 'これはデモ用の組織です',
  domain: 'demo.fearlock.dev',
  industry: 'テクノロジー',
  size: '10-50',
  plan: 'professional',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const mockProjects: Project[] = [
  {
    id: 'mock-project-1',
    organization_id: 'mock-org-id-123',
    name: 'Webアプリケーション',
    description: 'メインのWebアプリケーション',
    url: 'https://example.com',
    status: 'active',
    created_by: 'mock-user-id-123',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-project-2',
    organization_id: 'mock-org-id-123',
    name: 'APIサーバー',
    description: 'バックエンドAPIサーバー',
    url: 'https://api.example.com',
    status: 'active',
    created_by: 'mock-user-id-123',
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-project-3',
    organization_id: 'mock-org-id-123',
    name: 'モバイルアプリ',
    description: 'iOS/Androidアプリ',
    url: null,
    status: 'inactive',
    created_by: 'mock-user-id-123',
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const useAuth = (): UseAuthReturn => {
  // モック用の固定値を返す
  const [user] = useState<User | null>(mockUser)
  const [session] = useState<Session | null>({ user: mockUser } as Session)
  const [profile] = useState<UserProfile | null>(mockProfile)
  const [organization, setOrganization] = useState<Organization | null>(mockOrganization)
  const [organizations] = useState<Organization[]>([mockOrganization])
  const [currentOrganizationId] = useState<string | null>(mockOrganization.id)
  const [loading] = useState(false)
  const [projects, setProjects] = useState<Project[]>(mockProjects)

  // モック版: すべての関数は何もしない or 成功を返す
  const refreshProfile = async () => {
    console.log('🔸 [MOCK] refreshProfile called')
  }

  const updateProfile = async (data: ProfileUpdateData) => {
    console.log('🔸 [MOCK] updateProfile called with:', data)
    return { success: true }
  }

  const updateAvatar = async (file: File) => {
    console.log('🔸 [MOCK] updateAvatar called')
    return { success: true }
  }

  const createOrganization = async (data: { name: string, description?: string, industry?: string, size?: string }): Promise<{ success: boolean, error?: any, data?: Organization }> => {
    console.log('🔸 [MOCK] createOrganization called with:', data)
    return { success: true, data: mockOrganization }
  }

  const getOrganizationMembers = async (): Promise<{ success: boolean, error?: any, data?: OrganizationMember[] }> => {
    console.log('🔸 [MOCK] getOrganizationMembers called')
    return { success: true, data: [] }
  }

  const updateMemberRole = async (memberId: string, newRole: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] updateMemberRole called')
    return { success: true }
  }

  const removeMemberFromOrganization = async (memberId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] removeMemberFromOrganization called')
    return { success: true }
  }

  const leaveOrganization = async (organizationId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] leaveOrganization called')
    return { success: true }
  }

  const inviteMember = async (data: { email: string, first_name: string, last_name: string, role: string }): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] inviteMember called')
    return { success: true }
  }

  const getInviteInfo = async (): Promise<{ success: boolean, error?: any, data?: { first_name: string, last_name: string, organization_id: string, role: string } }> => {
    console.log('🔸 [MOCK] getInviteInfo called')
    return { success: true, data: { first_name: '', last_name: '', organization_id: '', role: '' } }
  }

  const updateInvitedUserProfile = async (userId: string, profileData: { first_name: string, last_name: string, organization_id: string, role: string }): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] updateInvitedUserProfile called')
    return { success: true }
  }

  const getOrganizationProjects = async (): Promise<{ success: boolean, error?: any, data?: Project[] }> => {
    console.log('🔸 [MOCK] getOrganizationProjects called')
    return { success: true, data: projects }
  }

  const createProject = async (data: { name: string, description?: string, url?: string }): Promise<{ success: boolean, error?: any, data?: Project }> => {
    console.log('🔸 [MOCK] createProject called with:', data)
    const newProject: Project = {
      id: `mock-project-${Date.now()}`,
      organization_id: mockOrganization.id,
      name: data.name,
      description: data.description || null,
      url: data.url || null,
      status: 'active',
      created_by: mockUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProjects(prev => [...prev, newProject])
    return { success: true, data: newProject }
  }

  const updateProject = async (projectId: string, data: { name?: string, description?: string, url?: string, status?: 'active' | 'inactive' | 'archived' }): Promise<{ success: boolean, error?: any, data?: Project }> => {
    console.log('🔸 [MOCK] updateProject called')
    return { success: true }
  }

  const deleteProject = async (projectId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] deleteProject called')
    setProjects(prev => prev.filter(p => p.id !== projectId))
    return { success: true }
  }

  const getProject = async (projectId: string): Promise<{ success: boolean, error?: any, data?: Project }> => {
    console.log('🔸 [MOCK] getProject called')
    const project = projects.find(p => p.id === projectId)
    return { success: true, data: project }
  }

  const getOrganizationDomains = async (): Promise<{ success: boolean, error?: any, data?: Domain[] }> => {
    console.log('🔸 [MOCK] getOrganizationDomains called')
    return { success: true, data: [] }
  }

  const createDomain = async (data: any): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    console.log('🔸 [MOCK] createDomain called')
    return { success: true }
  }

  const updateDomain = async (domainId: string, data: any): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    console.log('🔸 [MOCK] updateDomain called')
    return { success: true }
  }

  const deleteDomain = async (domainId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] deleteDomain called')
    return { success: true }
  }

  const getDomain = async (domainId: string): Promise<{ success: boolean, error?: any, data?: Domain & { subdomains: Subdomain[], dns_records: DnsRecord[] } }> => {
    console.log('🔸 [MOCK] getDomain called')
    return { success: true }
  }

  const setCurrentOrganization = async (organizationId: string): Promise<void> => {
    console.log('🔸 [MOCK] setCurrentOrganization called')
  }

  const createSubdomain = async (data: any): Promise<{ success: boolean, error?: any, data?: Subdomain }> => {
    console.log('🔸 [MOCK] createSubdomain called')
    return { success: true }
  }

  const updateSubdomain = async (subdomainId: string, data: any): Promise<{ success: boolean, error?: any, data?: Subdomain }> => {
    console.log('🔸 [MOCK] updateSubdomain called')
    return { success: true }
  }

  const deleteSubdomain = async (subdomainId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] deleteSubdomain called')
    return { success: true }
  }

  const createDnsRecord = async (data: any): Promise<{ success: boolean, error?: any, data?: DnsRecord }> => {
    console.log('🔸 [MOCK] createDnsRecord called')
    return { success: true }
  }

  const updateDnsRecord = async (dnsRecordId: string, data: any): Promise<{ success: boolean, error?: any, data?: DnsRecord }> => {
    console.log('🔸 [MOCK] updateDnsRecord called')
    return { success: true }
  }

  const deleteDnsRecord = async (dnsRecordId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] deleteDnsRecord called')
    return { success: true }
  }

  const verifyDomain = async (domainId: string, verificationType: 'dns' | 'ssl' | 'nameserver'): Promise<{ success: boolean, error?: any, data?: DomainVerification }> => {
    console.log('🔸 [MOCK] verifyDomain called')
    return { success: true }
  }

  const getOrganizationPrimaryDomain = async (): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    console.log('🔸 [MOCK] getOrganizationPrimaryDomain called')
    return { success: true }
  }

  const setOrganizationPrimaryDomain = async (domainId: string): Promise<{ success: boolean, error?: any }> => {
    console.log('🔸 [MOCK] setOrganizationPrimaryDomain called')
    return { success: true }
  }

  const signOut = async () => {
    console.log('🔸 [MOCK] signOut called')
  }

  // モック版では何もしない
  useEffect(() => {
    console.log('🔸 [MOCK] useAuth initialized')
  }, [])

  return {
    user,
    session,
    profile,
    organization,
    organizations,
    currentOrganizationId,
    setCurrentOrganization,
    loading,
    signOut,
    refreshProfile,
    updateProfile,
    updateAvatar,
    createOrganization,
    getOrganizationMembers,
    updateMemberRole,
    removeMemberFromOrganization,
    leaveOrganization,
    inviteMember,
    getInviteInfo,
    updateInvitedUserProfile,
    getOrganizationProjects,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    getOrganizationDomains,
    createDomain,
    updateDomain,
    deleteDomain,
    getDomain,
    createSubdomain,
    updateSubdomain,
    deleteSubdomain,
    createDnsRecord,
    updateDnsRecord,
    deleteDnsRecord,
    verifyDomain,
    getOrganizationPrimaryDomain,
    setOrganizationPrimaryDomain,
    isAuthenticated: true // モック版では常に認証済み
  }
} 