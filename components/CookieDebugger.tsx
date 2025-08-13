'use client'

import { useState, useEffect } from 'react'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

export default function CookieDebugger() {
  const [cookies, setCookies] = useState<Record<string, string>>({})
  const [newCookieName, setNewCookieName] = useState('')
  const [newCookieValue, setNewCookieValue] = useState('')

  // 現在のcookieを取得
  const refreshCookies = () => {
    if (typeof window === 'undefined') return

    const allCookies: Record<string, string> = {}
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        allCookies[decodeURIComponent(name)] = decodeURIComponent(value)
      }
    })
    setCookies(allCookies)
  }

  useEffect(() => {
    refreshCookies()
  }, [])

  const addCookie = () => {
    if (newCookieName && newCookieValue) {
      setCookie(newCookieName, newCookieValue)
      setNewCookieName('')
      setNewCookieValue('')
      setTimeout(refreshCookies, 100)
    }
  }

  const deleteCookie = (name: string) => {
    removeCookie(name)
    setTimeout(refreshCookies, 100)
  }

  const clearAllCookies = () => {
    Object.keys(cookies).forEach(name => {
      removeCookie(name)
    })
    setTimeout(refreshCookies, 100)
  }

  if (process.env.NODE_ENV === 'production') {
    return null // 本番環境では表示しない
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg max-w-md z-50">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        🍪 Cookie Debugger
      </h3>
      
      {/* 新しいCookie追加 */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Cookie名"
          value={newCookieName}
          onChange={(e) => setNewCookieName(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Cookie値"
          value={newCookieValue}
          onChange={(e) => setNewCookieValue(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={addCookie}
          className="w-full px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* 既存のCookie表示 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            現在のCookie ({Object.keys(cookies).length})
          </span>
          <button
            onClick={clearAllCookies}
            className="text-xs text-red-500 hover:text-red-700"
          >
            全削除
          </button>
        </div>
        
        {Object.keys(cookies).length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cookieがありません</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {Object.entries(cookies).map(([name, value]) => (
              <div key={name} className="flex justify-between items-center text-xs">
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{name}:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400 truncate">{value}</span>
                </div>
                <button
                  onClick={() => deleteCookie(name)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 更新ボタン */}
      <button
        onClick={refreshCookies}
        className="w-full px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        更新
      </button>
    </div>
  )
}
