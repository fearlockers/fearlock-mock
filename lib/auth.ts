import { supabase, supabaseAdmin } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

// 認証状態の型定義
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

// ユーザープロフィールの型定義
export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  organization_id: string | null
  role: string
  created_at: string
  updated_at: string
}

// 組織の型定義
export interface Organization {
  id: string
  name: string
  description: string | null
  domain_id: string | null
  plan: string
  created_at: string
  updated_at: string
}

// プロジェクト情報の型定義
export interface Project {
  id: string
  organization_id: string
  name: string
  description?: string | null
  url?: string | null
  status: 'active' | 'inactive' | 'archived'
  created_by?: string
  created_at: string
  updated_at: string
}

// ドメイン情報の型定義
export interface Domain {
  id: string
  organization_id: string
  project_id?: string
  name: string
  description?: string
  is_primary: boolean
  status: 'active' | 'pending' | 'inactive'
  dns_status: 'pending' | 'verified' | 'failed'
  ssl_enabled: boolean
  ssl_expires_at?: string
  verified_at?: string
  ai_blocking: 'block-all' | 'block-harmful' | 'allow-all'
  robots_management: boolean
  verification_token?: string
  nameservers: string[]
  created_at: string
  updated_at: string
}

// サブドメイン情報の型定義
export interface Subdomain {
  id: string
  domain_id: string
  name: string
  description?: string
  status: 'active' | 'inactive'
  ssl_enabled: boolean
  created_at: string
  updated_at: string
}

// DNSレコード情報の型定義
export interface DnsRecord {
  id: string
  domain_id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV'
  name: string
  value: string
  ttl: number
  priority?: number
  created_at: string
  updated_at: string
}

// ドメイン検証情報の型定義
export interface DomainVerification {
  id: string
  domain_id: string
  verification_type: 'dns' | 'ssl' | 'nameserver'
  status: 'pending' | 'success' | 'failed'
  details?: any
  verified_at: string
  created_at: string
}

// プロフィール更新用の型定義
export interface ProfileUpdateData {
  first_name?: string
  last_name?: string
  avatar_url?: string
}

// 認証コードの型定義
export interface VerificationCode {
  email: string
  code: string
  expiresAt: Date
  attempts: number
}

// メール種別の型定義
export type EmailType = 'verification' | 'security_notification'

// 6桁の認証コードを生成
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ユーザーの存在確認
export const checkUserExists = async (email: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single()
  
  return !!data && !error
}

// 認証コードをメール送信（実際の実装では外部メールサービスを使用）
export const sendVerificationCode = async (email: string, code: string): Promise<{ success: boolean, error?: string }> => {
  try {
    // 実際の実装では、SendGrid、AWS SES、Resendなどのメールサービスを使用
    console.log(`認証コード送信: ${email} -> ${code}`)
    
    // 開発環境では成功として扱う
    return { success: true }
  } catch (error) {
    return { success: false, error: 'メール送信に失敗しました' }
  }
}

// セキュリティ通知をメール送信
export const sendSecurityNotification = async (email: string): Promise<{ success: boolean, error?: string }> => {
  try {
    // 実際の実装では、メールテンプレートとメールサービスを使用
    console.log(`セキュリティ通知送信: ${email}`)
    
    // 開発環境では成功として扱う
    return { success: true }
  } catch (error) {
    return { success: false, error: 'セキュリティ通知の送信に失敗しました' }
  }
}

// 認証コードを一時的に保存（実際の実装ではRedisやDBを使用）
const verificationCodes = new Map<string, VerificationCode>()

// 認証コードを保存
export const storeVerificationCode = (email: string, code: string): void => {
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000) // 3分後
  verificationCodes.set(email, {
    email,
    code,
    expiresAt,
    attempts: 0
  })
}

