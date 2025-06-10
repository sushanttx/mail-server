const db = require('../config/database')

class Email {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM emails ORDER BY date DESC', [], (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM emails WHERE id = ?', [id], (err, row) => {
        if (err) reject(err)
        resolve(row)
      })
    })
  }

  static create(email) {
    return new Promise((resolve, reject) => {
      const { from_email, to_email, subject, preview, content } = email
      db.run(
        'INSERT INTO emails (from_email, to_email, subject, preview, content) VALUES (?, ?, ?, ?, ?)',
        [from_email, to_email, subject, preview, content],
        function(err) {
          if (err) reject(err)
          resolve(this.lastID)
        }
      )
    })
  }

  static toggleStar(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE emails SET is_starred = NOT is_starred WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  static toggleSpam(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE emails SET is_spam = NOT is_spam WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  static markAsRead(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE emails SET is_read = 1 WHERE id = ?',
        [id],
        (err) => {
          if (err) reject(err)
          resolve()
        }
      )
    })
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM emails WHERE id = ?', [id], (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}

module.exports = Email 