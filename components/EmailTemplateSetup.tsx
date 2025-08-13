'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  DocumentTextIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { EMAIL_TEMPLATES, SUPABASE_EMAIL_SETUP_INSTRUCTIONS } from '@/lib/emailTemplates'

export default function EmailTemplateSetup() {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<{
    subject: boolean
    body: boolean
    html: boolean
    instructions: boolean
  }>({
    subject: false,
    body: false,
    html: false,
    instructions: false
  })

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error('クリップボードへのコピーに失敗しました:', error)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            メールテンプレート設定
          </h2>
          <DocumentTextIcon className="h-6 w-6 text-blue-500" />
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Supabaseダッシュボードでメールテンプレートを設定して、招待メールの見た目をカスタマイズできます。
        </p>

        {/* Subject */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('subject')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Subject (件名)</span>
            </div>
            {expandedSections.subject ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.subject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  {EMAIL_TEMPLATES.invite.subject}
                </code>
              </div>
              <button
                onClick={() => copyToClipboard(EMAIL_TEMPLATES.invite.subject, 'subject')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedField === 'subject' ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                    コピー完了
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    コピー
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Message Body */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('body')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">Message Body (本文)</span>
            </div>
            {expandedSections.body ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.body && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {EMAIL_TEMPLATES.invite.body}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(EMAIL_TEMPLATES.invite.body, 'body')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedField === 'body' ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                    コピー完了
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    コピー
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* HTML Version */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('html')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">HTML Version (オプション)</span>
            </div>
            {expandedSections.html ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.html && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 mb-3 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {EMAIL_TEMPLATES.invite.html}
                </pre>
              </div>
              <button
                onClick={() => copyToClipboard(EMAIL_TEMPLATES.invite.html, 'html')}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copiedField === 'html' ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                    コピー完了
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    コピー
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>

        {/* Setup Instructions */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <button
            onClick={() => toggleSection('instructions')}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="font-medium text-gray-900 dark:text-white">設定手順</span>
            </div>
            {expandedSections.instructions ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.instructions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4"
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {SUPABASE_EMAIL_SETUP_INSTRUCTIONS}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 