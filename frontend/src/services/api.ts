import axios from 'axios'

// Use relative URL since we're using Vite's proxy
const API_URL = '/api'

export interface Email {
  id: number
  from_email: string
  to_email: string
  subject: string
  preview: string
  content: string
  date: string
  is_read: boolean
  is_starred: boolean
  is_spam: boolean
  deleted_at?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy: string
  sortOrder: string
  tab: string
}

export interface PaginatedResponse {
  emails: Email[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const api = {
  // Get all emails
  getEmails: async (params: PaginationParams) => {
    try {
      const response = await axios.get(`${API_URL}/emails`, { params })
      console.log('API raw response:', response)
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  // Get single email
  getEmail: async (id: number) => {
    const response = await axios.get(`${API_URL}/emails/${id}`)
    return response.data
  },

  // Toggle star status
  toggleStar: async (id: number) => {
    const response = await axios.patch(`${API_URL}/emails/${id}/star`)
    return response.data
  },

  // Toggle spam status
  toggleSpam: async (id: number) => {
    const response = await axios.patch(`${API_URL}/emails/${id}/spam`)
    return response.data
  },

  // Mark as read
  markAsRead: async (id: number) => {
    const response = await axios.patch(`${API_URL}/emails/${id}/read`)
    return response.data
  },

  // Delete email (move to recycle bin)
  deleteEmail: async (id: number) => {
    const response = await axios.delete(`${API_URL}/emails/${id}`)
    return response.data
  },

  // Restore email from recycle bin
  restoreEmail: async (id: number) => {
    const response = await axios.patch(`${API_URL}/emails/${id}/restore`)
    return response.data
  },

  // Permanently delete email
  permanentDeleteEmail: async (id: number) => {
    const response = await axios.delete(`${API_URL}/emails/${id}/permanent`)
    return response.data
  }
} 