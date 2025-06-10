# Inboxtor Frontend

A modern, Gmail-like email client interface built with React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Clean, minimalist design
- 🌓 Dark/Light mode support
- 📱 Responsive layout
- 🔄 Collapsible sidebar
- 📧 Email list with preview
- ⭐ Star/unstar emails

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev:frontend
   ```

3. Build for production:
   ```bash
   npm run build:frontend
   ```

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Heroicons

## Project Structure

```
frontend/
├── public/
│   └── mail.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── EmailList.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
``` 