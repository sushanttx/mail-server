# 📧 Custom Node.js SMTP Server

This project is a lightweight, self-hosted SMTP server built using Node.js. It receives emails, parses them using `mailparser`, and stores the email metadata and content in a local SQLite database. It also includes utilities to test sending emails and to view stored messages via the terminal.

---

## 🛠️ Features

- ✅ Custom SMTP server using `smtp-server`
- ✅ Email parsing with `mailparser`
- ✅ Storage of emails in a local SQLite database
- ✅ Test mail sending using `nodemailer`
- ✅ CLI tool to view stored emails
- 🔒 Authentication optional (ideal for development and internal testing)
- 🌐 Ready to be deployed on an EC2 instance with optional domain routing

---

## 📂 Project Structure

```
mail-server/
├── db.js          # Initializes SQLite database and email table
├── index.js       # Main SMTP server logic
├── sender.js      # Test email sender using nodemailer
├── view.js        # CLI tool to view stored emails
├── emails.db      # SQLite database file (auto-created)
├── package.json
└── README.md
```

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mail-server.git
cd mail-server
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🧪 Usage

### Start the SMTP Server

```bash
node index.js
```

> The server listens on port `2525` by default.

### Send a Test Email

In another terminal:

```bash
node sender.js
```

This simulates sending an email to your local SMTP server from `sender@example.com` to `receiver@example.com`.

### View Stored Emails

```bash
node view.js
```

This command lists all emails stored in the SQLite database.

---

## 🗃️ Requirements

- Node.js v14+
- Port `2525` open (for receiving SMTP messages)
- SQLite3 (bundled with Node via `sqlite3` npm package)

---

## ☁️ Deployment Notes

To deploy this on an EC2 instance:

1. Open port `2525` in the instance's **Security Group**.
2. Install Node.js on the instance.
3. Clone this repository and run `npm install`.
4. Start the server using `node index.js`.

---