// SupabaseのOTPを検証（新規ユーザー用）
export const verifyOTPCode = async (email: string, token: string): Promise<{ valid: boolean, error?: string, user?: any, isNewUser?: boolean }> => {
  try {
    console.log('OTP検証開始:', email, token)
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email'
    })
    
    console.log('OTP検証結果:', { data, error })
    
    if (error) {
      console.error('OTP検証エラー:', error)
      return { 
        valid: false, 
        error: error.message.includes('expired') ? '認証コードの有効期限が切れました' :
               error.message.includes('invalid') ? '認証コードが正しくありません' :
               '認証に失敗しました'
      }
    }
    
    if (data.user) {
      console.log('OTP検証成功、ユーザー情報:', data.user.id)
      
      // 新規ユーザーかどうかを判定（created_atが最近の場合）
      const userCreatedAt = new Date(data.user.created_at)
      const now = new Date()
      const timeDiff = now.getTime() - userCreatedAt.getTime()
      const isNewUser = timeDiff < 5 * 60 * 1000 // 5分以内に作成されたユーザーは新規とみなす
      
      if (isNewUser) {
        console.log('新規ユーザーを検出、セッションを維持')
        // 新規ユーザーの場合もセッションを維持（プロフィール設定で必要）
        return { valid: true, user: data.user, isNewUser: true }
      } else {
        // 既存ユーザーの場合はセッションを維持
        return { valid: true, user: data.user, isNewUser: false }
      }
    }
    
    console.error('OTP検証失敗: ユーザー情報が見つかりません')
    return { valid: false, error: '認証に失敗しました' }
  } catch (error) {
    console.error('OTP検証処理エラー:', error)
    return { valid: false, error: '認証処理中にエラーが発生しました' }
  }
}

// 後方互換性のため
export const verifyCode = verifyOTPCode

// 認証プロセスの開始（メールアドレス確認）
export const initiateSignUpProcess = async (email: string): Promise<{ 
  isExistingUser: boolean, 
  success: boolean, 
  error?: string 
}> => {
  try {
    const userExists = await checkUserExists(email)
    
    if (userExists) {
      // 既存ユーザーにはMagic Linkを送信
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      if (error) {
        console.error('既存ユーザーOTP送信エラー:', error)
        return {
          isExistingUser: true,
          success: false,
          error: `セキュリティ通知の送信に失敗しました: ${error.message}`
        }
      }
      
      return {
        isExistingUser: true,
        success: true
      }
    } else {
      // 新規ユーザーには6桁のOTPを送信
      console.log('新規ユーザーのOTP送信を開始:', email)
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })
      
      console.log('OTP送信結果:', { data, error })
      
      if (error) {
        console.error('新規ユーザーOTP送信エラー:', error)
        let errorMessage = '認証コードの送信に失敗しました'
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'このメールアドレスは既に登録されています'
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = '新規登録が無効になっています。管理者にお問い合わせください'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'メールアドレスの形式が正しくありません'
        } else if (error.message.includes('Email rate limit exceeded')) {
          errorMessage = 'メール送信回数の上限に達しました。しばらく待ってから再試行してください'
        } else if (error.message.includes('To signup, please use the signup endpoint')) {
          // この場合は既存ユーザーの可能性があるので再チェック
          const recheckExists = await checkUserExists(email)
          if (recheckExists) {
            return {
              isExistingUser: true,
              success: false,
              error: 'このメールアドレスは既に登録されています。ログインしてください。'
            }
          }
        }
        
        return {
          isExistingUser: false,
          success: false,
          error: `${errorMessage}: ${error.message}`
        }
      }
      
      console.log('新規ユーザーOTP送信成功')
      return {
        isExistingUser: false,
        success: true
      }
    }
  } catch (error) {
    console.error('認証プロセス全体でエラー:', error)
    return {
      isExistingUser: false,
      success: false,
      error: '処理中にエラーが発生しました。ネットワーク接続を確認してください'
    }
  }
}

