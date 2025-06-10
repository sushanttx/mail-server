require('dotenv').config()
const express = require('express')
const cors = require('cors')
const emailRoutes = require('./routes/emails')

const app = express()
const port = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Routes
app.use('/api/emails', emailRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  })
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: err.message })
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}) 