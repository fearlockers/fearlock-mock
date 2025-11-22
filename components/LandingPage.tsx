'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  EyeIcon,
  BugAntIcon,
  GlobeAltIcon,
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  CheckIcon,
  ArrowRightIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: '脆弱性スキャン',
    description: 'AI搭載の高度なスキャンエンジンで、Webアプリケーションの脆弱性を自動検出。',
    icon: BugAntIcon,
  },
  {
    name: 'リアルタイム監視',
    description: '24/7の監視でサイトの稼働状況とセキュリティ状態を常時チェック。',
    icon: EyeIcon,
  },
  {
    name: 'WAFファイアウォール',
    description: 'クラウドベースのWebアプリケーションファイアウォールで攻撃をブロック。',
    icon: ShieldCheckIcon,
  },
  {
    name: 'ドメイン管理',
    description: '複数ドメインの一元管理とDNSセキュリティ設定の自動化。',
    icon: GlobeAltIcon,
  },
  {
    name: 'レポート & 分析',
    description: '詳細なセキュリティレポートとトレンド分析でリスクを可視化。',
    icon: ChartBarIcon,
  },
  {
    name: 'チーム管理',
    description: 'ロールベースのアクセス制御で組織全体のセキュリティを管理。',
    icon: UsersIcon,
  },
]

const plans = [
  {
    name: 'Starter',
    price: '¥9,800',
    period: '/月',
    description: '個人開発者や小規模サイト向け',
    features: [
      '最大3つのドメイン',
      '基本的な脆弱性スキャン',
      'リアルタイム監視',
      'メールサポート',
    ],
  },
  {
    name: 'Professional',
    price: '¥29,800',
    period: '/月',
    description: '成長企業やチーム向け',
    features: [
      '最大20つのドメイン',
      '高度な脆弱性スキャン',
      'WAFファイアウォール',
      'カスタムレポート',
      'Slack/Teams連携',
      '優先サポート',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'カスタム',
    period: '',
    description: '大企業向けエンタープライズソリューション',
    features: [
      '無制限のドメイン',
      'AI搭載セキュリティ分析',
      'マルチテナント管理',
      'SLA保証',
      '専任サポート',
      'オンプレミス対応',
    ],
  },
]

const testimonials = [
  {
    content: 'Fearlockのおかげで、Webアプリケーションのセキュリティが格段に向上しました。特にリアルタイム監視機能は素晴らしいです。',
    author: '田中 健太',
    role: 'CTO',
    company: 'テックスタートアップ株式会社',
    rating: 5,
  },
  {
    content: '導入が簡単で、すぐに効果を実感できました。チーム全体でセキュリティ状況を共有できるのが非常に便利です。',
    author: '佐藤 美咲',
    role: 'セキュリティエンジニア',
    company: 'デジタルソリューションズ',
    rating: 5,
  },
  {
    content: 'エンタープライズプランのサポートが手厚く、大規模なインフラでも安心して利用できています。',
    author: '山田 太郎',
    role: 'システム管理者',
    company: '大手IT企業',
    rating: 5,
  },
]

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState(1)
  const router = useRouter()

  const handleGetStarted = () => {
    // モック用: 新規作成画面に遷移
    router.push('/signup')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Fearlock</span>
              </div>
            </div>
              <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  機能
                </a>
                <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  価格
                </a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium">
                  お客様の声
                </a>
                <button
                  onClick={() => router.push('/auth')}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium"
                >
                  ログイン
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  今すぐ始める
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Webセキュリティを
              <span className="text-blue-600"> 簡単に、確実に</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Fearlockは、最新のAI技術を活用した包括的なWebセキュリティプラットフォームです。
              脆弱性スキャンから24/7監視まで、あなたのWebアプリケーションを守ります。
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center"
              >
                無料で始める
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center">
                <PlayIcon className="mr-2 h-5 w-5" />
                デモを見る
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              強力なセキュリティ機能
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Fearlockが提供する包括的なセキュリティソリューション
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl hover:shadow-lg transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              シンプルで透明な価格設定
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              あなたのニーズに合わせた最適なプランをお選びください
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm ${
                  plan.popular
                    ? 'ring-2 ring-blue-500 transform scale-105'
                    : 'hover:shadow-lg'
                } transition-all duration-200`}
              >
                {plan.popular && (
                  <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    人気プラン
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {plan.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'お問い合わせ' : '始める'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              お客様からの評価
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              多くの企業がFearlockを信頼しています
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role} · {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            今すぐWebセキュリティを強化しましょう
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            30日間の無料トライアルで、Fearlockの強力なセキュリティ機能をお試しください。
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            無料で始める
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold">Fearlock</span>
              </div>
              <p className="text-gray-400">
                次世代のWebセキュリティプラットフォーム
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">製品</h3>
              <ul className="space-y-2 text-gray-400">
                <li>脆弱性スキャン</li>
                <li>リアルタイム監視</li>
                <li>WAFファイアウォール</li>
                <li>レポート機能</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">サポート</h3>
              <ul className="space-y-2 text-gray-400">
                <li>ドキュメント</li>
                <li>API リファレンス</li>
                <li>お問い合わせ</li>
                <li>システム状況</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">会社</h3>
              <ul className="space-y-2 text-gray-400">
                <li>会社概要</li>
                <li>プライバシーポリシー</li>
                <li>利用規約</li>
                <li>採用情報</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Fearlock. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 