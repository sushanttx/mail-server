import React from 'react'
import { StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Email } from '../services/api'

interface EmailDetailProps {
  email: Email
  onClose: () => void
  onStarClick: (e: React.MouseEvent) => void
  onDeleteClick: (e: React.MouseEvent) => void
}

const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onClose,
  onStarClick,
  onDeleteClick
}) => {
  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {email.subject}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onStarClick}
              className="text-gray-400 hover:text-yellow-400"
            >
              {email.is_starred ? (
                <StarIconSolid className="h-5 w-5 text-yellow-400" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={onDeleteClick}
              className="text-gray-400 hover:text-red-500"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-16">From:</span>
            <span className="text-gray-900 dark:text-white">{email.from_email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-16">To:</span>
            <span className="text-gray-900 dark:text-white">{email.to_email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 w-16">Date:</span>
            <span className="text-gray-900 dark:text-white">
              {(() => {
                console.log('Detail view email date:', email.date)
                const date = new Date(email.date)
                console.log('Detail view parsed date:', date)
                return date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              })()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100">
            {email.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailDetail 