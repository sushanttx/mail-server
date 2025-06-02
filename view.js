const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./emails.db');

db.all('SELECT * FROM emails', (err, rows) => {
  if (err) {
    console.error('Error fetching emails:', err.message);
    return;
  }

  console.log('--- Stored Emails ---');
  rows.forEach((row) => {
    console.log(`ID: ${row.id}`);
    console.log(`From: ${row.sender}`);
    console.log(`To: ${row.receiver}`);
    console.log(`Subject: ${row.subject}`);
    console.log(`Text: ${row.text}`);
    console.log(`Date: ${row.date}`);
    console.log('---------------------');
  });
});
