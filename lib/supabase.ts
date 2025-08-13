import { createClient } from '@supabase/supabase-js'

// Supabase URL とキー
const supabaseUrl = 'https://rqhuymwhhhyzwpqtohck.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxaHV5bXdoaGh5endwcXRvaGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNjY0NDUsImV4cCI6MjA2ODg0MjQ0NX0.LouLUwXuENsdXe4EjSfAwWxo8735W8I65_eKi5hZf_0'

// Service Role Key（招待機能用）
// 注意: このキーはサーバーサイドでのみ使用し、クライアントサイドでは使用しないでください
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxaHV5bXdoaGh5endwcXRvaGNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzI2NjQ0NSwiZXhwIjoyMDY4ODQyNDQ1fQ.Ze-eatiEB1ysIzdsbEVDqWyfgBJIUBHmXvj4GCsZneg'

// カスタムストレージアダプター（Cookieベース）
const createCookieStorage = () => {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=')
        if (cookieName === key) {
          return decodeURIComponent(cookieValue || '')
        }
      }
      return null
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return
      const expires = new Date()
      expires.setDate(expires.getDate() + 30) // 30日間有効
      
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      cookieString += `; expires=${expires.toUTCString()}`
      cookieString += '; path=/'
      cookieString += '; secure'
      cookieString += '; samesite=strict'
      
      document.cookie = cookieString
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return
      let cookieString = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      cookieString += '; path=/'
      document.cookie = cookieString
    }
  }
}

// Supabaseクライアント（Cookieベースのセッション管理）
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: createCookieStorage(),
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// レガシー用のクライアント（既存のコードとの互換性のため）
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: createCookieStorage(),
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

// Service Role Keyを使用するクライアント（招待機能用）
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
)

// データベース型定義（後で生成されたものに置き換え）
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          organization_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          domain: string | null
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          domain?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          domain?: string | null
          plan?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          status?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          status?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 