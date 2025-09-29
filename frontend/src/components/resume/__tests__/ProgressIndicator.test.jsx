import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgressIndicator from '../ProgressIndicator'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

describe('ProgressIndicator', () => {
  const mockSteps = [
    { id: 'step1', title: 'Step 1', icon: '1️⃣' },
    { id: 'step2', title: 'Step 2', icon: '2️⃣' },
    { id: 'step3', title: 'Step 3', icon: '3️⃣' }
  ]

  const defaultProps = {
    steps: mockSteps,
    currentStep: 0,
    onStepClick: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders progress indicator component', () => {
    render(<ProgressIndicator {...defaultProps} />)
    
    // Check that the component renders without errors
    expect(document.querySelector('.w-full')).toBeInTheDocument()
    
    // Check that at least one step icon is rendered
    expect(screen.getAllByText('1️⃣')).toHaveLength(2) // Desktop and mobile
  })

  it('shows current step as active', () => {
    render(<ProgressIndicator {...defaultProps} currentStep={1} />)
    
    const stepElements = screen.getAllByText(/Step \d/)
    expect(stepElements[1]).toHaveClass('text-white')
  })

  it('shows completed steps with checkmarks', () => {
    render(<ProgressIndicator {...defaultProps} currentStep={2} />)
    
    const checkmarks = screen.getAllByText('✓')
    expect(checkmarks).toHaveLength(2) // Steps 0 and 1 should be completed
  })

  it('calls onStepClick when step is clicked', () => {
    const onStepClick = vi.fn()
    render(<ProgressIndicator {...defaultProps} onStepClick={onStepClick} />)
    
    const firstSteps = screen.getAllByText('Step 1')
    const firstStep = firstSteps[0].closest('div')
    fireEvent.click(firstStep)
    
    expect(onStepClick).toHaveBeenCalledWith(0)
  })

  it('shows processing state correctly', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        isProcessing={true}
        processingStep={1}
        processingMessage="Processing step 2..."
      />
    )
    
    expect(screen.getByText('Processing Your Resume')).toBeInTheDocument()
    expect(screen.getByText('Processing step 2...')).toBeInTheDocument()
  })

  it('shows success state correctly', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        success={true}
        successMessage="Success! Resume generated."
      />
    )
    
    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Success! Resume generated.')).toBeInTheDocument()
  })

  it('shows error state correctly', () => {
    const errorMessage = 'Something went wrong'
    render(
      <ProgressIndicator 
        {...defaultProps} 
        error={errorMessage}
      />
    )
    
    expect(screen.getByText('Error Occurred')).toBeInTheDocument()
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('shows error actions when error occurs', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        error="Test error"
      />
    )
    
    expect(screen.getByText('Try Again')).toBeInTheDocument()
    expect(screen.getByText('Contact Support')).toBeInTheDocument()
  })

  it('shows processing animation for processing step', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        isProcessing={true}
        processingStep={1}
      />
    )
    
    // Check for processing indicator (spinner)
    const processingElements = screen.getAllByText('Processing...')
    expect(processingElements.length).toBeGreaterThan(0)
  })

  it('shows failed state for error step', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        error="Test error"
        processingStep={1}
      />
    )
    
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('displays progress summary correctly', () => {
    render(<ProgressIndicator {...defaultProps} currentStep={1} />)
    
    // Check completed count (should be in summary section)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Remaining')).toBeInTheDocument()
    
    // Check that summary section exists
    const summarySection = document.querySelector('.grid.grid-cols-3')
    expect(summarySection).toBeInTheDocument()
  })

  it('shows mobile progress bar with percentage', () => {
    render(<ProgressIndicator {...defaultProps} currentStep={1} />)
    
    expect(screen.getAllByText(/Step 2 of 3/)).toHaveLength(2) // Mobile section shows this twice
    expect(screen.getByText('67%')).toBeInTheDocument() // (2/3) * 100 = 67%
  })

  it('handles processing state in progress summary', () => {
    render(
      <ProgressIndicator 
        {...defaultProps} 
        isProcessing={true}
        processingStep={1}
      />
    )
    
    expect(screen.getByText('Processing')).toBeInTheDocument()
  })

  it('shows step navigation dots on mobile', () => {
    render(<ProgressIndicator {...defaultProps} currentStep={1} />)
    
    // Should have 3 navigation dots (one for each step)
    const dots = screen.getAllByRole('button')
    const navigationDots = dots.filter(button => 
      button.className.includes('w-3 h-3 rounded-full')
    )
    expect(navigationDots).toHaveLength(3)
  })

  it('handles step click from navigation dots', () => {
    const onStepClick = vi.fn()
    render(<ProgressIndicator {...defaultProps} onStepClick={onStepClick} />)
    
    const dots = screen.getAllByRole('button')
    const navigationDots = dots.filter(button => 
      button.className.includes('w-3 h-3 rounded-full')
    )
    
    fireEvent.click(navigationDots[2])
    expect(onStepClick).toHaveBeenCalledWith(2)
  })
})