// サインアップ
export const signUp = async (email: string, password: string, userData?: {
  first_name?: string
  last_name?: string
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

// サインイン
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// サインアウト
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// 現在のユーザーを取得
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { data: user, error }
}

// ユーザープロフィールを取得
export const getUserProfile = async (userId: string) => {
  console.log('🔍 getUserProfile called with userId:', userId)
  
  try {
    console.log('🔍 Querying profiles table...')
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    console.log('🔍 getUserProfile result:', { data, error })
    
    if (error) {
      console.error('❌ getUserProfile error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('✅ getUserProfile successful:', data)
    }
    
    return { data, error }
  } catch (error) {
    console.error('❌ Unexpected error in getUserProfile:', error)
    return { data: null, error }
  }
}

// ユーザープロフィールを更新
export const updateUserProfile = async (userId: string, updateData: ProfileUpdateData) => {
  console.log('🔍 updateUserProfile called with:', { userId, updateData })
  
  try {
    console.log('🔍 Supabase client:', supabase)
    console.log('🔍 Attempting to update profile...')
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
    
    console.log('🔍 Update result:', { data, error })
    
    if (error) {
      console.error('❌ Profile update error:', error)
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('✅ Profile update successful:', data)
    }
    
    return { data, error }
  } catch (error) {
    console.error('❌ Unexpected error in updateUserProfile:', error)
    return { data: null, error }
  }
}

// アバター画像をアップロード
export const uploadAvatar = async (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar_${Date.now()}.${fileExt}`
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (uploadError) {
    return { data: null, error: uploadError }
  }

  // パブリックURLを取得
  const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  return { data: { path: fileName, url: urlData.publicUrl }, error: null }
}

// 古いアバター画像を削除
export const deleteAvatar = async (fileName: string) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .remove([fileName])
  
  return { data, error }
}

// ユーザーの組織を取得
export const getUserOrganization = async (userId: string) => {
  const { data: profile } = await getUserProfile(userId)
  
  if (!profile?.organization_id) {
    return { data: null, error: null }
  }

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.organization_id)
    .single()
  
  return { data, error }
}

// ユーザーが所属する複数組織を取得（組織メンバーシップテーブルがある場合）
export const getUserOrganizations = async (userId: string) => {
  try {
    // まず、ユーザーのプロファイルから直接所属する組織を取得
    const { data: profile } = await getUserProfile(userId)
    
    if (!profile?.organization_id) {
      return { data: [], error: null }
    }

    // 組織メンバーシップテーブルが存在するかチェック
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_memberships')
      .select(`
        organization_id,
        organizations (
          id,
          name,
          description,
          industry,
          size,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')

    if (membershipError && membershipError.code !== 'PGRST116') {
      // 組織メンバーシップテーブルが存在しない場合は、従来の方法で組織を取得
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.organization_id)
        .single()
      
      if (orgError) {
        return { data: [], error: orgError }
      }
      
      return { data: [org], error: null }
    }

    if (memberships && memberships.length > 0) {
      // 組織メンバーシップから組織情報を抽出
      const organizations = memberships
        .map(membership => membership.organizations)
        .filter(org => org !== null)
      
      return { data: organizations, error: null }
    }

    // フォールバック: 従来の方法で組織を取得
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', profile.organization_id)
      .single()
    
    if (orgError) {
      return { data: [], error: orgError }
    }
    
    return { data: [org], error: null }
  } catch (error) {
    console.error('getUserOrganizations error:', error)
    return { data: [], error: error as any }
  }
}

// 組織のメンバー一覧を取得
export const getOrganizationMembers = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name, avatar_url, role, created_at, updated_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

// 組織メンバーのロールを更新
export const updateMemberRole = async (memberId: string, newRole: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: newRole,
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId)
    .select()
    .single()
  
  return { data, error }
}

// 組織から脱退
export const removeMemberFromOrganization = async (memberId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      organization_id: null,
      role: 'member',
      updated_at: new Date().toISOString()
    })
    .eq('id', memberId)
    .select()
    .single()
  
  return { data, error }
}

// ユーザーが組織から脱退
export const leaveOrganization = async (organizationId: string) => {
  try {
    // 現在のユーザーのプロファイルを取得
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'ユーザーが認証されていません' }
    }

    // 組織メンバーシップテーブルが存在する場合は、そこから削除
    const { error: membershipError } = await supabase
      .from('organization_memberships')
      .delete()
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)

    if (membershipError && membershipError.code !== 'PGRST116') {
      // 組織メンバーシップテーブルが存在しない場合は、従来の方法で更新
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          organization_id: null,
          role: 'member',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .eq('organization_id', organizationId)

      if (profileError) {
        console.error('組織脱退エラー:', profileError)
        return { success: false, error: profileError.message }
      }
    } else if (membershipError) {
      console.error('組織脱退エラー:', membershipError)
      return { success: false, error: membershipError.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('組織脱退処理エラー:', error)
    return { success: false, error: '組織からの脱退に失敗しました' }
  }
}

// メンバー招待の型定義
interface InviteMemberData {
  email: string
  first_name: string
  last_name: string
  role: string
  organization_id: string
  organization_name?: string
  invited_by?: string
}

