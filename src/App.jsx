import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import Footer from './components/layout/Footer'
import DailyEntryPage from './components/pages/DailyEntryPage'
import JournalPage from './components/pages/JournalPage'


export default function App() {
  return (
    <>
    
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/entry' element={<DailyEntryPage />} /> 
      <Route path='/journal' element={<JournalPage />} />
    </Routes>
    <Footer />
    </>
  )
}