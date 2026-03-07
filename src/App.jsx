import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/Navbar'
import LandingPage from './components/pages/LandingPage'
import Footer from './components/layout/Footer'
import DailyEntryPage from './components/pages/DailyEntryPage'

export default function App() {
  return (
    <>
    
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/entry' element={<DailyEntryPage />} />
    </Routes>
    <Footer />
    </>
  )
}