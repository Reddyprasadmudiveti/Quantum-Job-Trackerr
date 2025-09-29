import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import useResumeProgress from '../useResumeProgress'

describe('useResumeProgress', () => {
  let result

  beforeEach(() => {
    const { result: hookResult } = renderHook(() => useResumeProgress())
    result = hookResult
  })

  it('should initialize with default values', () => {
    expect(result.current.isProcessing).toBe(false)
    expect(result.current.currentStep).toBe(null)
    expect(result.current.progress).toBe(0)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
    expect(result.current.processingMessage).toBe('')
  })

  it('should start progress correctly', () => {
    act(() => {
      result.current.startProgress()
    })

    expect(result.current.isProcessing).toBe(true)
    expect(result.current.currentStep).toBe(result.current.PROGRESS_STEPS.VALIDATION)
    expect(result.current.progress).toBe(0)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
    expect(result.current.processingMessage).toBe('Validating your information...')
  })

  it('should update progress correctly', () => {
    act(() => {
      result.current.startProgress()
    })

    act(() => {
      result.current.updateProgress(result.current.PROGRESS_STEPS.AI_ENHANCEMENT)
    })

    expect(result.current.currentStep).toBe(result.current.PROGRESS_STEPS.AI_ENHANCEMENT)
    expect(result.current.progress).toBeGreaterThan(0)
    expect(result.current.processingMessage).toBe('Enhancing your content with AI...')
  })

  it('should update progress with custom message', () => {
    const customMessage = 'Custom processing message'
    
    act(() => {
      result.current.startProgress()
    })

    act(() => {
      result.current.updateProgress(result.current.PROGRESS_STEPS.AI_ENHANCEMENT, customMessage)
    })

    expect(result.current.processingMessage).toBe(customMessage)
  })

  it('should complete progress when reaching final step', () => {
    act(() => {
      result.current.startProgress()
    })

    act(() => {
      result.current.updateProgress(result.current.PROGRESS_STEPS.COMPLETE)
    })

    expect(result.current.isProcessing).toBe(false)
    expect(result.current.success).toBe(true)
    expect(result.current.progress).toBe(100)
  })

  it('should set error correctly', () => {
    const errorMessage = 'Test error message'
    
    act(() => {
      result.current.startProgress()
    })

    act(() => {
      result.current.setProgressError(errorMessage)
    })

    expect(result.current.isProcessing).toBe(false)
    expect(result.current.error).toBe(errorMessage)
    expect(result.current.success).toBe(false)
  })

  it('should reset progress correctly', () => {
    act(() => {
      result.current.startProgress()
    })

    act(() => {
      result.current.updateProgress(result.current.PROGRESS_STEPS.AI_ENHANCEMENT)
    })

    act(() => {
      result.current.resetProgress()
    })

    expect(result.current.isProcessing).toBe(false)
    expect(result.current.currentStep).toBe(null)
    expect(result.current.progress).toBe(0)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
    expect(result.current.processingMessage).toBe('')
  })

  it('should calculate step index correctly', () => {
    const stepIndex = result.current.getStepIndex(result.current.PROGRESS_STEPS.AI_ENHANCEMENT)
    expect(stepIndex).toBe(1) // AI_ENHANCEMENT is the second step (index 1)
  })

  it('should have all required progress steps', () => {
    const steps = result.current.PROGRESS_STEPS
    expect(steps.VALIDATION).toBe('validation')
    expect(steps.AI_ENHANCEMENT).toBe('ai_enhancement')
    expect(steps.TEMPLATE_RENDERING).toBe('template_rendering')
    expect(steps.PDF_GENERATION).toBe('pdf_generation')
    expect(steps.EMAIL_SENDING).toBe('email_sending')
    expect(steps.COMPLETE).toBe('complete')
  })

  it('should have messages for all progress steps', () => {
    const messages = result.current.STEP_MESSAGES
    const steps = Object.values(result.current.PROGRESS_STEPS)
    
    steps.forEach(step => {
      expect(messages[step]).toBeDefined()
      expect(typeof messages[step]).toBe('string')
      expect(messages[step].length).toBeGreaterThan(0)
    })
  })
})