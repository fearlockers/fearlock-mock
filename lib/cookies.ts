// Cookie操作用のユーティリティ関数

export interface CookieOptions {
  expires?: Date
  maxAge?: number
  path?: string
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

// Cookieを設定
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (typeof window === 'undefined') return // SSR環境では何もしない

  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = true,
    sameSite = 'strict'
  } = options

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`
  }

  document.cookie = cookieString
}

// Cookieを取得
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null // SSR環境ではnullを返す

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return decodeURIComponent(cookieValue || '')
    }
  }
  return null
}

// Cookieを削除
export const removeCookie = (name: string, options: CookieOptions = {}): void => {
  if (typeof window === 'undefined') return // SSR環境では何もしない

  const { path = '/', domain } = options

  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`

  if (path) {
    cookieString += `; path=${path}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  document.cookie = cookieString
}

// セッション用のCookieを設定（30日間有効）
export const setSessionCookie = (name: string, value: string): void => {
  const expires = new Date()
  expires.setDate(expires.getDate() + 30)
  
  setCookie(name, value, {
    expires,
    maxAge: 30 * 24 * 60 * 60, // 30日
    secure: true,
    sameSite: 'strict'
  })
}

// 一時的なCookieを設定（ブラウザセッション終了まで）
export const setTemporaryCookie = (name: string, value: string): void => {
  setCookie(name, value, {
    secure: true,
    sameSite: 'strict'
  })
}
