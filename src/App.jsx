import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/pages/LandingPage'
import DailyEntryPage from './components/pages/DailyEntryPage'
import JournalPage from './components/pages/JournalPage'
import LoginPage from './components/pages/LoginPage'
import SignupPage from './components/pages/SignupPage'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'
import ResetPasswordPage from './components/pages/ResetPasswordPage'
import PrivacyPage from './components/pages/PrivacyPage'
import TermsPage from './components/pages/TermsPage'
import ContactPage from './components/pages/ContactPage'
import NotFoundPage from './components/pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './components/context/AuthContext'
import { ThemeProvider } from './components/context/ThemeContext'

export default function App() {
  return (
    <>
    
    <ThemeProvider>
      <AuthProvider>
          <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/privacy' element={<PrivacyPage />} />
          <Route path='/terms' element={<TermsPage />} />
          <Route path='/contact' element={<ContactPage />} />

          <Route path='/entry' element={
            <ProtectedRoute>
              <DailyEntryPage />
            </ProtectedRoute>} /> 
          <Route path='/journal' element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          } />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
    
    </>
  )
}
