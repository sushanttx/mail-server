import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import EmailList from './components/EmailList'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<EmailList />} />
        <Route path="/inbox" element={<EmailList />} />
        <Route path="/spam" element={<EmailList />} />
        <Route path="/starred" element={<EmailList />} />
        <Route path="/trash" element={<EmailList />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes 