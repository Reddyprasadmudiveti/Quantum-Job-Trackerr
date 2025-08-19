import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'

const SignUp = () => {
  const navigate = useNavigate()
  const { googleLogin } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailTimeout, setEmailTimeout] = useState(null)

  // Simplified component - removed departments and years arrays

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    
    // Check email availability with debounce
    if (name === 'email' && value.trim() !== '') {
      // Clear any existing timeout
      if (emailTimeout) {
        clearTimeout(emailTimeout)
      }
      
      // Set a new timeout to check email after user stops typing
      const newTimeout = setTimeout(() => {
        validateEmail(value)
      }, 800) // Wait 800ms after user stops typing
      
      setEmailTimeout(newTimeout)
    }
  }
  
  const validateEmail = async (email) => {
    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Email is invalid'
      }))
      return
    }
    
    setIsCheckingEmail(true)
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/check-email',
        { email },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (!response.data.available) {
        setErrors(prev => ({
          ...prev,
          email: response.data.message
        }))
      } else {
        setErrors(prev => ({
          ...prev,
          email: ''
        }))
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error checking email'
      setErrors(prev => ({
        ...prev,
        email: errorMessage
      }))
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setFormError('')

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/signup',
        {
          userName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      setIsLoading(false)
      
      // Store email for verification page
      localStorage.setItem('pendingVerificationEmail', formData.email)
      
      // Redirect to verification page
      navigate('/verify-email')
    } catch (error) {
      setIsLoading(false)
      
      // Extract error message from axios error response
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during signup. Please try again.'
      
      setErrors(prev => ({
        ...prev,
        form: errorMessage
      }))
    }
  }

  return (
   <div>

      {/* Signup Form Container */}
      <div className='relative scale-80 z-10 flex items-center justify-center min-h-[60vh] px-6 py-8'>
        <div className='w-full max-w-2xl'>
          {/* Signup Card */}
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300'>
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl text-white'>🎓</span>
              </div>
              <h1 className='text-4xl font-bold text-white mb-2 drop-shadow-lg'>Join Dravidian University</h1>
              <p className='text-white/80'>Create your account to access job opportunities and resources</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Form Error Message */}
              {errors.form && (
                <div className='p-4 mb-4 text-sm text-red-300 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30'>
                  {errors.form}
                </div>
              )}
              {/* Name Fields */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor="firstName" className='block text-white font-semibold mb-2'>
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.firstName ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className='text-red-300 text-sm mt-1'>{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className='block text-white font-semibold mb-2'>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.lastName ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className='text-red-300 text-sm mt-1'>{errors.lastName}</p>}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className='block text-white font-semibold mb-2'>
                  Email Address *
                </label>
                <div className='relative'>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.email ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter your email"
                  />
                  <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                    {isCheckingEmail ? (
                      <svg className="animate-spin h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : errors.email ? (
                      <span className='text-red-400'>❌</span>
                    ) : formData.email && !errors.email ? (
                      <span className='text-green-400'>✓</span>
                    ) : (
                      <span className='text-white/50'>📧</span>
                    )}
                  </div>
                </div>
                {errors.email && <p className='text-red-300 text-sm mt-1'>{errors.email}</p>}
              </div>

              {/* No additional fields needed for backend */}

              {/* Password Fields */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor="password" className='block text-white font-semibold mb-2'>
                    Password *
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.password ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                      placeholder="Create password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors'
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && <p className='text-red-300 text-sm mt-1'>{errors.password}</p>}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className='block text-white font-semibold mb-2'>
                    Confirm Password *
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.confirmPassword ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white transition-colors'
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className='text-red-300 text-sm mt-1'>{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms Agreement */}
              <div>
                <label className='flex items-start'>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className={`w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2 mt-1 ${errors.agreeToTerms ? 'border-red-400' : ''}`}
                  />
                  <span className='ml-3 text-white/80'>
                    I agree to the{' '}
                    <Link to="/terms" className='text-purple-300 hover:text-purple-200 transition-colors'>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className='text-purple-300 hover:text-purple-200 transition-colors'>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && <p className='text-red-300 text-sm mt-1'>{errors.agreeToTerms}</p>}
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-white/20'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-transparent text-white/70'>Or sign up with</span>
                </div>
              </div>

              {/* Social Signup Buttons */}
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

            {/* Login Link */}
            <div className='mt-8 text-center'>
              <p className='text-white/80'>
                Already have an account?{' '}
                <Link to="/signin" className='text-purple-300 hover:text-purple-200 font-semibold transition-colors'>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className='absolute top-32 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500'>
        <div className='w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
      <div className='absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500'>
        <div className='w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl'></div>
      </div>
    </div>
  )
}

export default SignUp