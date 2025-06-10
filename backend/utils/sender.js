const nodemailer = require('nodemailer')
const db = require('../db')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Sample email templates
const emailTemplates = [
  {
    from_email: 'john.doe@example.com',
    to_email: 'me@example.com',
    subject: 'Meeting Tomorrow',
    preview: 'Hi, just confirming our meeting tomorrow at 10 AM...',
    content: `Hi there,

I'm writing to confirm our meeting tomorrow at 10 AM in the conference room. We'll be discussing the project timeline and deliverables.

Please bring your laptop and any relevant documents.

Best regards,
John`,
    is_starred: true,
    is_spam: false,
    is_read: false,
    date: new Date('2025-06-07 09:18:09'),
    deleted_at: null
  },
  {
    from_email: 'jane.smith@example.com',
    to_email: 'me@example.com',
    subject: 'Project Update',
    preview: 'Here are the latest updates on the project...',
    content: `Hello,

I wanted to share the latest updates on our project:

1. Phase 1 is complete
2. Phase 2 is on track
3. New team members have been onboarded

Let me know if you have any questions.

Cheers,
Jane`,
    is_starred: false,
    is_spam: false,
    is_read: true,
    date: new Date('2025-06-07 09:18:09'),
    deleted_at: null
  },
  {
    from_email: 'unknown@suspicious.com',
    to_email: 'me@example.com',
    subject: 'You Won a Prize!',
    preview: 'Congratulations! You have won a million dollars...',
    content: `CONGRATULATIONS!!!

You have been selected as the winner of our grand prize! To claim your million dollars, please send us your bank details and social security number.

This is a limited time offer!!!

Best regards,
Unknown Sender`,
    is_starred: false,
    is_spam: true,
    is_read: false,
    date: new Date('2025-06-07 09:18:09'),
    deleted_at: null
  }
]

async function sendEmail(to, subject, content) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: content
    }

    const info = await transporter.sendMail(mailOptions)
    return info
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

const sendTestEmails = async () => {
  // Create a base date for consistent timestamps
  const baseDate = new Date()
  
  const emails = [
    {
      from_email: 'john.doe@example.com',
      to_email: 'user@example.com',
      subject: 'Welcome to Inboxtor',
      content: 'Thank you for choosing Inboxtor as your email client!',
      preview: 'Thank you for choosing Inboxtor as your email client!',
      date: baseDate.toISOString(),
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'alice.smith@example.com',
      to_email: 'user@example.com',
      subject: 'Meeting Tomorrow',
      content: 'Hi, just a reminder about our meeting tomorrow at 10 AM.',
      preview: 'Hi, just a reminder about our meeting tomorrow at 10 AM.',
      date: new Date(baseDate.getTime() - 1000).toISOString(), // 1 second before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'bob.johnson@example.com',
      to_email: 'user@example.com',
      subject: 'Project Update',
      content: 'Here is the latest update on our project progress.',
      preview: 'Here is the latest update on our project progress.',
      date: new Date(baseDate.getTime() - 2000).toISOString(), // 2 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'sarah.wilson@example.com',
      to_email: 'user@example.com',
      subject: 'New Feature Announcement',
      content: 'We are excited to announce our new feature!',
      preview: 'We are excited to announce our new feature!',
      date: new Date(baseDate.getTime() - 3000).toISOString(), // 3 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'mike.brown@example.com',
      to_email: 'user@example.com',
      subject: 'Team Building Event',
      content: 'Join us for our annual team building event next week.',
      preview: 'Join us for our annual team building event next week.',
      date: new Date(baseDate.getTime() - 4000).toISOString(), // 4 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'emma.davis@example.com',
      to_email: 'user@example.com',
      subject: 'Client Meeting Notes',
      content: 'Here are the notes from our recent client meeting.',
      preview: 'Here are the notes from our recent client meeting.',
      date: new Date(baseDate.getTime() - 5000).toISOString(), // 5 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'david.miller@example.com',
      to_email: 'user@example.com',
      subject: 'System Maintenance',
      content: 'System maintenance scheduled for this weekend.',
      preview: 'System maintenance scheduled for this weekend.',
      date: new Date(baseDate.getTime() - 6000).toISOString(), // 6 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'lisa.taylor@example.com',
      to_email: 'user@example.com',
      subject: 'New Project Proposal',
      content: 'Please review the new project proposal attached.',
      preview: 'Please review the new project proposal attached.',
      date: new Date(baseDate.getTime() - 7000).toISOString(), // 7 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'james.wilson@example.com',
      to_email: 'user@example.com',
      subject: 'Holiday Schedule',
      content: 'Here is the holiday schedule for the upcoming months.',
      preview: 'Here is the holiday schedule for the upcoming months.',
      date: new Date(baseDate.getTime() - 8000).toISOString(), // 8 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    },
    {
      from_email: 'anna.clark@example.com',
      to_email: 'user@example.com',
      subject: 'Training Session',
      content: 'New training session scheduled for next week.',
      preview: 'New training session scheduled for next week.',
      date: new Date(baseDate.getTime() - 9000).toISOString(), // 9 seconds before
      is_read: 0,
      is_starred: 0,
      is_spam: 0,
      deleted_at: null
    }
  ]

  console.log('\n=== Starting Test Email Generation ===')
  console.log(`Preparing to insert ${emails.length} test emails...`)
  console.log('Database path:', require('path').join(__dirname, '../db/test.db'))

  return new Promise((resolve, reject) => {
    // First, let's check if the table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='emails'", (err, table) => {
      if (err) {
        console.error('Error checking table:', err)
        reject(err)
        return
      }

      if (!table) {
        console.error('Emails table does not exist!')
        reject(new Error('Emails table does not exist'))
        return
      }

      console.log('Emails table exists, proceeding with insertion...')

      const stmt = db.prepare(
        'INSERT INTO emails (from_email, to_email, subject, content, preview, date, is_read, is_starred, is_spam, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )

      let insertedCount = 0
      emails.forEach(email => {
        stmt.run(
          [
            email.from_email,
            email.to_email,
            email.subject,
            email.content,
            email.preview,
            email.date,
            email.is_read,
            email.is_starred,
            email.is_spam,
            email.deleted_at
          ],
          function(err) {
            if (err) {
              console.error('Error inserting email:', err)
              reject(err)
              return
            }
            insertedCount++
            console.log(`Inserted email ${insertedCount}/${emails.length}: ${email.subject}`)
            
            if (insertedCount === emails.length) {
              stmt.finalize()
              console.log('\n=== Test Email Generation Complete ===')
              console.log(`Successfully inserted ${insertedCount} test emails`)
              resolve(insertedCount)
            }
          }
        )
      })
    })
  })
}

module.exports = { sendTestEmails } 