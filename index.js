const { SMTPServer } = require("smtp-server");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./emails.db');
const { simpleParser } = require("mailparser");

const server = new SMTPServer({
    authOptional: true,

  onConnect(session, callback) {
    console.log("Connected:", session.id);
    callback();
  },
  onMailFrom(address, session, callback) {
    session.envelopeFrom = address.address;
    callback();
  },
  onRcptTo(address, session, callback) {
    session.envelopeTo = address.address;
    callback();
  },
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        const { subject, text } = parsed;
        const from = session.envelopeFrom;
        const to = session.envelopeTo;

        console.log("Email received:");
        console.log(`From: ${from}`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Text: ${text}`);

        db.run(
          `INSERT INTO emails (sender, receiver, subject, text) VALUES (?, ?, ?, ?)`,
          [from, to, subject || "(No Subject)", text || "(No Content)"],
          (err) => {
            if (err) console.error("DB Error:", err.message);
          }
        );

        callback();
      })
      .catch(err => {
        console.error("Parsing error:", err);
        callback(err);
      });
  }
});
const port_no = 25;
server.listen(port_no, () => console.log("SMTP server running on port ", port_no));
