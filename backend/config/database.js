const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'
const dbPath = isDevelopment 
  ? path.join(__dirname, '../db/test.db')
  : path.join(__dirname, '../db/prod.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message)
  } else {
    console.log(`Connected to the ${isDevelopment ? 'test' : 'production'} database.`)
    initializeDatabase()
  }
})

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_email TEXT NOT NULL,
      to_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      preview TEXT NOT NULL,
      content TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_starred BOOLEAN DEFAULT 0,
      is_spam BOOLEAN DEFAULT 0,
      is_read BOOLEAN DEFAULT 0
    )
  `)
}

module.exports = db 