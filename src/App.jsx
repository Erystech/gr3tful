import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import DailyEntryPage from './components/pages/DailyEntryPage'
import JournalPage from './components/pages/JournalPage'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './components/context/AuthContext'

export default function App() {
  return (
    <>
    
    <AuthProvider>
          <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />

          <Route path='/entry' element={
            <ProtectedRoute>
              <DailyEntryPage />
            </ProtectedRoute>} /> 
          <Route path='/journal' element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          } />
        </Routes>
    </AuthProvider>
    
    </>
  )
}