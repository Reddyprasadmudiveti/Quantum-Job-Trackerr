import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AuthSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        const token = searchParams.get('token')
        const userParam = searchParams.get('user')

        if (!token || !userParam) {
          toast.error('Authentication failed: Missing credentials')
          navigate('/signin')
          return
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userParam))

        // Store authentication data
        login(userData, token)

        toast.success(`Welcome back, ${userData.firstName}!`)

        // Redirect to the intended page or dashboard
        const redirectTo = localStorage.getItem('redirectAfterLogin') || '/jobs'
        localStorage.removeItem('redirectAfterLogin')

        navigate(redirectTo)
      } catch (error) {
        console.error('Auth success handling error:', error)
        toast.error('Authentication failed: Invalid response')
        navigate('/signin')
      }
    }

    handleAuthSuccess()
  }, [searchParams, login, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold mb-2">Completing Sign In...</h2>
        <p className="text-white/70">Please wait while we set up your account.</p>
      </div>
    </div>
  )
}

export default AuthSuccess