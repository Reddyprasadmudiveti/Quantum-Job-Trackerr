import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import ResumeBuilder from '../ResumeBuilder'

// Mock dependencies
vi.mock('axios')
vi.mock('react-hot-toast')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    isAuthenticated: true
  })
}))

vi.mock('../../components/resume/ResumeBuilderForm', () => ({
  default: ({ onSubmit, isLoading, progressState }) => (
    <div data-testid="resume-builder-form">
      <button 
        onClick={() => onSubmit({ test: 'data' })}
        disabled={isLoading}
      >
        Submit Resume
      </button>
      {progressState?.isProcessing && (
        <div data-testid="progress-state">Processing</div>
      )}
      {progressState?.error && (
        <div data-testid="error-state">{progressState.error}</div>
      )}
      {progressState?.success && (
        <div data-testid="success-state">Success</div>
      )}
    </div>
  )
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <div>{children}</div>
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ResumeBuilder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    axios.post.mockClear()
    toast.success.mockClear()
    toast.error.mockClear()
  })

  it('renders resume builder form when authenticated', () => {
    renderWithRouter(<ResumeBuilder />)
    
    expect(screen.getByTestId('resume-builder-form')).toBeInTheDocument()
  })

  it('shows processing overlay during resume generation', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Generating Your Resume')).toBeInTheDocument()
    expect(screen.getByText('Validating your information...')).toBeInTheDocument()
  })

  it('shows progress bar during processing', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    expect(screen.getByText('0% Complete')).toBeInTheDocument()
    
    // Wait for progress to update
    await waitFor(() => {
      expect(screen.getByText(/\d+% Complete/)).toBeInTheDocument()
    })
  })

  it('handles successful resume generation', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Resume generated and sent to your email!')
    })
  })

  it('handles API errors correctly', async () => {
    const errorMessage = 'Server error occurred'
    axios.post.mockRejectedValue({
      response: {
        status: 500,
        data: { message: errorMessage }
      }
    })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('handles network errors correctly', async () => {
    axios.post.mockRejectedValue({
      request: {}
    })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Unable to connect to server. Please check your internet connection.')
    })
  })

  it('handles 400 bad request errors', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Invalid data' }
      }
    })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid data')
    })
  })

  it('handles 429 rate limit errors', async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 429
      }
    })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Too many requests. Please wait a moment and try again.')
    })
  })

  it('shows cancel button during processing', async () => {
    axios.post.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('allows cancelling resume generation', async () => {
    axios.post.mockImplementation(() => new Promise(() => {})) // Never resolves
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(toast.info).toHaveBeenCalledWith('Resume generation cancelled')
  })

  it('passes progress state to form component', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    expect(screen.getByTestId('progress-state')).toBeInTheDocument()
  })

  it('shows upload progress during file upload', async () => {
    let onUploadProgress
    axios.post.mockImplementation((url, data, config) => {
      onUploadProgress = config.onUploadProgress
      return Promise.resolve({ data: { success: true } })
    })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    // Simulate upload progress
    if (onUploadProgress) {
      onUploadProgress({ loaded: 50, total: 100 })
    }
    
    await waitFor(() => {
      expect(screen.getByText('Uploading data... 50%')).toBeInTheDocument()
    })
  })

  it('progresses through all steps during successful generation', async () => {
    axios.post.mockResolvedValue({ data: { success: true } })
    
    renderWithRouter(<ResumeBuilder />)
    
    const submitButton = screen.getByText('Submit Resume')
    fireEvent.click(submitButton)
    
    // Check initial step
    expect(screen.getByText('Validating your information...')).toBeInTheDocument()
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.getByText('Resume generated and sent to your email!')).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})