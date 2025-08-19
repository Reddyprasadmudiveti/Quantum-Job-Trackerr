import React from 'react'
import { Routes, Route } from "react-router-dom"
import { AuthProvider, useAuth } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import FooterPage from './pages/FooterPage'
import Navbar from './pages/Navbar'
import Login from './pages/Authentication/Login'
import SignUp from './pages/Authentication/SignUp'
import AuthSuccess from './pages/Authentication/AuthSuccess'
import ForgotPassword from './pages/Authentication/ForgotPassword'
import ResetPassword from './pages/Authentication/ResetPassword'
import EmailVerification from './pages/Authentication/EmailVerification'
import UserProfileSettings from './pages/User/UserProfileSettings'
import Courses from './pages/Courses'
import PageNotFound from './pages/404_Page/PageNotFound'

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()
  
  return (
    <div className='min-h-screen w-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden'>

      {/* Main content with top padding to account for floating navbar */}
      <Navbar className="select-none" />
      <div className='pt-24'>
        <Routes className='select-none'>
          <Route path="/signin" element={isAuthenticated ? <HomePage /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <HomePage /> : <SignUp />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/courses" element={isAuthenticated ? <Courses /> : <Login />} />
          <Route path='/profile/settings' element={isAuthenticated ? <UserProfileSettings /> : <Login />} />
          <Route path='/' element={<HomePage />} />
          <Route path='/jobs' element={isAuthenticated ? <JobsPage /> : <Login />} />
          <Route path='/*' element={<PageNotFound />} />
        </Routes>
      </div>

      <FooterPage />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App


