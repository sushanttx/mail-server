const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Get all emails with pagination
app.get('/api/emails', async (req, res) => {
  try {
    console.log('Received request for emails with params:', req.query);
    const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', tab = 'all' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM emails';
    let countQuery = 'SELECT COUNT(*) as total FROM emails';
    let whereClause = '';

    // Apply filters based on tab
    switch (tab) {
      case 'all':
        whereClause = 'WHERE is_deleted = 0';
        break;
      case 'inbox':
        whereClause = 'WHERE is_deleted = 0 AND status != "spam"';
        break;
      case 'spam':
        whereClause = 'WHERE is_deleted = 0 AND status = "spam"';
        break;
      case 'bin':
        whereClause = 'WHERE is_deleted = 1';
        break;
      default:
        whereClause = 'WHERE is_deleted = 0';
    }

    console.log('Executing count query:', `${countQuery} ${whereClause}`);
    
    // Get total count
    const countResult = await db.query(`${countQuery} ${whereClause}`);
    const total = countResult[0].total;

    console.log('Total emails:', total);

    // Get emails with pagination and sorting
    const emailsQuery = `${query} ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`;
    console.log('Executing emails query:', emailsQuery, [parseInt(limit), offset]);
    
    const emails = await db.query(emailsQuery, [parseInt(limit), offset]);

    console.log('Fetched emails:', emails.length);

    res.json({
      emails: emails.map(email => ({
        id: email.id,
        from_email: email.sender,
        to_email: email.receiver,
        subject: email.subject,
        preview: email.text?.substring(0, 100) || '',
        content: email.text,
        date: email.date,
        is_read: email.status === 'read',
        is_starred: email.status === 'starred',
        is_spam: email.status === 'spam',
        deleted_at: email.is_deleted ? email.updated_at : null
      })),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch emails',
      details: error.message,
      stack: error.stack
    });
  }
});

// Get single email
app.get('/api/emails/:id', async (req, res) => {
  try {
    const email = await db.query('SELECT * FROM emails WHERE id = ?', [req.params.id]);
    if (!email[0]) {
      return res.status(404).json({ error: 'Email not found' });
    }
    res.json({
      id: email[0].id,
      from_email: email[0].sender,
      to_email: email[0].receiver,
      subject: email[0].subject,
      content: email[0].text,
      date: email[0].date,
      is_read: email[0].status === 'read',
      is_starred: email[0].status === 'starred',
      is_spam: email[0].status === 'spam',
      deleted_at: email[0].is_deleted ? email[0].updated_at : null
    });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ 
      error: 'Failed to fetch email',
      details: error.message 
    });
  }
});

// Mark email as read
app.patch('/api/emails/:id/read', async (req, res) => {
  try {
    await db.run('UPDATE emails SET status = "read", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error marking email as read:', error);
    res.status(500).json({ 
      error: 'Failed to mark email as read',
      details: error.message 
    });
  }
});

// Toggle star status
app.patch('/api/emails/:id/star', async (req, res) => {
  try {
    const email = await db.query('SELECT status FROM emails WHERE id = ?', [req.params.id]);
    const newStatus = email[0].status === 'starred' ? 'read' : 'starred';
    await db.run('UPDATE emails SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({ 
      error: 'Failed to toggle star',
      details: error.message 
    });
  }
});

// Toggle spam status
app.patch('/api/emails/:id/spam', async (req, res) => {
  try {
    const email = await db.query('SELECT status FROM emails WHERE id = ?', [req.params.id]);
    const newStatus = email[0].status === 'spam' ? 'read' : 'spam';
    await db.run('UPDATE emails SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling spam:', error);
    res.status(500).json({ 
      error: 'Failed to toggle spam',
      details: error.message 
    });
  }
});

// Delete email (move to bin)
app.delete('/api/emails/:id', async (req, res) => {
  try {
    await db.run('UPDATE emails SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ 
      error: 'Failed to delete email',
      details: error.message 
    });
  }
});

// Restore email from bin
app.patch('/api/emails/:id/restore', async (req, res) => {
  try {
    await db.run('UPDATE emails SET is_deleted = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error restoring email:', error);
    res.status(500).json({ 
      error: 'Failed to restore email',
      details: error.message 
    });
  }
});

// Permanently delete email
app.delete('/api/emails/:id/permanent', async (req, res) => {
  try {
    await db.run('DELETE FROM emails WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error permanently deleting email:', error);
    res.status(500).json({ 
      error: 'Failed to permanently delete email',
      details: error.message 
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
}); 