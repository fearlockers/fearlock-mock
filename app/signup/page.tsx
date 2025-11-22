// 🚨 モックモード: 新規登録画面 🚨
'use client'

import AuthComponent from '@/components/Auth'

export default function SignupPage() {
  // モック版では認証チェックをスキップして常にサインアップ画面を表示
  return <AuthComponent defaultView="sign_up" redirectTo="/dashboard" />
}

