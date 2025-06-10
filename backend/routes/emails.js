const express = require('express')
const router = express.Router()
const db = require('../db')
const { sendTestEmails } = require('../utils/sender')

// Get all emails with pagination and sorting
router.get('/', (req, res) => {
  console.log('\n=== Email Fetch Request ===')
  console.log('Request params:', req.query)
  console.log('Request headers:', req.headers)
  
  const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', tab = 'all' } = req.query
  const offset = (page - 1) * limit

  // Validate parameters
  if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    console.error('Invalid pagination parameters:', { page, limit })
    return res.status(400).json({ error: 'Invalid pagination parameters' })
  }

  if (!['date', 'subject', 'from_email'].includes(sortBy)) {
    console.error('Invalid sort field:', sortBy)
    return res.status(400).json({ error: 'Invalid sort field' })
  }

  if (!['asc', 'desc'].includes(sortOrder.toLowerCase())) {
    console.error('Invalid sort order:', sortOrder)
    return res.status(400).json({ error: 'Invalid sort order' })
  }

  if (!['all', 'inbox', 'spam', 'bin'].includes(tab)) {
    console.error('Invalid tab:', tab)
    return res.status(400).json({ error: 'Invalid tab' })
  }

  let query = 'SELECT * FROM emails'
  let countQuery = 'SELECT COUNT(*) as total FROM emails'

  // First filter by deleted status
  if (tab === 'bin') {
    query += ' WHERE deleted_at IS NOT NULL'
    countQuery += ' WHERE deleted_at IS NOT NULL'
  } else {
    query += ' WHERE deleted_at IS NULL'
    countQuery += ' WHERE deleted_at IS NULL'

    // Then filter by spam status for non-deleted emails
    if (tab === 'spam') {
      query += ' AND is_spam = 1'
      countQuery += ' AND is_spam = 1'
    } else if (tab === 'inbox') {
      query += ' AND is_spam = 0'
      countQuery += ' AND is_spam = 0'
    }
    // 'all' tab shows all non-deleted emails regardless of spam status
  }

  query += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`

  console.log('Executing count query:', countQuery)
  // Get total count
  db.get(countQuery, [], (err, result) => {
    if (err) {
      console.error('Error getting total count:', err)
      return res.status(500).json({ error: 'Failed to get total count', details: err.message })
    }

    const total = result.total
    console.log('Total emails found:', total)

    console.log('Executing main query:', query, 'with params:', [limit, offset])
    // Get paginated data
    db.all(query, [limit, offset], (err, rows) => {
      if (err) {
        console.error('Error fetching emails:', err)
        return res.status(500).json({ error: 'Failed to fetch emails', details: err.message })
      }

      console.log('Successfully fetched emails:', rows.length)
      console.log('First email:', rows[0])
      console.log('=== End Email Fetch Request ===\n')
      
      res.json({
        emails: rows,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      })
    })
  })
})

// Get single email
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM emails WHERE id = ? AND deleted_at IS NULL', [req.params.id], (err, email) => {
    if (err) {
      console.error('Error fetching email:', err)
      return res.status(500).json({ error: 'Failed to fetch email' })
    }
    if (!email) {
      return res.status(404).json({ error: 'Email not found' })
    }
    res.json(email)
  })
})

// Toggle star status
router.patch('/:id/star', (req, res) => {
  db.run(
    'UPDATE emails SET is_starred = NOT is_starred WHERE id = ? AND deleted_at IS NULL',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Error toggling star:', err)
        return res.status(500).json({ error: 'Failed to toggle star' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Email not found' })
      }
      res.json({ message: 'Star status toggled' })
    }
  )
})

// Toggle spam status
router.patch('/:id/spam', (req, res) => {
  db.run(
    'UPDATE emails SET is_spam = NOT is_spam WHERE id = ? AND deleted_at IS NULL',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Error toggling spam:', err)
        return res.status(500).json({ error: 'Failed to toggle spam' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Email not found' })
      }
      res.json({ message: 'Spam status toggled' })
    }
  )
})

// Mark as read
router.patch('/:id/read', (req, res) => {
  db.run(
    'UPDATE emails SET is_read = 1 WHERE id = ? AND deleted_at IS NULL',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Error marking as read:', err)
        return res.status(500).json({ error: 'Failed to mark as read' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Email not found' })
      }
      res.json({ message: 'Email marked as read' })
    }
  )
})

// Soft delete email (move to recycle bin)
router.delete('/:id', (req, res) => {
  db.run(
    'UPDATE emails SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Error deleting email:', err)
        return res.status(500).json({ error: 'Failed to delete email' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Email not found' })
      }
      res.json({ message: 'Email moved to recycle bin' })
    }
  )
})

// Restore email from recycle bin
router.patch('/:id/restore', (req, res) => {
  db.run(
    'UPDATE emails SET deleted_at = NULL WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        console.error('Error restoring email:', err)
        return res.status(500).json({ error: 'Failed to restore email' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Email not found' })
      }
      res.json({ message: 'Email restored' })
    }
  )
})

// Permanently delete email
router.delete('/:id/permanent', (req, res) => {
  db.run('DELETE FROM emails WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      console.error('Error permanently deleting email:', err)
      return res.status(500).json({ error: 'Failed to permanently delete email' })
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Email not found' })
    }
    res.json({ message: 'Email permanently deleted' })
  })
})

// Cleanup old deleted emails (run this periodically)
router.post('/cleanup', (req, res) => {
  db.run(
    'DELETE FROM emails WHERE deleted_at IS NOT NULL AND deleted_at < datetime("now", "-5 days")',
    function(err) {
      if (err) {
        console.error('Error cleaning up emails:', err)
        return res.status(500).json({ error: 'Failed to clean up emails' })
      }
      res.json({ message: `Cleaned up ${this.changes} old deleted emails` })
    }
  )
})

// Send test emails
router.post('/send-test', async (req, res) => {
  console.log('\n=== Test Email Request Received ===')
  try {
    const count = await sendTestEmails()
    console.log(`\nAPI Response: Successfully sent ${count} test emails`)
    res.json({ message: 'Test emails sent successfully', count })
  } catch (error) {
    console.error('\nError sending test emails:', error)
    res.status(500).json({ error: 'Failed to send test emails' })
  }
})

module.exports = router 