// メンバーを招待
export const inviteMember = async (inviteData: InviteMemberData): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    console.log('招待データ:', inviteData)
    
    // 既存ユーザーかどうかを確認（エラーハンドリングを改善）
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', inviteData.email)
      .maybeSingle()

    if (profileError) {
      console.error('プロファイル確認エラー:', profileError)
      return { success: false, error: `ユーザー確認に失敗しました: ${profileError.message}` }
    }

    if (existingProfile) {
      // 既存ユーザーの場合、組織に追加
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          organization_id: inviteData.organization_id,
          role: inviteData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)

      if (updateError) {
        return { success: false, error: `ユーザーの組織追加に失敗しました: ${updateError.message}` }
      }

      console.log('既存ユーザーを組織に追加しました')
      return { success: true }
    } else {
      // 新規ユーザーの場合、Supabaseの招待機能を使用
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(inviteData.email, {
        data: {
          first_name: inviteData.first_name,
          last_name: inviteData.last_name,
          organization_id: inviteData.organization_id,
          role: inviteData.role,
          organization_name: inviteData.organization_name,
          invited_by: inviteData.invited_by
        },
        redirectTo: `${window.location.origin}/auth?invite=true`
      })

      if (inviteError) {
        console.error('招待エラー詳細:', inviteError)
        return { success: false, error: `招待メールの送信に失敗しました: ${inviteError.message}` }
      }

      console.log('招待メール送信成功')
      return { success: true }
    }
  } catch (error: any) {
    console.error('メンバー招待エラー:', error)
    return { success: false, error: `メンバー招待中にエラーが発生しました: ${error.message || error}` }
  }
}

// 招待情報を取得
export const getInviteInfo = async (): Promise<{
  success: boolean
  error?: string
  data?: {
    first_name: string
    last_name: string
    organization_id: string
    role: string
    organization_name?: string
    invited_by?: string
  }
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'ユーザーが見つかりません' }
    }

    // ユーザーのメタデータから招待情報を取得
    const inviteData = user.user_metadata
    
    if (!inviteData.organization_id || !inviteData.role) {
      return { success: false, error: '招待情報が見つかりません' }
    }

    return {
      success: true,
      data: {
        first_name: inviteData.first_name || '',
        last_name: inviteData.last_name || '',
        organization_id: inviteData.organization_id,
        role: inviteData.role,
        organization_name: inviteData.organization_name,
        invited_by: inviteData.invited_by
      }
    }
  } catch (error: any) {
    console.error('招待情報取得エラー:', error)
    return { success: false, error: `招待情報の取得に失敗しました: ${error.message || error}` }
  }
}

// 招待されたユーザーのプロフィールを更新
export const updateInvitedUserProfile = async (
  userId: string,
  profileData: {
    first_name: string
    last_name: string
    organization_id: string
    role: string
  }
): Promise<{ success: boolean; error?: string }> => {
  try {
    // まずプロファイルが存在するかチェック
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (checkError && checkError.code === 'PGRST116') {
      // プロファイルが存在しない場合、新規作成
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          organization_id: profileData.organization_id,
          role: profileData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (createError) {
        return { success: false, error: `プロフィールの作成に失敗しました: ${createError.message}` }
      }
    } else if (checkError) {
      return { success: false, error: `プロフィールの確認に失敗しました: ${checkError.message}` }
    } else {
      // プロファイルが存在する場合、更新
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          organization_id: profileData.organization_id,
          role: profileData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        return { success: false, error: `プロフィールの更新に失敗しました: ${updateError.message}` }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('招待ユーザープロフィール更新エラー:', error)
    return { success: false, error: `プロフィール更新に失敗しました: ${error.message || error}` }
  }
}

// 組織情報の型定義
interface OrganizationData {
  name: string
  description?: string
  industry?: string
  size?: string
  owner_id: string
}

// 組織メンバーの型定義
export interface OrganizationMember {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

// 組織を作成
export const createOrganization = async (organizationData: OrganizationData): Promise<{ 
  success: boolean
  error?: string
  data?: Organization
}> => {
  try {
    console.log('🔍 組織作成開始:', organizationData)
    
    // 組織を作成
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: organizationData.name,
        description: organizationData.description || '',
        industry: organizationData.industry || '',
        size: organizationData.size || '',
        plan: 'free', // デフォルトプラン
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (orgError) {
      console.error('❌ 組織作成エラー:', orgError)
      return { 
        success: false, 
        error: `組織の作成に失敗しました: ${orgError.message}` 
      }
    }

    console.log('✅ 組織作成成功:', orgData)

    // ユーザーのプロフィールに組織IDを設定
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        organization_id: orgData.id,
        role: 'admin', // 組織作成者は管理者
        updated_at: new Date().toISOString()
      })
      .eq('id', organizationData.owner_id)

    if (profileError) {
      console.error('❌ プロフィール更新エラー:', profileError)
      // 組織は作成されたがプロフィール更新に失敗した場合、組織を削除
      await supabase.from('organizations').delete().eq('id', orgData.id)
      return { 
        success: false, 
        error: `ユーザープロフィールの更新に失敗しました: ${profileError.message}` 
      }
    }

    console.log('✅ プロフィール更新成功')

    return { 
      success: true, 
      data: orgData 
    }
  } catch (error: any) {
    console.error('❌ 組織作成処理エラー:', error)
    return { 
      success: false, 
      error: `組織の作成中にエラーが発生しました: ${error.message || error}` 
    }
  }
}

