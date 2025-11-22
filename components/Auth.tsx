// 🚨 モックモード: マルチステップ認証画面（認証処理なし） 🚨
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

interface AuthProps {
  defaultView?: 'sign_in' | 'sign_up'
  redirectTo?: string
}

type SignUpStep = 'email' | 'verification' | 'password' | 'profile' | 'complete'

export default function AuthComponent({ defaultView = 'sign_in', redirectTo = '/dashboard' }: AuthProps) {
  const [view, setView] = useState<'sign_in' | 'sign_up'>(defaultView)
  const [signUpStep, setSignUpStep] = useState<SignUpStep>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    firstName: '',
    lastName: '',
    organizationName: '',
    industry: '',
    size: ''
  })
  const router = useRouter()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔸 [MOCK] Sign in with:', formData.email)
    router.push(redirectTo)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔸 [MOCK] Send verification code to:', formData.email)
    setSignUpStep('verification')
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔸 [MOCK] Verify code:', formData.verificationCode)
    setSignUpStep('password')
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔸 [MOCK] Set password')
    setSignUpStep('profile')
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔸 [MOCK] Complete signup with:', {
      email: formData.email,
      name: `${formData.lastName} ${formData.firstName}`,
      organization: formData.organizationName,
      industry: formData.industry,
      size: formData.size
    })
    setSignUpStep('complete')
  }

  const handleCompleteSignup = () => {
    console.log('🔸 [MOCK] Redirect to dashboard')
    router.push(redirectTo)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleBackStep = () => {
    if (signUpStep === 'verification') {
      setSignUpStep('email')
    } else if (signUpStep === 'password') {
      setSignUpStep('verification')
    } else if (signUpStep === 'profile') {
      setSignUpStep('password')
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
        return '組織・個人情報を入力'
      case 'complete':
        return 'ようこそ！'
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
        return '組織情報と個人情報を入力してください'
      case 'complete':
        return 'セキュリティプラットフォームへようこそ！'
      default:
        return ''
    }
  }

  const getProgressPercentage = () => {
    switch (signUpStep) {
      case 'email': return '20%'
      case 'verification': return '40%'
      case 'password': return '60%'
      case 'profile': return '80%'
      case 'complete': return '100%'
      default: return '0%'
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
          <div className="mt-4 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              🚨 モックモード: 任意の値を入力してボタンを押すと次に進みます
            </p>
          </div>
        </div>

        {/* プログレスバー（サインアップ時のみ） */}
        {view === 'sign_up' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: '20%' }}
              animate={{ width: getProgressPercentage() }}
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

              {/* 送信ボタン */}
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  ログイン
                </button>
              </div>
            </motion.form>
          ) : (
            // サインアップフォーム（マルチステップ）
            <motion.div
              key={signUpStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-8 space-y-6"
            >
              {/* 戻るボタン */}
              {signUpStep !== 'email' && signUpStep !== 'complete' && (
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-150 ease-in-out"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  戻る
                </button>
              )}

              {/* ステップ1: メールアドレス入力 */}
              {signUpStep === 'email' && (
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
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    認証コードを送信
                  </button>
                </form>
              )}

              {/* ステップ2: 認証コード入力 */}
              {signUpStep === 'verification' && (
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

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>メールで受信した6桁のコードを入力してください</p>
                    <p className="text-xs mt-1">（モック: 任意の6桁を入力）</p>
                  </div>

                  <button
                    type="submit"
                    disabled={formData.verificationCode.length !== 6}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                  >
                    認証して次へ進む
                  </button>
                </form>
              )}

              {/* ステップ3: パスワード設定 */}
              {signUpStep === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
                        placeholder="パスワード（8文字以上）"
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
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    パスワードを設定
                  </button>
                </form>
              )}

              {/* ステップ4: 組織・個人情報入力 */}
              {signUpStep === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* 組織名 */}
                  <div>
                    <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      組織名
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="組織名"
                      />
                    </div>
                  </div>

                  {/* 業界 */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      業界
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                    >
                      <option value="">業界を選択</option>
                      <option value="technology">テクノロジー</option>
                      <option value="finance">金融</option>
                      <option value="healthcare">ヘルスケア</option>
                      <option value="manufacturing">製造業</option>
                      <option value="retail">小売業</option>
                      <option value="education">教育</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  {/* 組織規模 */}
                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      組織規模
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
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

                  {/* 名前 */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        姓
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="appearance-none relative block w-full px-10 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                          placeholder="姓"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        名
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 sm:text-sm"
                        placeholder="名"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                  >
                    登録を完了
                  </button>
                </form>
              )}

              {/* ステップ5: 完了 */}
              {signUpStep === 'complete' && (
                <div className="text-center space-y-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      ようこそ！
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      アカウント作成が完了しました
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      セキュリティプラットフォームへようこそ！
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      🎉 {formData.lastName} {formData.firstName}さん<br />
                      {formData.organizationName}での<br />
                      セキュリティ監視を開始しましょう！
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

        {/* 切り替えリンク（ログイン/サインアップ画面のみ） */}
        {signUpStep === 'email' && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setView(view === 'sign_in' ? 'sign_up' : 'sign_in')
                setSignUpStep('email')
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  verificationCode: '',
                  firstName: '',
                  lastName: '',
                  organizationName: '',
                  industry: '',
                  size: ''
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
        )}

        {/* フッター */}
        {signUpStep !== 'complete' && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              続行することで、
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">利用規約</a>
              および
              <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">プライバシーポリシー</a>
              に同意したものとみなされます。
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
