import React from 'react'

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = 'max-w-6xl',
  padding = 'responsive-px',
  verticalPadding = 'py-8 sm:py-12 lg:py-16'
}) => {
  return (
    <div className={`${verticalPadding} ${padding} ${className}`}>
      <div className={`${maxWidth} mx-auto`}>
        {children}
      </div>
    </div>
  )
}

export default ResponsiveContainer