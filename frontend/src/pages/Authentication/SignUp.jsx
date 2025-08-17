import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    department: '',
    year: '',
    agreeToTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts & Literature',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology'
  ]

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Post Graduate']

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
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    
    if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required'
    if (!formData.department) newErrors.department = 'Please select your department'
    if (!formData.year) newErrors.year = 'Please select your year'
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      console.log('Signup attempt:', formData)
      // Handle signup logic here
    }, 2000)
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
                    <span className='text-white/50'>📧</span>
                  </div>
                </div>
                {errors.email && <p className='text-red-300 text-sm mt-1'>{errors.email}</p>}
              </div>

              {/* Student ID and Department */}
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor="studentId" className='block text-white font-semibold mb-2'>
                    Student ID *
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.studentId ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter student ID"
                  />
                  {errors.studentId && <p className='text-red-300 text-sm mt-1'>{errors.studentId}</p>}
                </div>
                <div>
                  <label htmlFor="department" className='block text-white font-semibold mb-2'>
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.department ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                  >
                    <option value="" className='bg-gray-800'>Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className='bg-gray-800'>{dept}</option>
                    ))}
                  </select>
                  {errors.department && <p className='text-red-300 text-sm mt-1'>{errors.department}</p>}
                </div>
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className='block text-white font-semibold mb-2'>
                  Academic Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border ${errors.year ? 'border-red-400' : 'border-white/30'} rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300`}
                >
                  <option value="" className='bg-gray-800'>Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year} className='bg-gray-800'>{year}</option>
                  ))}
                </select>
                {errors.year && <p className='text-red-300 text-sm mt-1'>{errors.year}</p>}
              </div>

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
                  onClick={() => window.location.href = 'http://localhost:3000/auth/google'}
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