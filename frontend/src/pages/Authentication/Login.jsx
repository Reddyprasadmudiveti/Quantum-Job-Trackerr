import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, googleLogin } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin", 
        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // This is important for cookies
        }
      )

      // Axios automatically throws errors for non-2xx responses
      // so if we get here, it means the request was successful
      const data = response.data
      console.log('Login successful:', data)
      
      // Use the login function from AuthContext
      login(data.user, data.token || response.headers['authorization'])
      
      // Redirect to jobs page
      navigate('/jobs')
      
    } catch (error) {
      console.error('Login error:', error)

      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password. Please try again.');
            break;
          case 404:
            setError('Authentication service not found. Please contact support.');
            break;
          case 500:
            setError('Server error. Please try again later.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else if (error.request) {
        // Network error
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Other error
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className=' z-10 scale-80 flex items-center justify-center min-h-[80vh] px-6'>
        <div className='w-full max-w-md'>
          {/* Login Card */}
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl text-white'>🎓</span>
              </div>
              <h1 className='text-4xl font-bold text-white mb-2 drop-shadow-lg'>Welcome Back</h1>
              <p className='text-white/80'>Sign in to your account to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl'>
                <p className='text-red-200 text-sm text-center'>{error}</p>
              </div>
            )}
            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className='block text-white font-semibold mb-2'>
                  Email Address
                </label>
                <div className='relative'>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                    placeholder="Enter your email"
                  />
                  <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                    <span className='text-white/50'>📧</span>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className='block text-white font-semibold mb-2'>
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors'
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className='w-4 h-4 rounded border-white/30 bg-white/20 text-purple-600 focus:ring-purple-500'
                  />
                  <label htmlFor="rememberMe" className='ml-2 text-sm text-white/80'>
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className='text-sm text-purple-300 hover:text-purple-200 transition-colors'>
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-white/20'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-transparent text-white/70'>Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type="button"
                  onClick={googleLogin}
                  className='flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300'
                >
                  <span className='mr-2'>🔍</span>
                  Google
                </button>
                <button
                  type="button"
                  className='flex items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-white hover:bg-white/20 transition-all duration-300'
                >
                  <span className='mr-2'>📘</span>
                  Facebook
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className='mt-8 text-center'>
              <p className='text-white/80'>
                Don't have an account?{' '}
                <Link to="/signup" className='text-purple-300 hover:text-purple-200 font-semibold transition-colors'>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className='mt-8 text-center'>
            <p className='text-white/60 text-sm'>
              By signing in, you agree to our{' '}
              <Link to="/terms" className='text-purple-300 hover:text-purple-200 transition-colors'>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className='text-purple-300 hover:text-purple-200 transition-colors'>
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className='absolute top-32 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500'>
        <div className='w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
      <div className='absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500'>
        <div className='w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
    </div>
  )
}

export default Login