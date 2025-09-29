import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ProgressIndicator = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  isProcessing = false,
  processingStep = null,
  processingMessage = '',
  error = null,
  success = false,
  successMessage = ''
}) => {
  const getStepStatus = (stepIndex) => {
    if (error && stepIndex === processingStep) return 'error'
    if (success && stepIndex === processingStep) return 'success'
    if (isProcessing && stepIndex === processingStep) return 'processing'
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'current'
    return 'upcoming'
  }

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500 text-white'
      case 'current':
        return 'bg-purple-500 border-purple-500 text-white'
      case 'processing':
        return 'bg-blue-500 border-blue-500 text-white animate-pulse'
      case 'success':
        return 'bg-green-500 border-green-500 text-white'
      case 'error':
        return 'bg-red-500 border-red-500 text-white'
      case 'upcoming':
        return 'bg-white/20 border-white/30 text-white/70'
      default:
        return 'bg-white/20 border-white/30 text-white/70'
    }
  }

  const getConnectorColor = (stepIndex) => {
    if (stepIndex < currentStep) return 'bg-green-500'
    if (isProcessing && stepIndex === processingStep - 1) return 'bg-blue-500'
    return 'bg-white/30'
  }

  const getStepIcon = (step, status, index) => {
    switch (status) {
      case 'completed':
      case 'success':
        return '✓'
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        )
      case 'error':
        return '✕'
      default:
        return step.icon
    }
  }

  return (
    <div className="w-full">
      {/* Desktop Progress Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <motion.div
                className="relative flex flex-col items-center cursor-pointer group"
                onClick={() => onStepClick && onStepClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-semibold transition-all duration-300 ${getStepColor(
                    getStepStatus(index)
                  )} group-hover:shadow-lg`}
                >
                  {getStepIcon(step, getStepStatus(index), index)}
                </div>
                
                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium transition-colors duration-300 ${
                    getStepStatus(index) === 'current' 
                      ? 'text-white' 
                      : getStepStatus(index) === 'completed' || getStepStatus(index) === 'success'
                      ? 'text-green-300'
                      : getStepStatus(index) === 'processing'
                      ? 'text-blue-300'
                      : getStepStatus(index) === 'error'
                      ? 'text-red-300'
                      : 'text-white/70'
                  }`}>
                    {step.title}
                  </div>
                  {getStepStatus(index) === 'processing' && (
                    <div className="text-xs text-blue-200 mt-1 animate-pulse">
                      Processing...
                    </div>
                  )}
                  {getStepStatus(index) === 'error' && (
                    <div className="text-xs text-red-200 mt-1">
                      Failed
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-white/30 rounded-full"></div>
                  <motion.div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${getConnectorColor(index)}`}
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: index < currentStep ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  ></motion.div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-white/80 text-sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>

        {/* Current Step Info */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-lg">
              {steps[currentStep]?.icon}
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {steps[currentStep]?.title}
              </h3>
              <p className="text-white/70 text-sm">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => onStepClick && onStepClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-purple-500 scale-125'
                    : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Summary (Desktop) */}
      <div className="hidden md:block mt-8">
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-green-400 font-semibold text-lg">
                {steps.filter((_, index) => index < currentStep).length}
              </div>
              <div className="text-white/70 text-sm">Completed</div>
            </div>
            <div>
              <div className="text-purple-400 font-semibold text-lg">
                {isProcessing ? 0 : 1}
              </div>
              <div className="text-white/70 text-sm">
                {isProcessing ? 'Processing' : 'Current'}
              </div>
            </div>
            <div>
              <div className="text-white/50 font-semibold text-lg">
                {steps.length - currentStep - 1}
              </div>
              <div className="text-white/70 text-sm">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {(isProcessing || error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {/* Processing Message */}
            {isProcessing && !error && !success && (
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
                  <div>
                    <h4 className="text-blue-200 font-semibold">Processing Your Resume</h4>
                    <p className="text-blue-100/80 text-sm">
                      {processingMessage || 'Please wait while we generate your resume...'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-blue-900/30 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="text-green-200 font-semibold">Success!</h4>
                    <p className="text-green-100/80 text-sm">
                      {successMessage || 'Your resume has been generated successfully!'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✕</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-200 font-semibold">Error Occurred</h4>
                    <p className="text-red-100/80 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 border border-red-500/50 rounded-lg text-red-200 text-sm transition-colors duration-200"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      // This would be handled by parent component
                      console.log('Contact support clicked')
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white/80 text-sm transition-colors duration-200"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProgressIndicator