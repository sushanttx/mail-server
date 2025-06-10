const express = require('express')
const router = express.Router()
const Email = require('../models/email')

// Get all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.getAll()
    res.json(emails)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get email by ID
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.getById(req.params.id)
    if (!email) {
      return res.status(404).json({ error: 'Email not found' })
    }
    res.json(email)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create new email
router.post('/', async (req, res) => {
  try {
    const emailId = await Email.create(req.body)
    res.status(201).json({ id: emailId })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Toggle star status
router.patch('/:id/star', async (req, res) => {
  try {
    await Email.toggleStar(req.params.id)
    res.json({ message: 'Star status toggled' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Toggle spam status
router.patch('/:id/spam', async (req, res) => {
  try {
    await Email.toggleSpam(req.params.id)
    res.json({ message: 'Spam status toggled' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    await Email.markAsRead(req.params.id)
    res.json({ message: 'Email marked as read' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete email
router.delete('/:id', async (req, res) => {
  try {
    await Email.delete(req.params.id)
    res.json({ message: 'Email deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router 