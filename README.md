# Mail Server

A local SMTP server built using Node.js, `smtp-server`, `nodemailer`, and SQLite.

## Features
- Receives emails over SMTP
- Parses them and stores in SQLite
- Includes test sender script and viewer

## Run
1. `node db.js`
2. `node index.js`
3. `node sender.js` (to test)
4. `node view.js` (to view stored messages)
