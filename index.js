const { SMTPServer } = require("smtp-server");
const { simpleParser } = require("mailparser");
const db = require('./db');

// Initialize database connection
db.connect().then(() => {
  console.log("✅ Database connected successfully");
}).catch(err => {
  console.error("❌ Database connection error:", err);
  process.exit(1);
});

const server = new SMTPServer({
  authOptional: true, // Allow unauthenticated connections for testing
  secure: false, // Disable TLS for local testing
  logger: true,

  onConnect(session, callback) {
    console.log("📧 New connection from:", session.remoteAddress);
    callback();
  },

  onMailFrom(address, session, callback) {
    console.log("📨 From:", address.address);
    session.envelopeFrom = address.address;
    callback();
  },

  onRcptTo(address, session, callback) {
    console.log("📨 To:", address.address);
    session.envelopeTo = address.address;
    callback();
  },

  onData(stream, session, callback) {
    console.log("📝 Processing email data...");
    
    simpleParser(stream)
      .then(parsed => {
        const { subject, text } = parsed;
        const from = session.envelopeFrom;
        const to = session.envelopeTo;

        console.log("📧 Email received:");
        console.log(`From: ${from}`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);

        // Store in database
        db.run(
          `INSERT INTO emails (sender, receiver, subject, text, status) 
           VALUES (?, ?, ?, ?, 'unread')`,
          [from, to, subject || "(No Subject)", text || "(No Content)"]
        ).then(() => {
          console.log("✅ Email stored in database");
          callback();
        }).catch(err => {
          console.error("❌ Database error:", err);
          callback(err);
        });
      })
      .catch(err => {
        console.error("❌ Email parsing error:", err);
        callback(err);
      });
  }
});

const PORT = 2525;
server.listen(PORT, () => {
  console.log(`✅ SMTP server running on port ${PORT}`);
  console.log("Waiting for emails...");
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log("Shutting down SMTP server...");
  server.close(() => {
    console.log("SMTP server closed");
    db.close().then(() => {
      console.log("Database connection closed");
      process.exit(0);
    });
  });
});
