import React, { useState, useEffect } from 'react'
import { EnvelopeIcon, EnvelopeOpenIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import EmailDetail from './EmailDetail'
import { api, PaginationParams, Email } from '../services/api'

interface EmailListProps {
  activeTab: 'all' | 'inbox' | 'spam' | 'bin';
}

const EmailList: React.FC<EmailListProps> = ({ activeTab }) => {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState<'date' | 'from' | 'subject'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEmails = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params: PaginationParams = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        tab: activeTab
      }
      console.log('Fetching emails with params:', params)
      const response = await api.getEmails(params)
      console.log('API Response:', response)
      
      if (response && Array.isArray(response)) {
        setEmails(response)
        setTotalPages(1)
      } else if (response && response.emails && response.pagination) {
        setEmails(response.emails)
        setTotalPages(response.pagination.totalPages)
      } else {
        console.error('Invalid response format:', response)
        setError('Invalid response format from server')
        setEmails([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error('Error fetching emails:', error)
      setError('Failed to fetch emails')
      setEmails([])
      setTotalPages(1)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchEmails()
  }, [currentPage, sortBy, sortOrder, activeTab])

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email)
    if (!email.is_read) {
      try {
        await api.markAsRead(email.id)
        setEmails(emails.map(e => 
          e.id === email.id ? { ...e, is_read: true } : e
        ))
      } catch (error) {
        console.error('Error marking email as read:', error)
      }
    }
  }

  const handleStarClick = async (email: Email, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.toggleStar(email.id)
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, is_starred: !e.is_starred } : e
      )
      setEmails(updatedEmails)
      // Update selected email if it's the one being starred
      if (selectedEmail?.id === email.id) {
        setSelectedEmail(updatedEmails.find(e => e.id === email.id) || null)
      }
    } catch (error) {
      console.error('Error toggling star:', error)
    }
  }

  const handleDeleteClick = async (email: Email, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (activeTab === 'bin') {
        await api.permanentDeleteEmail(email.id)
      } else {
        await api.deleteEmail(email.id)
      }
      setEmails(emails.filter(e => e.id !== email.id))
      if (selectedEmail?.id === email.id) {
        setSelectedEmail(null)
      }
    } catch (error) {
      console.error('Error deleting email:', error)
    }
  }

  const handleRestoreClick = async (email: Email, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.restoreEmail(email.id)
      setEmails(emails.filter(e => e.id !== email.id))
      if (selectedEmail?.id === email.id) {
        setSelectedEmail(null)
      }
    } catch (error) {
      console.error('Error restoring email:', error)
    }
  }

  const handleCloseDetail = () => {
    setSelectedEmail(null)
  }

  const handleSort = (field: 'date' | 'from' | 'subject') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const filteredEmails = emails?.filter(email => {
    switch (activeTab) {
      case 'all':
        return !email.deleted_at; // Show all non-deleted emails
      case 'inbox':
        return !email.deleted_at && !email.is_spam; // Show only non-deleted, non-spam emails
      case 'spam':
        return !email.deleted_at && email.is_spam; // Show only non-deleted spam emails
      case 'bin':
        return email.deleted_at !== null; // Show only deleted emails
      default:
        return true;
    }
  }) || []

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="h-full flex">
      <div className={`flex-1 ${selectedEmail ? 'hidden md:block' : ''}`}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1 rounded-md text-sm ${
                sortBy === 'date' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('from')}
              className={`px-3 py-1 rounded-md text-sm ${
                sortBy === 'from' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              From {sortBy === 'from' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('subject')}
              className={`px-3 py-1 rounded-md text-sm ${
                sortBy === 'subject' 
                  ? 'bg-primary-light dark:bg-primary-dark text-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Subject {sortBy === 'subject' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary-dark"></div>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  email.is_read 
                    ? 'bg-white dark:bg-gray-800' 
                    : 'bg-blue-50 dark:bg-blue-900/20'
                } hover:bg-gray-50 dark:hover:bg-gray-700/50`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {email.is_read ? (
                      <EnvelopeOpenIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        email.is_read 
                          ? 'text-gray-900 dark:text-gray-100' 
                          : 'text-gray-900 dark:text-gray-100 font-bold'
                      }`}>
                        {email.from_email}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(email.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {activeTab === 'bin' ? (
                          <button
                            onClick={(e) => handleRestoreClick(email, e)}
                            className="text-gray-400 hover:text-green-500"
                            title="Restore"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleStarClick(email, e)}
                            className="text-gray-400 hover:text-yellow-400"
                          >
                            {email.is_starred ? (
                              <StarIconSolid className="h-5 w-5 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-5 w-5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteClick(email, e)}
                          className="text-gray-400 hover:text-red-500"
                          title={activeTab === 'bin' ? 'Delete Permanently' : 'Move to Recycle Bin'}
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm ${
                      email.is_read 
                        ? 'text-gray-500 dark:text-gray-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedEmail && (
        <div className="md:ml-4 md:w-1/2">
          <EmailDetail
            email={selectedEmail}
            onClose={handleCloseDetail}
            onStarClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              handleStarClick(selectedEmail, e)
            }}
            onDeleteClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              handleDeleteClick(selectedEmail, e)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default EmailList 