import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  getCurrentUser, 
  getUserProfile, 
  getUserOrganization,
  getUserOrganizations,
  updateUserProfile,
  uploadAvatar,
  deleteAvatar,
  createOrganization as createOrganizationAPI,
  getOrganizationMembers as getOrganizationMembersAPI,
  updateMemberRole as updateMemberRoleAPI,
  removeMemberFromOrganization as removeMemberFromOrganizationAPI,
  leaveOrganization as leaveOrganizationAPI,
  inviteMember as inviteMemberAPI,
  getInviteInfo as getInviteInfoAPI,
  updateInvitedUserProfile as updateInvitedUserProfileAPI,
  getOrganizationProjects as getOrganizationProjectsAPI,
  createProject as createProjectAPI,
  updateProject as updateProjectAPI,
  deleteProject as deleteProjectAPI,
  getProject as getProjectAPI,
  getOrganizationDomains as getOrganizationDomainsAPI,
  createDomain as createDomainAPI,
  updateDomain as updateDomainAPI,
  deleteDomain as deleteDomainAPI,
  getDomain as getDomainAPI,
  createSubdomain as createSubdomainAPI,
  updateSubdomain as updateSubdomainAPI,
  deleteSubdomain as deleteSubdomainAPI,
  createDnsRecord as createDnsRecordAPI,
  updateDnsRecord as updateDnsRecordAPI,
  deleteDnsRecord as deleteDnsRecordAPI,
  verifyDomain as verifyDomainAPI,
  getOrganizationPrimaryDomain as getOrganizationPrimaryDomainAPI,
  setOrganizationPrimaryDomain as setOrganizationPrimaryDomainAPI,
  onAuthStateChange,
  type AuthState,
  type UserProfile,
  type Organization,
  type OrganizationMember,
  type Project,
  type Domain,
  type Subdomain,
  type DnsRecord,
  type DomainVerification,
  type ProfileUpdateData
} from '@/lib/auth'
import type { User, Session } from '@supabase/supabase-js'

