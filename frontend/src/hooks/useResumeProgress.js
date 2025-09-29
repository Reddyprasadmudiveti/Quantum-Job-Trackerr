import { useState, useCallback } from 'react'

const PROGRESS_STEPS = {
  VALIDATION: 'validation',
  AI_ENHANCEMENT: 'ai_enhancement',
  TEMPLATE_RENDERING: 'template_rendering',
  PDF_GENERATION: 'pdf_generation',
  EMAIL_SENDING: 'email_sending',
  COMPLETE: 'complete'
}

const STEP_MESSAGES = {
  [PROGRESS_STEPS.VALIDATION]: 'Validating your information...',
  [PROGRESS_STEPS.AI_ENHANCEMENT]: 'Enhancing your content with AI...',
  [PROGRESS_STEPS.TEMPLATE_RENDERING]: 'Applying your selected template...',
  [PROGRESS_STEPS.PDF_GENERATION]: 'Generating your PDF resume...',
  [PROGRESS_STEPS.EMAIL_SENDING]: 'Sending resume to your email...',
  [PROGRESS_STEPS.COMPLETE]: 'Resume generated successfully!'
}

const useResumeProgress = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [processingMessage, setProcessingMessage] = useState('')

  const startProgress = useCallback(() => {
    setIsProcessing(true)
    setCurrentStep(PROGRESS_STEPS.VALIDATION)
    setProgress(0)
    setError(null)
    setSuccess(false)
    setProcessingMessage(STEP_MESSAGES[PROGRESS_STEPS.VALIDATION])
  }, [])

  const updateProgress = useCallback((step, customMessage = null) => {
    const stepOrder = Object.values(PROGRESS_STEPS)
    const stepIndex = stepOrder.indexOf(step)
    const progressPercentage = ((stepIndex + 1) / stepOrder.length) * 100

    setCurrentStep(step)
    setProgress(progressPercentage)
    setProcessingMessage(customMessage || STEP_MESSAGES[step])

    if (step === PROGRESS_STEPS.COMPLETE) {
      setIsProcessing(false)
      setSuccess(true)
    }
  }, [])

  const setProgressError = useCallback((errorMessage) => {
    setIsProcessing(false)
    setError(errorMessage)
    setSuccess(false)
  }, [])

  const resetProgress = useCallback(() => {
    setIsProcessing(false)
    setCurrentStep(null)
    setProgress(0)
    setError(null)
    setSuccess(false)
    setProcessingMessage('')
  }, [])

  const getStepIndex = useCallback((step) => {
    return Object.values(PROGRESS_STEPS).indexOf(step)
  }, [])

  return {
    // State
    isProcessing,
    currentStep,
    progress,
    error,
    success,
    processingMessage,
    
    // Actions
    startProgress,
    updateProgress,
    setProgressError,
    resetProgress,
    
    // Utilities
    getStepIndex,
    PROGRESS_STEPS,
    STEP_MESSAGES
  }
}

export default useResumeProgress