# Email Server System

A complete email server system with SMTP server, API, and modern frontend interface. This system allows you to receive, store, and view emails through a user-friendly interface.

## Features

- **SMTP Server**
  - Receives emails on port 2525
  - Stores emails in SQLite database
  - Supports multiple email formats
  - Real-time email processing

- **API Server**
  - RESTful API endpoints
  - Pagination support
  - Email filtering and sorting
  - Status management (read/unread, starred, spam)

- **Frontend Interface**
  - Modern React-based UI
  - Email list with pagination
  - Detailed email view
  - Responsive design
  - Real-time updates

- **Database**
  - SQLite database for email storage
  - Efficient querying and indexing
  - Automatic table management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mail-server
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
cd ..
```

## Running the Application

The application consists of three main components that need to be running simultaneously:

1. Start the SMTP server:
```bash
npm run start:smtp
```

2. Start the API server:
```bash
npm run start:api
```

3. Start the frontend:
```bash
npm run start:frontend
```

## Testing the System

To test the system, you can use the included test email sender:

```bash
node sender.js
```

This will send multiple test emails to the system, which you can then view in the frontend interface.

## Project Structure

```
mail-server/
├── api.js              # API server implementation
├── db.js              # Database connection and queries
├── index.js           # SMTP server implementation
├── sender.js          # Test email sender
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── context/     # React context
│   └── package.json
└── package.json
```

## API Endpoints

- `GET /api/emails` - Get all emails with pagination
- `GET /api/emails/:id` - Get single email details
- `PATCH /api/emails/:id/read` - Mark email as read
- `PATCH /api/emails/:id/star` - Toggle star status
- `PATCH /api/emails/:id/spam` - Toggle spam status
- `DELETE /api/emails/:id` - Move email to bin
- `PATCH /api/emails/:id/restore` - Restore email from bin
- `DELETE /api/emails/:id/permanent` - Permanently delete email

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