interface UseAuthReturn extends AuthState {
  profile: UserProfile | null
  organization: Organization | null
  organizations: Organization[]
  currentOrganizationId: string | null
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
  isAuthenticated: boolean
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // プロファイルデータを安全に取得
  const fetchUserData = async (currentUser: User) => {
    console.log('🔍 fetchUserData called with user:', currentUser)
    
    try {
      console.log('🔍 Getting user profile for ID:', currentUser.id)
      // プロファイル取得（エラーハンドリング強化）
      const { data: profileData, error: profileError } = await getUserProfile(currentUser.id)
      console.log('🔍 Profile fetch result:', { profileData, profileError })
      
      if (profileError) {
        console.error('❌ プロファイル取得エラー:', (profileError as any).message)
        // RLSエラーの場合、基本的なプロファイルデータを作成
        if ((profileError as any).message.includes('infinite recursion') || 
            (profileError as any).message.includes('policy') ||
            (profileError as any).message.includes('permission denied')) {
          
          console.log('🔍 Creating fallback profile due to RLS error')
          const fallbackProfile: UserProfile = {
            id: currentUser.id,
            email: currentUser.email || '',
            first_name: currentUser.user_metadata?.first_name || '',
            last_name: currentUser.user_metadata?.last_name || '',
            avatar_url: currentUser.user_metadata?.avatar_url || null,
            role: 'user',
            organization_id: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          console.log('🔍 Setting fallback profile:', fallbackProfile)
          setProfile(fallbackProfile)
        } else {
          console.log('🔍 Setting profile to null due to error')
          setProfile(null)
        }
      } else {
        console.log('🔍 Setting profile data:', profileData)
        setProfile(profileData)
      }

      // 組織取得
      console.log('🔍 fetchUserData: 組織取得開始, organization_id:', profileData?.organization_id)
      if (profileData?.organization_id) {
        try {
          // 複数組織を取得
          const { data: orgsData, error: orgsError } = await getUserOrganizations(currentUser.id)
          
          if (orgsError) {
            console.error('❌ fetchUserData: 複数組織取得エラー:', orgsError)
            // フォールバック: 単一組織を取得
            const { data: orgData, error: orgError } = await supabase
              .from('organizations')
              .select('*')
              .eq('id', profileData.organization_id)
              .single()
            
            if (orgError) {
              console.error('❌ fetchUserData: 単一組織取得エラー:', orgError)
              setOrganization(null)
              setOrganizations([])
            } else {
              console.log('✅ fetchUserData: 単一組織設定成功:', orgData)
              setOrganization(orgData)
              setOrganizations([orgData])
            }
          } else {
            console.log('✅ fetchUserData: 複数組織取得成功:', orgsData)
            setOrganizations(orgsData)
            
            // 現在の組織IDをCookieから取得、または最初の組織を設定
            let currentOrgId = null
            if (typeof window !== 'undefined') {
              const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('current_organization_id='))
              if (cookieValue) {
                currentOrgId = cookieValue.split('=')[1]
              }
            }
            
            // 現在の組織を設定
            if (currentOrgId && orgsData.find(org => org.id === currentOrgId)) {
              setCurrentOrganizationId(currentOrgId)
              setOrganization(orgsData.find(org => org.id === currentOrgId) || null)
            } else if (orgsData.length > 0) {
              // デフォルトで最初の組織を設定
              setCurrentOrganizationId(orgsData[0].id)
              setOrganization(orgsData[0])
            }
          }
        } catch (orgError) {
          console.error('❌ fetchUserData: 組織取得エラー:', orgError)
          setOrganization(null)
          setOrganizations([])
        }
      } else {
        console.log('🔍 fetchUserData: organization_idなし、組織をnullに設定')
        setOrganization(null)
        setOrganizations([])
      }
    } catch (error) {
      console.error('fetchUserData全体エラー:', error)
      // エラー時はフォールバックプロファイルを作成
      const fallbackProfile: UserProfile = {
        id: currentUser.id,
        email: currentUser.email || '',
        first_name: currentUser.user_metadata?.first_name || '',
        last_name: currentUser.user_metadata?.last_name || '',
        avatar_url: null,
        role: 'user',
        organization_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setProfile(fallbackProfile)
      setOrganization(null)
    } finally {
      setLoading(false)
    }
  }

  // プロファイル再取得
  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserData(user)
    }
  }

  // プロファイル更新（エラーハンドリング強化）
  const updateProfile = async (data: ProfileUpdateData) => {
    console.log('🔍 useAuth updateProfile called with:', data)
    console.log('🔍 Current user:', user)
    
    if (!user?.id) {
      console.error('❌ User not logged in')
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    try {
      console.log('🔍 Calling updateUserProfile with user.id:', user.id)
      const { data: updatedProfile, error } = await updateUserProfile(user.id, data)
      console.log('🔍 updateUserProfile response:', { updatedProfile, error })
      
      if (error) {
        console.error('❌ Profile update error:', error)
        return { success: false, error: (error as any).message || 'プロファイルの更新に失敗しました' }
      }

      if (updatedProfile) {
        console.log('✅ Setting updated profile:', updatedProfile)
        setProfile(updatedProfile)
      }
      console.log('✅ Profile update completed successfully')
      return { success: true }
    } catch (error: any) {
      console.error('❌ Unexpected error in updateProfile:', error)
      return { success: false, error: error.message || 'プロファイルの更新に失敗しました' }
    }
  }

  // アバター更新（エラーハンドリング強化）  
  const updateAvatar = async (file: File) => {
    if (!user?.id) {
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    // ファイルサイズチェック（2MB制限）
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'ファイルサイズは2MB以下にしてください' }
    }

    // ファイル形式チェック
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      return { success: false, error: 'JPEG、PNG、GIF形式のファイルを選択してください' }
    }

    try {
      // 既存のアバターを削除
      if (profile?.avatar_url) {
        try {
          const urlParts = profile.avatar_url.split('/storage/v1/object/public/avatars/')
          if (urlParts.length > 1) {
            const oldFilePath = urlParts[1]
            await deleteAvatar(oldFilePath)
          }
        } catch (deleteError) {
          console.warn('Old avatar deletion failed:', deleteError)
          // 削除エラーは無視して続行
        }
      }

      // 新しいアバターをアップロード
      const { data: uploadData, error: uploadError } = await uploadAvatar(user.id, file)
      
      if (uploadError) {
        console.error('Avatar upload error:', uploadError)
        return { success: false, error: 'アバターのアップロードに失敗しました' }
      }

      if (uploadData?.url) {
        // プロファイルにアバターURLを保存
        const updateResult = await updateProfile({ avatar_url: uploadData.url })
        return updateResult
      }

      return { success: false, error: 'アバターのアップロードに失敗しました' }
    } catch (error: any) {
      console.error('Avatar update error:', error)
      return { success: false, error: error.message || 'アバターの更新に失敗しました' }
    }
  }

  // 組織作成
  const createOrganization = async (data: { name: string, description?: string, industry?: string, size?: string }): Promise<{ success: boolean, error?: any, data?: Organization }> => {
    if (!user?.id) {
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    try {
      const result = await createOrganizationAPI({
        ...data,
        owner_id: user.id
      })

      if (result.success && result.data) {
        // 組織作成後の状態更新
        const newOrganization = result.data
        
        // 組織の状態を更新
        setOrganization(newOrganization)
        
        // organizationsの配列に新しい組織を追加
        setOrganizations(prev => [...prev, newOrganization])
        
        // 現在の組織IDを設定
        setCurrentOrganizationId(newOrganization.id)
        
        // プロフィールを再取得して組織情報を更新
        await refreshProfile()
        
        console.log('✅ 組織作成成功:', newOrganization)
      }

      return result
    } catch (error: any) {
      console.error('組織作成エラー:', error)
      return { success: false, error: error.message || '組織の作成に失敗しました' }
    }
  }

  // 組織メンバー一覧を取得
  const getOrganizationMembers = async (): Promise<{ success: boolean, error?: any, data?: OrganizationMember[] }> => {
    if (!organization?.id) {
      return { success: false, error: '組織が設定されていません' }
    }

    try {
      const { data, error } = await getOrganizationMembersAPI(organization.id)
      
      if (error) {
        console.error('組織メンバー取得エラー:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (error: any) {
      console.error('組織メンバー取得エラー:', error)
      return { success: false, error: error.message || '組織メンバーの取得に失敗しました' }
    }
  }

  // メンバーのロールを更新
  const updateMemberRole = async (memberId: string, newRole: string): Promise<{ success: boolean, error?: any }> => {
    if (!user?.id) {
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    try {
      const { error } = await updateMemberRoleAPI(memberId, newRole)
      
      if (error) {
        console.error('メンバーロール更新エラー:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      console.error('メンバーロール更新エラー:', error)
      return { success: false, error: error.message || 'メンバーロールの更新に失敗しました' }
    }
  }

  // 組織からメンバーを削除
  const removeMemberFromOrganization = async (memberId: string): Promise<{ success: boolean, error?: any }> => {
    if (!user?.id) {
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    try {
      const { error } = await removeMemberFromOrganizationAPI(memberId)
      
      if (error) {
        console.error('メンバー削除エラー:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error: any) {
      console.error('メンバー削除エラー:', error)
      return { success: false, error: error.message || 'メンバーの削除に失敗しました' }
    }
  }

  // 組織を脱退
  const leaveOrganization = async (organizationId: string): Promise<{ success: boolean, error?: any }> => {
    if (!user?.id) {
      return { success: false, error: 'ユーザーがログインしていません' }
    }

    try {
      const result = await leaveOrganizationAPI(organizationId)
      
      if (!result.success) {
        return { success: false, error: result.error }
      }

      // 脱退後の状態をクリア
      setOrganization(null)
      setOrganizations([])
      setCurrentOrganizationId(null)
      setProfile(null) // プロフィールもクリア

      return { success: true }
    } catch (error: any) {
      console.error('組織脱退エラー:', error)
      return { success: false, error: error.message || '組織からの脱退に失敗しました' }
    }
  }

  // メンバーを招待
  const inviteMember = async (data: { email: string, first_name: string, last_name: string, role: string }): Promise<{ success: boolean, error?: any }> => {
    if (!organization?.id) {
      return { success: false, error: '組織が設定されていません' }
    }

    try {
      const result = await inviteMemberAPI({
        ...data,
        organization_id: organization.id,
        organization_name: organization.name,
        invited_by: user?.email || profile?.email || 'Unknown'
      })

      return result
    } catch (error: any) {
      console.error('メンバー招待エラー:', error)
      return { success: false, error: error.message || 'メンバーの招待に失敗しました' }
    }
  }

  // 招待情報を取得
  const getInviteInfo = async (): Promise<{ success: boolean, error?: any, data?: { first_name: string, last_name: string, organization_id: string, role: string } }> => {
    try {
      const result = await getInviteInfoAPI()
      return result
    } catch (error: any) {
      console.error('招待情報取得エラー:', error)
      return { success: false, error: error.message || '招待情報の取得に失敗しました' }
    }
  }

  // 招待されたユーザーのプロフィールを更新
  const updateInvitedUserProfile = async (userId: string, profileData: { first_name: string, last_name: string, organization_id: string, role: string }): Promise<{ success: boolean, error?: any }> => {
    try {
      const result = await updateInvitedUserProfileAPI(userId, profileData)
      return result
    } catch (error: any) {
      console.error('招待ユーザープロフィール更新エラー:', error)
      return { success: false, error: error.message || 'プロフィール更新に失敗しました' }
    }
  }

  // 組織のプロジェクト一覧を取得
  const getOrganizationProjects = async (): Promise<{ success: boolean, error?: any, data?: Project[] }> => {
    try {
      console.log('🔍 useAuth getOrganizationProjects: 開始')
      console.log('🔍 useAuth getOrganizationProjects: organization:', organization)
      
      // 組織情報がまだ読み込まれていない場合、プロフィールから組織IDを取得
      let organizationId = organization?.id
      
      if (!organizationId && profile?.organization_id) {
        console.log('🔍 useAuth getOrganizationProjects: プロフィールから組織IDを取得:', profile.organization_id)
        organizationId = profile.organization_id
      }
      
      if (!organizationId) {
        console.error('❌ useAuth getOrganizationProjects: 組織が見つかりません')
        return { success: false, error: '組織が見つかりません' }
      }

      console.log('🔍 useAuth getOrganizationProjects: 組織ID:', organizationId)
      const result = await getOrganizationProjectsAPI(organizationId)
      console.log('🔍 useAuth getOrganizationProjects: API結果:', result)
      
      return result
    } catch (error: any) {
      console.error('❌ useAuth getOrganizationProjects: エラー:', error)
      return { success: false, error: error.message || 'プロジェクトの取得に失敗しました' }
    }
  }

  // プロジェクトを作成
  const createProject = async (data: { name: string, description?: string, url?: string }): Promise<{ success: boolean, error?: any, data?: Project }> => {
    try {
      if (!organization?.id || !user?.id) {
        return { success: false, error: '組織またはユーザーが見つかりません' }
      }

      const result = await createProjectAPI({
        organization_id: organization.id,
        name: data.name,
        description: data.description,
        url: data.url,
        created_by: user.id
      })

      return result
    } catch (error: any) {
      console.error('プロジェクト作成エラー:', error)
      return { success: false, error: error.message || 'プロジェクトの作成に失敗しました' }
    }
  }

  // プロジェクトを更新
  const updateProject = async (projectId: string, data: { name?: string, description?: string, url?: string, status?: 'active' | 'inactive' | 'archived' }): Promise<{ success: boolean, error?: any, data?: Project }> => {
    try {
      const result = await updateProjectAPI(projectId, data)
      return result
    } catch (error: any) {
      console.error('プロジェクト更新エラー:', error)
      return { success: false, error: error.message || 'プロジェクトの更新に失敗しました' }
    }
  }

  // プロジェクトを削除
  const deleteProject = async (projectId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const result = await deleteProjectAPI(projectId)
      return result
    } catch (error: any) {
      console.error('プロジェクト削除エラー:', error)
      return { success: false, error: error.message || 'プロジェクトの削除に失敗しました' }
    }
  }

  // プロジェクト詳細を取得
  const getProject = async (projectId: string): Promise<{ success: boolean, error?: any, data?: Project }> => {
    try {
      const result = await getProjectAPI(projectId)
      return result
    } catch (error: any) {
      console.error('プロジェクト取得エラー:', error)
      return { success: false, error: error.message || 'プロジェクトの取得に失敗しました' }
    }
  }

  // ドメイン関連の関数
  const getOrganizationDomains = async (): Promise<{ success: boolean, error?: any, data?: Domain[] }> => {
    try {
      if (!organization?.id) {
        return { success: false, error: '組織が見つかりません' }
      }
      const result = await getOrganizationDomainsAPI(organization.id)
      return result
    } catch (error: any) {
      console.error('ドメイン取得エラー:', error)
      return { success: false, error: error.message || 'ドメインの取得に失敗しました' }
    }
  }

  const createDomain = async (data: { name: string, description?: string, is_primary: boolean, ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all', robots_management?: boolean }): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    try {
      if (!organization?.id) {
        return { success: false, error: '組織が見つかりません' }
      }
      const result = await createDomainAPI({
        ...data,
        organization_id: organization.id
      })
      return result
    } catch (error: any) {
      console.error('ドメイン作成エラー:', error)
      return { success: false, error: error.message || 'ドメインの作成に失敗しました' }
    }
  }

  const updateDomain = async (domainId: string, data: { name?: string, description?: string, is_primary?: boolean, status?: 'active' | 'pending' | 'inactive', ssl_enabled?: boolean, ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all', robots_management?: boolean }): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    try {
      const result = await updateDomainAPI(domainId, data)
      return result
    } catch (error: any) {
      console.error('ドメイン更新エラー:', error)
      return { success: false, error: error.message || 'ドメインの更新に失敗しました' }
    }
  }

  const deleteDomain = async (domainId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const result = await deleteDomainAPI(domainId)
      return result
    } catch (error: any) {
      console.error('ドメイン削除エラー:', error)
      return { success: false, error: error.message || 'ドメインの削除に失敗しました' }
    }
  }

  // ドメイン詳細を取得
  const getDomain = async (domainId: string): Promise<{ success: boolean, error?: any, data?: Domain & { subdomains: Subdomain[], dns_records: DnsRecord[] } }> => {
    try {
      const result = await getDomainAPI(domainId)
      return result
    } catch (error: any) {
      console.error('ドメイン取得エラー:', error)
      return { success: false, error: error.message || 'ドメインの取得に失敗しました' }
    }
  }

  // 現在の組織を設定
  const setCurrentOrganization = async (organizationId: string): Promise<void> => {
    try {
      const selectedOrg = organizations.find(org => org.id === organizationId)
      if (selectedOrg) {
        setCurrentOrganizationId(organizationId)
        setOrganization(selectedOrg)
        
        // Cookieに現在の組織IDを保存
        if (typeof window !== 'undefined') {
          document.cookie = `current_organization_id=${organizationId}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=strict`
        }
      }
    } catch (error) {
      console.error('組織設定エラー:', error)
    }
  }

  // サブドメイン関連の関数
  const createSubdomain = async (data: { domain_id: string, name: string, description?: string, ssl_enabled?: boolean }): Promise<{ success: boolean, error?: any, data?: Subdomain }> => {
    try {
      const result = await createSubdomainAPI(data)
      return result
    } catch (error: any) {
      console.error('サブドメイン作成エラー:', error)
      return { success: false, error: error.message || 'サブドメインの作成に失敗しました' }
    }
  }

  const updateSubdomain = async (subdomainId: string, data: { name?: string, description?: string, status?: 'active' | 'inactive', ssl_enabled?: boolean }): Promise<{ success: boolean, error?: any, data?: Subdomain }> => {
    try {
      const result = await updateSubdomainAPI(subdomainId, data)
      return result
    } catch (error: any) {
      console.error('サブドメイン更新エラー:', error)
      return { success: false, error: error.message || 'サブドメインの更新に失敗しました' }
    }
  }

  const deleteSubdomain = async (subdomainId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const result = await deleteSubdomainAPI(subdomainId)
      return result
    } catch (error: any) {
      console.error('サブドメイン削除エラー:', error)
      return { success: false, error: error.message || 'サブドメインの削除に失敗しました' }
    }
  }

  // DNSレコード関連の関数
  const createDnsRecord = async (data: { domain_id: string, type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV', name: string, value: string, ttl?: number, priority?: number }): Promise<{ success: boolean, error?: any, data?: DnsRecord }> => {
    try {
      const result = await createDnsRecordAPI(data)
      return result
    } catch (error: any) {
      console.error('DNSレコード作成エラー:', error)
      return { success: false, error: error.message || 'DNSレコードの作成に失敗しました' }
    }
  }

  const updateDnsRecord = async (dnsRecordId: string, data: { type?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV', name?: string, value?: string, ttl?: number, priority?: number }): Promise<{ success: boolean, error?: any, data?: DnsRecord }> => {
    try {
      const result = await updateDnsRecordAPI(dnsRecordId, data)
      return result
    } catch (error: any) {
      console.error('DNSレコード更新エラー:', error)
      return { success: false, error: error.message || 'DNSレコードの更新に失敗しました' }
    }
  }

  const deleteDnsRecord = async (dnsRecordId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      const result = await deleteDnsRecordAPI(dnsRecordId)
      return result
    } catch (error: any) {
      console.error('DNSレコード削除エラー:', error)
      return { success: false, error: error.message || 'DNSレコードの削除に失敗しました' }
    }
  }

  // ドメイン検証関連の関数
  const verifyDomain = async (domainId: string, verificationType: 'dns' | 'ssl' | 'nameserver'): Promise<{ success: boolean, error?: any, data?: DomainVerification }> => {
    try {
      const result = await verifyDomainAPI(domainId, verificationType)
      return result
    } catch (error: any) {
      console.error('ドメイン検証エラー:', error)
      return { success: false, error: error.message || 'ドメインの検証に失敗しました' }
    }
  }

  const getOrganizationPrimaryDomain = async (): Promise<{ success: boolean, error?: any, data?: Domain }> => {
    try {
      if (!organization?.id) {
        return { success: false, error: '組織が見つかりません' }
      }
      const result = await getOrganizationPrimaryDomainAPI(organization.id)
      return result
    } catch (error: any) {
      console.error('プライマリドメイン取得エラー:', error)
      return { success: false, error: error.message || 'プライマリドメインの取得に失敗しました' }
    }
  }

  const setOrganizationPrimaryDomain = async (domainId: string): Promise<{ success: boolean, error?: any }> => {
    try {
      if (!organization?.id) {
        return { success: false, error: '組織が見つかりません' }
      }
      const result = await setOrganizationPrimaryDomainAPI(organization.id, domainId)
      return result
    } catch (error: any) {
      console.error('プライマリドメイン設定エラー:', error)
      return { success: false, error: error.message || 'プライマリドメインの設定に失敗しました' }
    }
  }

  // サインアウト
  const signOut = async () => {
    try {
      setLoading(true)
      console.log('Supabaseサインアウト開始')
      
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabaseサインアウトエラー:', error)
        throw error
      }
      
      console.log('Supabaseサインアウト成功')
      
      // 状態をクリア
      setUser(null)
      setSession(null)
      setProfile(null)
      setOrganization(null)
      setOrganizations([])
      setCurrentOrganizationId(null)
      
      // Cookieベースのセッション管理のため、localStorageの直接操作は不要
      
      console.log('ログアウト成功、状態クリア完了')
    } catch (error) {
      console.error('サインアウトエラー:', error)
      // エラーが発生しても状態はクリアする
      setUser(null)
      setSession(null)
      setProfile(null)
      setOrganization(null)
      setOrganizations([])
      setCurrentOrganizationId(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true

    // 初期認証状態を取得
    const getInitialSession = async () => {
      try {
        console.log('🔍 初期セッション取得開始')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ セッション取得エラー:', error)
        } else {
          console.log('🔍 初期セッション取得結果:', { session: !!session, userId: session?.user?.id })
          
          if (session && mounted) {
          setSession(session)
          setUser(session.user)
          
          // ユーザーデータを取得
          if (session.user.id) {
            await fetchUserData(session.user)
            }
          }
        }
      } catch (error) {
        console.error('❌ 初期セッション取得エラー:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // 認証状態の変化を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('🔍 認証状態変化:', event, { session: !!session, userId: session?.user?.id })
        
        // SIGNED_OUTイベントの処理
        if (event === 'SIGNED_OUT') {
          console.log('🔍 ログアウトイベントを処理')
          setSession(null)
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setLoading(false)
          return
        }
        
        // セッションが存在する場合の処理
        if (session) {
          console.log('🔍 セッション更新:', session.user.id)
        setSession(session)
          setUser(session.user)
        
          if (session.user.id) {
          await fetchUserData(session.user)
          }
        } else {
          console.log('🔍 セッションなし')
          setSession(null)
          setUser(null)
          setProfile(null)
          setOrganization(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const isAuthenticated = !!user && !!session

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
    isAuthenticated
  }
} 