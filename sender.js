const nodemailer = require("nodemailer");

console.log("📧 Starting email sender...");

const transporter = nodemailer.createTransport({
  host: "127.0.0.1",
  port: 2525,
  secure: false, // No TLS for local testing
  tls: {
    rejectUnauthorized: false
  }
});

// Test emails to send
const testEmails = [
  {
    from: 'sender1@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 1 - Welcome',
    text: 'This is the first test email. Welcome to our email system!'
  },
  {
    from: 'sender2@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 2 - Important Update',
    text: 'This is the second test email. Here is an important update about our system.'
  },
  {
    from: 'sender3@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 3 - Meeting Reminder',
    text: 'This is the third test email. Reminder: Team meeting tomorrow at 10 AM.'
  },
  {
    from: 'sender4@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 4 - Project Status',
    text: 'This is the fourth test email. Project status update: All tasks are on track.'
  },
  {
    from: 'sender5@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 5 - Newsletter',
    text: 'This is the fifth test email. Monthly newsletter: Check out our latest features!'
  },
  {
    from: 'sender6@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 6 - Support Ticket',
    text: 'This is the sixth test email. Your support ticket #123 has been resolved.'
  },
  {
    from: 'sender7@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 7 - Password Reset',
    text: 'This is the seventh test email. Your password reset request has been processed.'
  },
  {
    from: 'sender8@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 8 - Order Confirmation',
    text: 'This is the eighth test email. Your order #456 has been confirmed.'
  },
  {
    from: 'sender9@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 9 - Event Invitation',
    text: 'This is the ninth test email. You are invited to our annual tech conference.'
  },
  {
    from: 'sender10@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 10 - Survey',
    text: 'This is the tenth test email. Please take a moment to complete our customer satisfaction survey.'
  },
  {
    from: 'sender11@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 11 - Job Application',
    text: 'This is the eleventh test email. Your job application has been received.'
  },
  {
    from: 'sender12@example.com',
    to: 'receiver@example.com',
    subject: 'Test Email 12 - Subscription',
    text: 'This is the twelfth test email. Thank you for subscribing to our premium service.'
  }
];

// Function to send a single email
async function sendEmail(emailData) {
  try {
    const info = await transporter.sendMail(emailData);
    console.log(`Email sent successfully: ${emailData.subject}`);
    return info;
  } catch (error) {
    console.error(`Error sending email ${emailData.subject}:`, error);
    throw error;
  }
}

// Function to send all test emails
async function sendAllEmails() {
  console.log('Starting to send test emails...');
  
  for (const email of testEmails) {
    try {
      await sendEmail(email);
      // Add a small delay between emails to ensure proper ordering
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
  
  console.log('Finished sending all test emails');
}

// Send all emails
sendAllEmails().catch(console.error);
