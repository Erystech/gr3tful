import { useState } from 'react'
import './App.css'
import NavBar from './components/Navbar'
import LandingPage from './components/pages/LandingPage'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <>
      <NavBar />
      <div className="w-full">
        <LandingPage />
      </div>

      <Footer />
    </>
  )
}