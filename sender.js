const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 25,
  secure: false,
  tls: { rejectUnauthorized: false }
});

transporter.sendMail({
  from: '"Test Sender" <sender@example.com>',
  to: "receiver@example.com",
  subject: "Test Email",
  text: "Hello, this is a test email!"
}, (err, info) => {
  if (err) return console.error("Send error:", err);
  console.log("Message sent:", info.response);
});
