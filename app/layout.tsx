import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fearlock - 統合セキュリティプラットフォーム',
  description: '脆弱性診断、ソースコード診断、ネットワーク診断からネットワーク監視まで包括的に対応するセキュリティプラットフォーム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
} 