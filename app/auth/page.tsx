// 🚨 モックモード: ログイン画面 🚨
'use client'

import AuthComponent from '@/components/Auth'

export default function AuthPage() {
  // モック版では認証チェックをスキップして常にログイン画面を表示
  return <AuthComponent defaultView="sign_in" redirectTo="/dashboard" />
} 