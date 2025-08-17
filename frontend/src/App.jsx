import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import FooterPage from './pages/FooterPage'
import Navbar from './pages/Navbar'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import AuthSuccess from './pages/Authentication/AuthSuccess'
import Courses from './pages/Courses'
import PageNotFound from './pages/404_Page/PageNotFound'

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const auth = localStorage.getItem("authToken")

    if (auth) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  }, [])
  return (
    <AuthProvider>
      <div className='min-h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden'>

        {/* Main content with top padding to account for floating navbar */}
        <Navbar/>
        <div className='pt-24'>
          <Routes>
            <Route path="/signin" element={authenticated ? <HomePage /> : <Login />} />
            <Route path="/signup" element={authenticated ? <HomePage /> : <SignUp />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/courses" element={authenticated ? <Courses /> : <Login />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/jobs' element={authenticated ? <JobsPage /> : <Login />} />
            <Route path='/*' element={<PageNotFound />} />
          </Routes>
        </div>

        <FooterPage />
      </div>
    </AuthProvider>
  )
}

export default App