// 認証状態変化のリスナー
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}

// プロジェクト関連の関数

// 組織のプロジェクト一覧を取得
export const getOrganizationProjects = async (organizationId: string): Promise<{ 
  success: boolean
  error?: string
  data?: Project[]
}> => {
  try {
    console.log('🔍 getOrganizationProjectsAPI: 開始, organizationId:', organizationId)
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    console.log('🔍 getOrganizationProjectsAPI: Supabase結果:', { data, error })

    if (error) {
      console.error('❌ getOrganizationProjectsAPI: Supabaseエラー:', error)
      return { success: false, error: `プロジェクトの取得に失敗しました: ${error.message}` }
    }

    console.log('🔍 getOrganizationProjectsAPI: 成功, プロジェクト数:', data?.length || 0)
    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error('❌ getOrganizationProjectsAPI: 例外エラー:', error)
    return { success: false, error: `プロジェクトの取得に失敗しました: ${error.message || error}` }
  }
}

// プロジェクトを作成
export const createProject = async (projectData: {
  organization_id: string
  name: string
  description?: string
  url?: string
  created_by: string
}): Promise<{ 
  success: boolean
  error?: string
  data?: Project
}> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        organization_id: projectData.organization_id,
        name: projectData.name,
        description: projectData.description,
        url: projectData.url,
        created_by: projectData.created_by,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: `プロジェクトの作成に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('プロジェクト作成エラー:', error)
    return { success: false, error: `プロジェクトの作成に失敗しました: ${error.message || error}` }
  }
}

// プロジェクトを更新
export const updateProject = async (projectId: string, updateData: {
  name?: string
  description?: string
  url?: string
  status?: 'active' | 'inactive' | 'archived'
}): Promise<{ 
  success: boolean
  error?: string
  data?: Project
}> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      return { success: false, error: `プロジェクトの更新に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('プロジェクト更新エラー:', error)
    return { success: false, error: `プロジェクトの更新に失敗しました: ${error.message || error}` }
  }
}

// プロジェクトを削除
export const deleteProject = async (projectId: string): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) {
      return { success: false, error: `プロジェクトの削除に失敗しました: ${error.message}` }
    }

    return { success: true }
  } catch (error: any) {
    console.error('プロジェクト削除エラー:', error)
    return { success: false, error: `プロジェクトの削除に失敗しました: ${error.message || error}` }
  }
}

// プロジェクト詳細を取得
export const getProject = async (projectId: string): Promise<{ 
  success: boolean
  error?: string
  data?: Project
}> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      return { success: false, error: `プロジェクトの取得に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('プロジェクト取得エラー:', error)
    return { success: false, error: `プロジェクトの取得に失敗しました: ${error.message || error}` }
  }
}

// ドメイン関連のAPI関数
export const getOrganizationDomains = async (organizationId: string): Promise<{ 
  success: boolean
  error?: string
  data?: Domain[]
}> => {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select(`
        *,
        subdomains (*),
        dns_records (*)
      `)
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: `ドメインの取得に失敗しました: ${error.message}` }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    return { success: false, error: `ドメインの取得に失敗しました: ${error.message || error}` }
  }
}

export const createDomain = async (domainData: {
  organization_id: string
  project_id?: string
  name: string
  description?: string
  is_primary: boolean
  ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all'
  robots_management?: boolean
}): Promise<{ 
  success: boolean
  error?: string
  data?: Domain
}> => {
  try {
    // プライマリドメインが設定されている場合、既存のプライマリを無効化
    if (domainData.is_primary) {
      await supabase
        .from('domains')
        .update({ is_primary: false })
        .eq('organization_id', domainData.organization_id)
        .eq('is_primary', true)
    }

    const { data, error } = await supabase
      .from('domains')
      .insert([{
        ...domainData,
        ai_blocking: domainData.ai_blocking || 'block-harmful',
        robots_management: domainData.robots_management !== false
      }])
      .select()
      .single()

    if (error) {
      return { success: false, error: `ドメインの作成に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `ドメインの作成に失敗しました: ${error.message || error}` }
  }
}

