'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  signIn, 
  initiateSignUpProcess, 
  verifyOTPCode,
  createOrganization
} from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/contexts/ThemeContext'
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'

interface AuthProps {
  defaultView?: 'sign_in' | 'sign_up'
  redirectTo?: string
}

type SignUpStep = 'email' | 'verification' | 'password' | 'profile' | 'organization' | 'complete'

export default function AuthComponent({ defaultView = 'sign_in', redirectTo = '/' }: AuthProps) {
  const [view, setView] = useState<'sign_in' | 'sign_up'>(defaultView)
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('email')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    firstName: '',
    lastName: ''
  })
  const [organizationData, setOrganizationData] = useState({
    name: '',
    description: '',
    industry: '',
    size: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null)
  const [isNewUserFlow, setIsNewUserFlow] = useState(false)
  const [isInvitedUser, setIsInvitedUser] = useState(false)
  const [inviteInfo, setInviteInfo] = useState<{
    first_name: string
    last_name: string
    organization_id: string
    role: string
    organization_name?: string
    invited_by?: string
  } | null>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const { getInviteInfo, updateInvitedUserProfile } = useAuth()

    // 招待情報をチェック
  useEffect(() => {
    const checkInviteInfo = async () => {
      try {
        // URLパラメータで招待フラグをチェック
        const urlParams = new URLSearchParams(window.location.search)
        const isInvite = urlParams.get('invite') === 'true'
        
        if (isInvite) {
          console.log('招待ユーザーとして検出')
          setIsInvitedUser(true)
          
          // 招待リンクからの遷移の場合、サインアップフローを開始
          setView('sign_up')
          setSignUpStep('email')
          
          // 招待リンクの場合は認証状態を確認
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            console.log('招待リンクで認証済みユーザーを検出:', session.user.id)
            setAuthenticatedUser(session.user)
            
            // メールアドレスを自動設定
            setFormData(prev => ({
              ...prev,
              email: session.user.email || ''
            }))
            
            setSignUpStep('password')
          }
        }
      } catch (error) {
        console.error('招待情報チェックエラー:', error)
      }
    }

    checkInviteInfo()
  }, [])

  // ステップの変更を監視
  useEffect(() => {
    console.log('ステップ変更:', signUpStep)
  }, [signUpStep])



  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setError(error.message)
      } else {
        router.push(redirectTo)
      }
    } catch (error) {
      setError('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await initiateSignUpProcess(formData.email)
      
      if (!result.success) {
        setError(result.error || '処理に失敗しました')
        return
      }

      if (result.isExistingUser) {
        setSuccess('セキュリティ通知とログインリンクをメールアドレスに送信しました。メールをご確認ください。')
      } else {
        setSuccess('6桁の認証コードをメールアドレスに送信しました。メールをご確認ください。')
        // デバッグ情報をコンソールに出力
        console.log('メール送信処理完了:', {
          email: formData.email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
        setSignUpStep('verification')
      }
    } catch (error) {
      setError('メール送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('認証コード確認開始:', formData.email, formData.verificationCode)
      
      const result = await verifyOTPCode(formData.email, formData.verificationCode)
      
      if (!result.valid) {
        setError(result.error || '認証に失敗しました')
        if (result.error?.includes('有効期限')) {
          setSignUpStep('email')
        }
        return
      }

      console.log('認証コード確認成功')

      if (result.user) {
        console.log('認証結果からユーザー情報取得成功:', result.user.id)
        setAuthenticatedUser(result.user)
        
        if (result.isNewUser) {
          // 新規ユーザーの場合はパスワード設定画面に遷移
          console.log('新規ユーザー: パスワード設定画面に遷移')
          setIsNewUserFlow(true)
          // URLパラメータに新規ユーザーフラグを設定
          const url = new URL(window.location.href)
          url.searchParams.set('newUser', 'true')
          window.history.replaceState({}, '', url.toString())
          setSuccess('認証が完了しました。パスワードを設定してください。')
          setSignUpStep('password')
        } else {
          // 既存ユーザーの場合はダッシュボードに遷移
          console.log('既存ユーザー: ダッシュボードに遷移')
          setSuccess('ログインが完了しました。')
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
        }
      } else {
        setError('ユーザー情報の取得に失敗しました')
      }

    } catch (error) {
      console.error('認証コード確認エラー:', error)
      setError('認証に失敗しました')
    } finally {
      setLoading(false)
    }
  }



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleOrganizationInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setOrganizationData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!authenticatedUser) {
        setError('認証が必要です')
        return
      }

      // パスワードの確認
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません')
        return
      }

      if (formData.password.length < 8) {
        setError('パスワードは8文字以上である必要があります')
        return
      }

      // パスワードを更新
      try {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        })

        if (passwordError) {
          console.error('パスワード更新エラー:', passwordError)
          setError(`パスワードの設定に失敗しました: ${passwordError.message}`)
          return
        }
        
        console.log('パスワード更新成功')
      } catch (passwordUpdateError) {
        console.error('パスワード更新処理エラー:', passwordUpdateError)
        setError('パスワードの設定に失敗しました')
        return
      }

      // 招待ユーザーの場合のみ招待情報を取得
      if (isInvitedUser) {
        const result = await getInviteInfo()
        if (result.success && result.data) {
          console.log('招待情報取得成功:', result.data)
          setInviteInfo(result.data)
          
                  // フォームデータに招待情報を設定
        setFormData(prev => ({
          ...prev,
          firstName: result.data?.first_name || '',
          lastName: result.data?.last_name || ''
        }))
        
        // 組織データに招待情報を設定
        if (result.data?.organization_name) {
                      setOrganizationData(prev => ({
              ...prev,
              name: result.data?.organization_name || '',
              description: `${result.data?.organization_name}の組織設定`,
              industry: 'technology',
              size: 'small'
            }))
        }
        } else {
          console.error('招待情報取得失敗:', result.error)
          setError('招待情報の取得に失敗しました')
          return
        }
      }

      console.log('パスワード設定完了、プロフィール設定画面に遷移')
      setSuccess('パスワードが設定されました。プロフィール情報を設定してください。')
      setSignUpStep('profile')
    } catch (error: any) {
      setError(`パスワードの設定に失敗しました: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!authenticatedUser) {
        setError('認証が必要です')
        return
      }

      // 招待ユーザーの場合、組織情報も含めてプロフィールを更新
      if (isInvitedUser && inviteInfo) {
        try {
          const result = await updateInvitedUserProfile(authenticatedUser.id, {
            first_name: formData.firstName,
            last_name: formData.lastName,
            organization_id: inviteInfo.organization_id,
            role: inviteInfo.role
          })

          if (!result.success) {
            setError(`プロフィールの更新に失敗しました: ${result.error}`)
            return
          }
          
          console.log('招待ユーザーのプロフィール更新成功')
        } catch (profileUpdateError) {
          console.error('招待ユーザープロフィール更新処理エラー:', profileUpdateError)
          setError('プロフィールの更新に失敗しました')
          return
        }
      } else {
        // 通常ユーザーの場合、パスワードも設定
        if (formData.password) {
      // パスワードの確認
      if (formData.password !== formData.confirmPassword) {
        setError('パスワードが一致しません')
        return
      }

      if (formData.password.length < 8) {
        setError('パスワードは8文字以上である必要があります')
        return
      }

          // パスワードを更新
      try {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.password
        })

        if (passwordError) {
          console.error('パスワード更新エラー:', passwordError)
          setError(`パスワードの設定に失敗しました: ${passwordError.message}`)
          return
        }
        
        console.log('パスワード更新成功')
      } catch (passwordUpdateError) {
        console.error('パスワード更新処理エラー:', passwordUpdateError)
        setError('パスワードの設定に失敗しました')
        return
          }
      }

        // 通常のプロフィール情報を更新
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', authenticatedUser.id)

        if (profileError) {
          console.error('プロフィール更新エラー:', profileError)
          setError(`プロフィールの更新に失敗しました: ${profileError.message}`)
          return
        }
        
        console.log('プロフィール更新成功')
      } catch (profileUpdateError) {
        console.error('プロフィール更新処理エラー:', profileUpdateError)
        setError('プロフィールの更新に失敗しました')
        return
      }
      }

      console.log('プロフィール設定完了')
      
      // 招待ユーザーの場合は組織設定画面に遷移
      if (isInvitedUser) {
        setSuccess('プロフィール情報が設定されました。組織情報を確認してください。')
        setSignUpStep('organization')
      } else {
      setSuccess('プロフィール情報が設定されました。組織情報を設定してください。')
      // URLパラメータを更新して新規ユーザーフローを継続
      const url = new URL(window.location.href)
      url.searchParams.set('newUser', 'true')
      window.history.replaceState({}, '', url.toString())
      setSignUpStep('organization')
      }
    } catch (error: any) {
      setError(`プロフィールの設定に失敗しました: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleOrganizationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!authenticatedUser) {
        setError('認証が必要です')
        return
      }

      const organizationResult = await createOrganization({
        name: organizationData.name,
        description: organizationData.description,
        industry: organizationData.industry,
        size: organizationData.size,
        owner_id: authenticatedUser.id
      })

      if (organizationResult.success) {
        console.log('組織作成完了、完了画面に遷移')
        setSuccess('組織が正常に作成されました。')
        // URLパラメータを更新して新規ユーザーフローを継続
        const url = new URL(window.location.href)
        url.searchParams.set('newUser', 'true')
        window.history.replaceState({}, '', url.toString())
        setSignUpStep('complete')
      } else {
        setError(organizationResult.error || '組織の作成に失敗しました')
      }
    } catch (error) {
      setError('組織の作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipOrganization = () => {
    console.log('組織設定スキップ、完了画面に遷移')
    setSuccess('組織設定をスキップしました。')
    // URLパラメータを更新して新規ユーザーフローを継続
    const url = new URL(window.location.href)
    url.searchParams.set('newUser', 'true')
    window.history.replaceState({}, '', url.toString())
    setSignUpStep('complete')
  }

  const handleCompleteSignup = async () => {
    try {
      console.log('新規ユーザーフロー完了、ダッシュボードに遷移')
      
      // 新規ユーザーフラグをリセット
      setIsNewUserFlow(false)
      
      // URLパラメータをクリア
      const url = new URL(window.location.href)
      url.searchParams.delete('newUser')
      window.history.replaceState({}, '', url.toString())
      
      // セッションを再取得して確立
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('セッション取得エラー:', error)
      } else if (session) {
        console.log('セッション確立成功:', session.user.id)
      }
      
      // 認証状態を強制的に更新
      await supabase.auth.refreshSession()
      
      // セッションが確立されるまで待機
      let attempts = 0
      const maxAttempts = 10
      
      const waitForSession = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session && session.user) {
          console.log('セッション確立完了、ダッシュボードに遷移')
          window.location.replace('/')
        } else if (attempts < maxAttempts) {
          attempts++
          console.log(`セッション確立待機中... (${attempts}/${maxAttempts})`)
          setTimeout(waitForSession, 500)
        } else {
          console.log('セッション確立タイムアウト、強制遷移')
          window.location.replace('/')
        }
      }
      
      waitForSession()
    } catch (error) {
      console.error('完了処理エラー:', error)
      // エラーが発生した場合もダッシュボードに遷移
      window.location.replace('/')
    }
  }

  const handleBackStep = () => {
    console.log('戻るボタンクリック、現在のステップ:', signUpStep)
    setError(null)
    setSuccess(null)
    
    if (signUpStep === 'verification') {
      setSignUpStep('email')
      setIsCodeSent(false)
    } else if (signUpStep === 'profile') {
      setSignUpStep('verification')
    } else if (signUpStep === 'organization') {
      setSignUpStep('profile')
    } else if (signUpStep === 'complete') {
      setSignUpStep('organization')
    }
  }

  const getStepTitle = () => {
    switch (signUpStep) {
      case 'email':
        return 'メールアドレスを入力'
      case 'verification':
        return '認証コードを入力'
      case 'password':
        return 'パスワードを設定'
      case 'profile':
        return '個人情報を設定'
      case 'organization':
        return isInvitedUser ? '組織に参加' : '組織情報を設定（任意）'
      case 'complete':
        return '登録完了'
      default:
        return 'アカウント作成'
    }
  }

  const getStepDescription = () => {
    switch (signUpStep) {
      case 'email':
        return '登録するメールアドレスを入力してください'
      case 'verification':
        return 'メールに送信された6桁のコードを入力してください'
      case 'password':
        return 'アカウント用のパスワードを設定してください'
      case 'profile':
        return '名前とプロフィール画像を設定してください'
      case 'organization':
        return isInvitedUser ? '招待された組織の情報を確認してください' : '組織の情報を入力してください（後で変更可能）'
      case 'complete':
        return 'セキュリティプラットフォームへようこそ！'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* ロゴとタイトル */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-blue-500">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {view === 'sign_in' ? 'Fearlockにログイン' : getStepTitle()}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {view === 'sign_in' 
              ? 'セキュリティプラットフォームにアクセス' 
              : getStepDescription()
            }
          </p>
        </div>

        {/* プログレスバー（サインアップ時のみ） */}
        {view === 'sign_up' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: '20%' }}
              animate={{
                width: signUpStep === 'email' ? (isInvitedUser && authenticatedUser ? '25%' : '17%') :
                       signUpStep === 'verification' ? (isInvitedUser && authenticatedUser ? '25%' : '33%') :
                       signUpStep === 'password' ? '50%' :
                       signUpStep === 'profile' ? '67%' :
                       signUpStep === 'organization' ? '83%' :
                       signUpStep === 'complete' ? '100%' : '17%'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {view === 'sign_in' ? (
            // ログインフォーム
            <motion.form
              key="signin"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mt-8 space-y-6"
              onSubmit={handleSignIn}
            >
              <div className="space-y-4">
                {/* メールアドレス */}
                <div>
                  <label htmlFor="email" className="sr-only">メールアドレス</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                      placeholder="メールアドレス"
                    />
                  </div>
                </div>

                {/* パスワード */}
                <div>
                  <label htmlFor="password" className="sr-only">パスワード</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                      placeholder="パスワード"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* エラーメッセージ */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4"
                >
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* 送信ボタン */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      処理中...
                    </div>
                  ) : (
                    'ログイン'
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            // サインアップフォーム
            <motion.div
              key={signUpStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-8 space-y-6"
            >
              {/* 戻るボタン */}
              {signUpStep !== 'email' && (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 ease-in-out"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  戻る
                </button>
              )}

              {/* ステップ1: メールアドレス入力（招待リンクからの遷移でない場合のみ） */}
              {signUpStep === 'email' && !authenticatedUser && (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="sr-only">メールアドレス</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="メールアドレス"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        送信中...
                      </div>
                    ) : (
                      '認証コードを送信'
                    )}
                  </button>
                </form>
              )}

              {/* ステップ2: 認証コード入力（招待リンクからの遷移でない場合のみ） */}
              {signUpStep === 'verification' && !authenticatedUser && (
                <form onSubmit={handleVerificationSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="verificationCode" className="sr-only">認証コード</label>
                    <input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      maxLength={6}
                      required
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  {/* 認証コードのヒント */}
                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>メールで受信した6桁のコードを入力してください</p>
                    <p className="text-xs mt-1">コードの有効期限は3分間です</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.verificationCode || formData.verificationCode.length !== 6}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        認証中...
                      </div>
                    ) : (
                      '認証して次へ進む'
                    )}
                  </button>
                </form>
              )}

              {/* ステップ3: パスワード設定 */}
              {signUpStep === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* 招待ユーザー用のメッセージ */}
                  {isInvitedUser && (
                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            組織への招待
                          </h3>
                          <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                            <p>アカウント作成ボタンを押していただき、ありがとうございます。</p>
                            <p>パスワードを設定してアカウント作成を完了してください。</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* パスワード */}
                  <div>
                    <label htmlFor="password" className="sr-only">パスワード</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="パスワード"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* パスワード確認 */}
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">パスワード確認</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="パスワードを再入力"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.password || !formData.confirmPassword}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        設定中...
                      </div>
                    ) : (
                      'パスワードを設定'
                    )}
                  </button>
                </form>
              )}

              {/* ステップ4: プロフィール情報設定 */}
              {signUpStep === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* 招待ユーザー用のメッセージ */}
                  {isInvitedUser && inviteInfo && (
                    <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            組織への招待
                          </h3>
                          <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                            <p>権限: {inviteInfo.role === 'admin' ? '管理者' : 
                                       inviteInfo.role === 'manager' ? 'マネージャー' : 
                                       inviteInfo.role === 'member' ? 'メンバー' : 
                                       inviteInfo.role === 'viewer' ? '閲覧者' : inviteInfo.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}



                  {/* 通常ユーザーの場合のみパスワード設定 */}
                  {!isInvitedUser && (
                    <>
                  {/* パスワード */}
                  <div>
                    <label htmlFor="password" className="sr-only">パスワード</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="パスワード（8文字以上）"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* パスワード確認 */}
                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">パスワード確認</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="パスワードを再入力"
                      />
                    </div>
                  </div>
                    </>
                  )}

                  {/* 名前 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lastName" className="sr-only">姓</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="姓"
                      />
                    </div>
                    <div>
                      <label htmlFor="firstName" className="sr-only">名</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="名"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.firstName || !formData.lastName || (!isInvitedUser && (!formData.password || !formData.confirmPassword))}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        設定中...
                      </div>
                    ) : (
                      '次へ'
                    )}
                  </button>
                </form>
              )}

              {/* ステップ5: 組織情報設定（招待ユーザーはスキップ） */}
              {signUpStep === 'organization' && !isInvitedUser && (
                <form onSubmit={handleOrganizationSubmit} className="space-y-6">
                  {/* 組織名 */}
                  <div>
                    <label htmlFor="organizationName" className="sr-only">組織名</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="organizationName"
                        name="name"
                        type="text"
                        required
                        value={organizationData.name}
                        onChange={handleOrganizationInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="組織名"
                      />
                    </div>
                  </div>

                  {/* 業界 */}
                  <div>
                    <label htmlFor="industry" className="sr-only">業界</label>
                    <select
                      id="industry"
                      name="industry"
                      value={organizationData.industry}
                      onChange={handleOrganizationInputChange}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                    >
                      <option value="">業界を選択</option>
                      <option value="technology">テクノロジー</option>
                      <option value="finance">金融</option>
                      <option value="healthcare">ヘルスケア</option>
                      <option value="manufacturing">製造業</option>
                      <option value="retail">小売業</option>
                      <option value="education">教育</option>
                      <option value="government">政府・公共機関</option>
                      <option value="consulting">コンサルティング</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  {/* 組織規模 */}
                  <div>
                    <label htmlFor="size" className="sr-only">組織規模</label>
                    <select
                      id="size"
                      name="size"
                      value={organizationData.size}
                      onChange={handleOrganizationInputChange}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                    >
                      <option value="">組織規模を選択</option>
                      <option value="1-10">1-10人</option>
                      <option value="11-50">11-50人</option>
                      <option value="51-200">51-200人</option>
                      <option value="201-1000">201-1000人</option>
                      <option value="1000+">1000人以上</option>
                    </select>
                  </div>

                  {/* 説明 */}
                  <div>
                    <label htmlFor="description" className="sr-only">説明</label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={organizationData.description}
                      onChange={handleOrganizationInputChange}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                      placeholder="組織の説明（任意）"
                    />
                  </div>

                  {/* ボタン */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleSkipOrganization}
                      className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      スキップ
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !organizationData.name.trim()}
                      className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          作成中...
                        </div>
                      ) : (
                        '組織を作成'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* 招待ユーザー用: 組織情報表示 */}
              {signUpStep === 'organization' && isInvitedUser && inviteInfo && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                      組織に参加します
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      以下の組織に招待されています
                    </p>
                  </div>

                  {/* 組織情報 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        組織名
                      </label>
                      <div className="flex items-center space-x-3">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {inviteInfo.organization_name || '組織名が設定されていません'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        権限
                      </label>
                      <div className="flex items-center space-x-3">
                        <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium">
                          {inviteInfo.role === 'admin' ? '管理者' : 
                           inviteInfo.role === 'member' ? 'メンバー' : 
                           inviteInfo.role}
                        </span>
                      </div>
                    </div>

                    {inviteInfo.invited_by && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          招待者
                        </label>
                        <div className="flex items-center space-x-3">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {inviteInfo.invited_by}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      組織情報の設定は完了しています。次に進んでアカウントを作成してください。
                    </p>
                    <button
                      onClick={() => setSignUpStep('complete')}
                      className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                      組織に参加
                    </button>
                  </div>
                </div>
              )}

              {/* ステップ6: 完了 */}
              {signUpStep === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      アカウント作成完了！
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      セキュリティプラットフォームへようこそ！
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteSignup}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    ダッシュボードに進む
                  </button>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* エラー・成功メッセージ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 rounded-lg p-4"
            >
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 切り替えリンク */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setView(view === 'sign_in' ? 'sign_up' : 'sign_in')
              setSignUpStep('email')
              setError(null)
              setSuccess(null)
              setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                verificationCode: '',
                firstName: '',
                lastName: ''
              })
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 transition duration-150 ease-in-out"
          >
            {view === 'sign_in' 
              ? 'アカウントをお持ちでない方はこちら' 
              : '既にアカウントをお持ちの方はこちら'
            }
          </button>
        </div>

        {/* フッター */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            続行することで、
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">利用規約</a>
            および
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">プライバシーポリシー</a>
            に同意したものとみなされます。
          </p>
        </div>
      </motion.div>
    </div>
  )
} 