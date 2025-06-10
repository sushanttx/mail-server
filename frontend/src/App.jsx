import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { EmailProvider } from './context/EmailContext'
import AppRoutes from './routes'

function App() {
  return (
    <ThemeProvider>
      <EmailProvider>
        <Router>
          <AppRoutes />
        </Router>
      </EmailProvider>
    </ThemeProvider>
  )
}

export default App 