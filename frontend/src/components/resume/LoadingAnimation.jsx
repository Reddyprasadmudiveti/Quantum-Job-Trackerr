import React from 'react'
import { motion } from 'framer-motion'

const LoadingAnimation = ({ 
  type = 'spinner', 
  size = 'medium', 
  color = 'white',
  message = '',
  progress = null 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'h-4 w-4'
      case 'large':
        return 'h-12 w-12'
      case 'xlarge':
        return 'h-16 w-16'
      default:
        return 'h-8 w-8'
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return 'border-blue-500'
      case 'purple':
        return 'border-purple-500'
      case 'green':
        return 'border-green-500'
      default:
        return 'border-white'
    }
  }

  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${getSizeClasses()} ${getColorClasses()}`} />
  )

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full bg-current ${size === 'small' ? 'w-2 h-2' : 'w-3 h-3'}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2
          }}
        />
      ))}
    </div>
  )

  const renderPulse = () => (
    <motion.div
      className={`rounded-full bg-current ${getSizeClasses()}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity
      }}
    />
  )

  const renderBars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`bg-current ${size === 'small' ? 'w-1' : 'w-2'}`}
          animate={{
            height: ['20%', '100%', '20%']
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1
          }}
          style={{ minHeight: size === 'small' ? '8px' : '16px' }}
        />
      ))}
    </div>
  )

  const renderWave = () => (
    <div className="flex items-center space-x-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className={`rounded-full bg-current ${size === 'small' ? 'w-1 h-1' : 'w-2 h-2'}`}
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  )

  const renderAnimation = () => {
    switch (type) {
      case 'dots':
        return renderDots()
      case 'pulse':
        return renderPulse()
      case 'bars':
        return renderBars()
      case 'wave':
        return renderWave()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className={`text-${color}`}>
        {renderAnimation()}
      </div>
      
      {message && (
        <div className={`text-${color}/80 text-sm text-center`}>
          {message}
        </div>
      )}
      
      {progress !== null && (
        <div className="w-full max-w-xs">
          <div className={`w-full bg-${color}/20 rounded-full h-2`}>
            <motion.div
              className={`bg-${color} h-2 rounded-full`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className={`text-${color}/60 text-xs text-center mt-1`}>
            {Math.round(progress)}%
          </div>
        </div>
      )}
    </div>
  )
}

export default LoadingAnimation