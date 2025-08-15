import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CompanyDimension from './pages/CompanyDimension'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:dimension/:companyId" element={<CompanyDimension />} />
      </Routes>
    </Router>
  )
}

export default App
