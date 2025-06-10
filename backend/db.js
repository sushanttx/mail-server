const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

// Ensure db directory exists
const dbDir = path.join(__dirname, 'db')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Connect to the database
const dbPath = path.join(dbDir, 'test.db')
console.log('Connecting to database at:', dbPath)

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log('Connected to the database successfully')
    initDb()
  }
})

// Initialize database
function initDb() {
  console.log('Initializing database...')
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_email TEXT NOT NULL,
      to_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT NOT NULL,
      preview TEXT NOT NULL,
      date DATETIME NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      is_starred BOOLEAN DEFAULT 0,
      is_spam BOOLEAN DEFAULT 0,
      deleted_at DATETIME DEFAULT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err)
    } else {
      console.log('Database initialized successfully')
      // Verify table creation
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='emails'", (err, table) => {
        if (err) {
          console.error('Error verifying table:', err)
        } else if (table) {
          console.log('Emails table verified')
        } else {
          console.error('Emails table not found after creation!')
        }
      })
    }
  })
}

module.exports = db 