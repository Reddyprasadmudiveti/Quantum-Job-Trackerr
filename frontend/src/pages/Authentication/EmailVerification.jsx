import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const EmailVerification = () => {
  const navigate = useNavigate()
  const [verificationToken, setVerificationToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    // Get the email from localStorage that was stored during signup
    const pendingEmail = localStorage.getItem('pendingVerificationEmail')
    if (!pendingEmail) {
      setError('No pending verification found. Please sign up first.')
    } else {
      setEmail(pendingEmail)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!verificationToken.trim()) {
      setError('Please enter the verification code')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/verification',
        { token: verificationToken },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      )

      setIsLoading(false)
      setSuccess(true)
      
      // Clear the pending verification email
      localStorage.removeItem('pendingVerificationEmail')
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/signin')
      }, 3000)
    } catch (error) {
      setIsLoading(false)
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed. Please try again.'
      setError(errorMessage)
    }
  }

  const handleResendCode = async () => {
    // This would require a backend endpoint to resend the verification code
    // For now, we'll just show a message
    alert('This feature is not implemented yet. Please check your email for the verification code or sign up again.')
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✉️</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Verify Your Email</h1>
            <p className="text-white/80">
              {success 
                ? 'Your email has been verified successfully!' 
                : `We've sent a verification code to ${email || 'your email'}. Please enter it below.`}
            </p>
          </div>

          {/* Success Message */}
          {success ? (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-white/80 mb-4">Your account has been successfully verified.</p>
              <p className="text-white/60">Redirecting to login page...</p>
            </div>
          ) : (
            /* Verification Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-white">
                  <p>{error}</p>
                </div>
              )}

              {/* Verification Code Field */}
              <div>
                <label htmlFor="verificationToken" className="block text-white font-semibold mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="verificationToken"
                  value={verificationToken}
                  onChange={(e) => setVerificationToken(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter verification code"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-2xl text-white font-semibold shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-purple-300 hover:text-purple-200 transition-colors text-sm"
                >
                  Didn't receive a code? Resend
                </button>
              </div>

              {/* Back to Login */}
              <div className="text-center pt-4 border-t border-white/10">
                <Link 
                  to="/signin" 
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-32 left-10 transform rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"></div>
      </div>
      <div className="absolute bottom-32 right-10 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl"></div>
      </div>
    </div>
  )
}

export default EmailVerification