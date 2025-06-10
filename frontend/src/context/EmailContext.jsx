import React, { createContext, useContext, useState, useEffect } from 'react'

// Use relative URL since we're using Vite's proxy
const API_URL = '/api'

const EmailContext = createContext()

export const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([])
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/emails`)
      if (!response.ok) throw new Error('Failed to fetch emails')
      const data = await response.json()
      setEmails(data.emails)
      setPagination(data.pagination)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStar = async (id) => {
    try {
      const response = await fetch(`${API_URL}/emails/${id}/star`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to toggle star')
      await fetchEmails()
    } catch (error) {
      console.error('Error toggling star:', error)
    }
  }

  const deleteEmail = async (id) => {
    try {
      const response = await fetch(`${API_URL}/emails/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete email')
      await fetchEmails()
    } catch (error) {
      console.error('Error deleting email:', error)
    }
  }

  const toggleSpam = async (id) => {
    try {
      const response = await fetch(`${API_URL}/emails/${id}/spam`, {
        method: 'PATCH',
      })
      if (!response.ok) throw new Error('Failed to toggle spam status')
      await fetchEmails()
    } catch (error) {
      console.error('Error toggling spam:', error)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  const value = {
    emails,
    selectedEmail,
    setSelectedEmail,
    toggleStar,
    deleteEmail,
    toggleSpam,
    fetchEmails,
    loading,
    error,
    pagination,
    setPagination,
  }

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider')
  }
  return context
}

export default EmailContext 