export const updateDomain = async (domainId: string, updateData: {
  name?: string
  description?: string
  is_primary?: boolean
  status?: 'active' | 'pending' | 'inactive'
  ssl_enabled?: boolean
  ai_blocking?: 'block-all' | 'block-harmful' | 'allow-all'
  robots_management?: boolean
}): Promise<{ 
  success: boolean
  error?: string
  data?: Domain
}> => {
  try {
    // プライマリドメインが設定されている場合、既存のプライマリを無効化
    if (updateData.is_primary) {
      const { data: currentDomain } = await supabase
        .from('domains')
        .select('organization_id')
        .eq('id', domainId)
        .single()

      if (currentDomain) {
        await supabase
          .from('domains')
          .update({ is_primary: false })
          .eq('organization_id', currentDomain.organization_id)
          .eq('is_primary', true)
          .neq('id', domainId)
      }
    }

    const { data, error } = await supabase
      .from('domains')
      .update(updateData)
      .eq('id', domainId)
      .select()
      .single()

    if (error) {
      return { success: false, error: `ドメインの更新に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `ドメインの更新に失敗しました: ${error.message || error}` }
  }
}

export const deleteDomain = async (domainId: string): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    const { error } = await supabase
      .from('domains')
      .delete()
      .eq('id', domainId)

    if (error) {
      return { success: false, error: `ドメインの削除に失敗しました: ${error.message}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: `ドメインの削除に失敗しました: ${error.message || error}` }
  }
}

export const getDomain = async (domainId: string): Promise<{ 
  success: boolean
  error?: string
  data?: Domain & {
    subdomains: Subdomain[]
    dns_records: DnsRecord[]
  }
}> => {
  try {
    const { data, error } = await supabase
      .from('domains')
      .select(`
        *,
        subdomains (*),
        dns_records (*)
      `)
      .eq('id', domainId)
      .single()

    if (error) {
      return { success: false, error: `ドメインの取得に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `ドメインの取得に失敗しました: ${error.message || error}` }
  }
}

export const createSubdomain = async (subdomainData: {
  domain_id: string
  name: string
  description?: string
  ssl_enabled?: boolean
}): Promise<{ 
  success: boolean
  error?: string
  data?: Subdomain
}> => {
  try {
    const { data, error } = await supabase
      .from('subdomains')
      .insert([{
        ...subdomainData,
        ssl_enabled: subdomainData.ssl_enabled || false
      }])
      .select()
      .single()

    if (error) {
      return { success: false, error: `サブドメインの作成に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `サブドメインの作成に失敗しました: ${error.message || error}` }
  }
}

export const updateSubdomain = async (subdomainId: string, updateData: {
  name?: string
  description?: string
  status?: 'active' | 'inactive'
  ssl_enabled?: boolean
}): Promise<{ 
  success: boolean
  error?: string
  data?: Subdomain
}> => {
  try {
    const { data, error } = await supabase
      .from('subdomains')
      .update(updateData)
      .eq('id', subdomainId)
      .select()
      .single()

    if (error) {
      return { success: false, error: `サブドメインの更新に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `サブドメインの更新に失敗しました: ${error.message || error}` }
  }
}

export const deleteSubdomain = async (subdomainId: string): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    const { error } = await supabase
      .from('subdomains')
      .delete()
      .eq('id', subdomainId)

    if (error) {
      return { success: false, error: `サブドメインの削除に失敗しました: ${error.message}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: `サブドメインの削除に失敗しました: ${error.message || error}` }
  }
}

export const createDnsRecord = async (dnsRecordData: {
  domain_id: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV'
  name: string
  value: string
  ttl?: number
  priority?: number
}): Promise<{ 
  success: boolean
  error?: string
  data?: DnsRecord
}> => {
  try {
    const { data, error } = await supabase
      .from('dns_records')
      .insert([{
        ...dnsRecordData,
        ttl: dnsRecordData.ttl || 3600
      }])
      .select()
      .single()

    if (error) {
      return { success: false, error: `DNSレコードの作成に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `DNSレコードの作成に失敗しました: ${error.message || error}` }
  }
}

export const updateDnsRecord = async (dnsRecordId: string, updateData: {
  type?: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV'
  name?: string
  value?: string
  ttl?: number
  priority?: number
}): Promise<{ 
  success: boolean
  error?: string
  data?: DnsRecord
}> => {
  try {
    const { data, error } = await supabase
      .from('dns_records')
      .update(updateData)
      .eq('id', dnsRecordId)
      .select()
      .single()

    if (error) {
      return { success: false, error: `DNSレコードの更新に失敗しました: ${error.message}` }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `DNSレコードの更新に失敗しました: ${error.message || error}` }
  }
}

export const deleteDnsRecord = async (dnsRecordId: string): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    const { error } = await supabase
      .from('dns_records')
      .delete()
      .eq('id', dnsRecordId)

    if (error) {
      return { success: false, error: `DNSレコードの削除に失敗しました: ${error.message}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: `DNSレコードの削除に失敗しました: ${error.message || error}` }
  }
}

export const verifyDomain = async (domainId: string, verificationType: 'dns' | 'ssl' | 'nameserver'): Promise<{ 
  success: boolean
  error?: string
  data?: DomainVerification
}> => {
  try {
    // 実際の実装では、DNS、SSL、ネームサーバーの検証ロジックを実装
    const verificationResult = {
      status: 'success' as const,
      details: { verified: true, timestamp: new Date().toISOString() }
    }

    const { data, error } = await supabase
      .from('domain_verifications')
      .insert([{
        domain_id: domainId,
        verification_type: verificationType,
        status: verificationResult.status,
        details: verificationResult.details
      }])
      .select()
      .single()

    if (error) {
      return { success: false, error: `ドメイン検証に失敗しました: ${error.message}` }
    }

    // ドメインのステータスを更新
    if (verificationResult.status === 'success') {
      await supabase
        .from('domains')
        .update({ 
          dns_status: verificationType === 'dns' ? 'verified' : 'pending',
          verified_at: new Date().toISOString()
        })
        .eq('id', domainId)
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: `ドメイン検証に失敗しました: ${error.message || error}` }
  }
}

// 組織のプライマリドメインを取得
export const getOrganizationPrimaryDomain = async (organizationId: string): Promise<{ 
  success: boolean
  error?: string
  data?: Domain
}> => {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('domain_id')
      .eq('id', organizationId)
      .single()

    if (error) {
      return { success: false, error: `プライマリドメインの取得に失敗しました: ${error.message}` }
    }

    if (!data.domain_id) {
      return { success: false, error: 'プライマリドメインが設定されていません' }
    }

    // ドメイン情報を取得
    const { data: domainData, error: domainError } = await supabase
      .from('domains')
      .select('*')
      .eq('id', data.domain_id)
      .single()

    if (domainError) {
      return { success: false, error: `ドメイン情報の取得に失敗しました: ${domainError.message}` }
    }

    return { success: true, data: domainData }
  } catch (error: any) {
    return { success: false, error: `プライマリドメインの取得に失敗しました: ${error.message || error}` }
  }
}

// 組織のプライマリドメインを設定
export const setOrganizationPrimaryDomain = async (organizationId: string, domainId: string): Promise<{ 
  success: boolean
  error?: string
}> => {
  try {
    // 組織のdomain_idを更新
    const { error: orgError } = await supabase
      .from('organizations')
      .update({ domain_id: domainId })
      .eq('id', organizationId)

    if (orgError) {
      return { success: false, error: `組織の更新に失敗しました: ${orgError.message}` }
    }

    // 指定されたドメインをプライマリに設定
    const { error: domainError } = await supabase
      .from('domains')
      .update({ is_primary: true })
      .eq('id', domainId)
      .eq('organization_id', organizationId)

    if (domainError) {
      return { success: false, error: `ドメインの更新に失敗しました: ${domainError.message}` }
    }

    // 同じ組織の他のドメインをプライマリから外す
    const { error: otherDomainError } = await supabase
      .from('domains')
      .update({ is_primary: false })
      .eq('organization_id', organizationId)
      .neq('id', domainId)

    if (otherDomainError) {
      return { success: false, error: `他のドメインの更新に失敗しました: ${otherDomainError.message}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: `プライマリドメインの設定に失敗しました: ${error.message || error}` }
  }
} 