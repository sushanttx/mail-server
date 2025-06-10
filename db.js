const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'emails.db');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      console.log('Connecting to database at:', this.dbPath);
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err);
          reject(err);
          return;
        }
        console.log('Connected to database successfully');
        this.initializeTables()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  async initializeTables() {
    return new Promise((resolve, reject) => {
      console.log('Initializing database tables...');
      this.db.run(`
        CREATE TABLE IF NOT EXISTS emails (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sender TEXT NOT NULL,
          receiver TEXT NOT NULL,
          subject TEXT,
          text TEXT,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'unread',
          is_deleted INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
          return;
        }
        console.log('Database tables initialized successfully');
        resolve();
      });
    });
  }

  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      console.log('Executing query:', sql, 'with params:', params);
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Error executing query:', err);
          reject(err);
          return;
        }
        console.log('Query executed successfully, rows returned:', rows?.length || 0);
        resolve(rows);
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      console.log('Executing run:', sql, 'with params:', params);
      this.db.run(sql, params, function(err) {
        if (err) {
          console.error('Error executing run:', err);
          reject(err);
          return;
        }
        console.log('Run executed successfully, lastID:', this.lastID, 'changes:', this.changes);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

const db = new Database();
db.connect().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

module.exports = db;
