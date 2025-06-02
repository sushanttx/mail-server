const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./emails.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT,
      receiver TEXT,
      subject TEXT,
      text TEXT,
      date TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
