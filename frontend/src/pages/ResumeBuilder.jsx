import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import ResumeBuilderForm from '../components/resume/ResumeBuilderForm'
import LoadingAnimation from '../components/resume/LoadingAnimation'
import useResumeProgress from '../hooks/useResumeProgress'

const ResumeBuilder = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const {
    isProcessing,
    currentStep,
    progress,
    error,
    success,
    processingMessage,
    startProgress,
    updateProgress,
    setProgressError,
    resetProgress,
    PROGRESS_STEPS
  } = useResumeProgress()

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin')
    }
  }, [isAuthenticated, navigate])

  const handleResumeSubmit = async (resumeData) => {
    startProgress()

    try {
      // Prepare the data for submission
      const submissionData = {
        ...resumeData,
        userId: user?.id
      }

      // Step 1: Validation
      updateProgress(PROGRESS_STEPS.VALIDATION)
      await new Promise(resolve => setTimeout(resolve, 500)) // Brief delay for UX

      // Step 2: AI Enhancement
      updateProgress(PROGRESS_STEPS.AI_ENHANCEMENT)

      // Submit to the resume generation API
      const response = await axios.post('/api/resume/generate', submissionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || localStorage.getItem('authToken')}`
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          // Update progress during upload
          const uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (uploadProgress < 100) {
            updateProgress(PROGRESS_STEPS.AI_ENHANCEMENT, `Uploading data... ${uploadProgress}%`)
          }
        }
      })

      if (response.data.success) {
        // Process the response and update progress based on actual backend progress
        const { data } = response.data

        // Step 3: Template Rendering
        updateProgress(PROGRESS_STEPS.TEMPLATE_RENDERING, 'Applying template...')
        await new Promise(resolve => setTimeout(resolve, 500))

        // Step 4: PDF Generation
        updateProgress(PROGRESS_STEPS.PDF_GENERATION, 'Generating PDF...')
        await new Promise(resolve => setTimeout(resolve, 800))

        // Step 5: Email Sending
        updateProgress(PROGRESS_STEPS.EMAIL_SENDING, 'Sending to your email...')
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Step 6: Complete
        updateProgress(PROGRESS_STEPS.COMPLETE, 'Resume generated and sent successfully!')

        // Show detailed success message
        toast.success(
          `Resume generated successfully! ${data.emailDelivery?.sent ? 'Check your email for the PDF.' : 'Please contact support if you don\'t receive the email.'}`,
          { duration: 5000 }
        )

        // Show success message with next steps and statistics
        setTimeout(() => {
          toast.success(
            `Processing completed in ${Math.round(data.processingTime / 1000)}s. Template: ${data.pdfGeneration?.templateUsed || 'Professional'}`,
            { duration: 4000 }
          )

          // Reset form and redirect after showing success
          setTimeout(() => {
            resetProgress()
            localStorage.removeItem('resumeBuilderData') // Clear saved form data
            navigate('/jobs') // Redirect to jobs page
          }, 2000)
        }, 1000)
      } else {
        throw new Error(response.data.message || 'Failed to generate resume')
      }
    } catch (error) {
      console.error('Resume generation error:', error)

      let errorMessage = 'Failed to generate resume. Please try again.'

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid resume data. Please check your information.'
            break
          case 401:
            errorMessage = 'Please log in to generate your resume.'
            navigate('/signin')
            return
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            break
          default:
            errorMessage = error.response.data?.message || errorMessage
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      }

      setProgressError(errorMessage)
      toast.error(errorMessage)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-white/70">Please log in to access the resume builder.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Enhanced Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center max-w-md mx-4">
            <LoadingAnimation
              type="spinner"
              size="xlarge"
              color="white"
              message={processingMessage}
              progress={progress}
            />

            <h3 className="text-white text-xl font-semibold mt-4 mb-2">Generating Your Resume</h3>

            {/* Cancel Button */}
            <button
              onClick={() => {
                resetProgress()
                toast.info('Resume generation cancelled')
              }}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-200 text-sm transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Resume Builder Form */}
      <ResumeBuilderForm
        onSubmit={handleResumeSubmit}
        isLoading={isProcessing}
        progressState={{
          isProcessing,
          currentStep,
          progress,
          error,
          success,
          processingMessage,
          resetProgress
        }}
      />
    </div>
  )
}

export default ResumeBuilder