import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import ResumeBuilder from '../../../pages/ResumeBuilder'
import { AuthProvider } from '../../../contexts/AuthContext'

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

// Mock AuthContext with authenticated user
const mockAuthContext = {
  user: { id: 'test-user-id', token: 'test-token' },
  isAuthenticated: true,
  loading: false
}

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }) => children
}))

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Resume Builder Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    
    // Mock successful API responses
    axios.get.mockResolvedValue({
      data: {
        data: {
          templates: [
            {
              templateId: 'professional-classic',
              name: 'Professional Classic',
              description: 'Clean and modern design',
              category: 'professional'
            }
          ]
        }
      }
    })

    axios.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          resumeId: 'test-resume-id',
          processingTime: 5000,
          emailDelivery: { sent: true },
          pdfGeneration: { templateUsed: 'Professional Classic' }
        }
      }
    })

    toast.success = vi.fn()
    toast.error = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should complete the full resume generation flow', async () => {
    renderWithProviders(<ResumeBuilder />)

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    })

    // Step 1: Fill personal information
    const fullNameInput = screen.getByPlaceholderText('Enter your full name')
    const emailInput = screen.getByPlaceholderText('your.email@example.com')
    const phoneInput = screen.getByPlaceholderText('+1 (555) 123-4567')

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '+1234567890' } })

    // Navigate to next step
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Step 2: Add work experience
    await waitFor(() => {
      expect(screen.getByText(/work experience/i)).toBeInTheDocument()
    })

    const addExperienceButton = screen.getByText(/add experience/i)
    fireEvent.click(addExperienceButton)

    // Fill work experience
    const companyInput = screen.getByPlaceholderText(/company/i)
    const positionInput = screen.getByPlaceholderText(/position/i)
    const descriptionInput = screen.getByPlaceholderText(/description/i)

    fireEvent.change(companyInput, { target: { value: 'Tech Corp' } })
    fireEvent.change(positionInput, { target: { value: 'Software Engineer' } })
    fireEvent.change(descriptionInput, { target: { value: 'Developed web applications using React and Node.js' } })

    fireEvent.click(nextButton)

    // Step 3: Add education
    await waitFor(() => {
      expect(screen.getByText(/education/i)).toBeInTheDocument()
    })

    const addEducationButton = screen.getByText(/add education/i)
    fireEvent.click(addEducationButton)

    // Fill education
    const institutionInput = screen.getByPlaceholderText(/institution/i)
    const degreeInput = screen.getByPlaceholderText(/degree/i)
    const fieldInput = screen.getByPlaceholderText(/field/i)

    fireEvent.change(institutionInput, { target: { value: 'University of Technology' } })
    fireEvent.change(degreeInput, { target: { value: 'Bachelor of Science' } })
    fireEvent.change(fieldInput, { target: { value: 'Computer Science' } })

    fireEvent.click(nextButton)

    // Step 4: Add skills
    await waitFor(() => {
      expect(screen.getByText(/skills/i)).toBeInTheDocument()
    })

    const skillInput = screen.getByPlaceholderText(/add a skill/i)
    fireEvent.change(skillInput, { target: { value: 'JavaScript' } })
    fireEvent.keyDown(skillInput, { key: 'Enter', code: 'Enter' })

    fireEvent.change(skillInput, { target: { value: 'React' } })
    fireEvent.keyDown(skillInput, { key: 'Enter', code: 'Enter' })

    fireEvent.click(nextButton)

    // Step 5: Skip achievements (optional)
    await waitFor(() => {
      expect(screen.getByText(/achievements/i)).toBeInTheDocument()
    })

    fireEvent.click(nextButton)

    // Step 6: Select template
    await waitFor(() => {
      expect(screen.getByText(/choose template/i)).toBeInTheDocument()
    })

    // Wait for templates to load
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    const templateCard = screen.getByText('Professional Classic').closest('div')
    fireEvent.click(templateCard)

    // Submit the form
    const generateButton = screen.getByText('Generate Resume')
    fireEvent.click(generateButton)

    // Verify API calls
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/resume/generate',
        expect.objectContaining({
          personalInfo: expect.objectContaining({
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890'
          }),
          workExperience: expect.arrayContaining([
            expect.objectContaining({
              company: 'Tech Corp',
              position: 'Software Engineer'
            })
          ]),
          education: expect.arrayContaining([
            expect.objectContaining({
              institution: 'University of Technology',
              degree: 'Bachelor of Science',
              field: 'Computer Science'
            })
          ]),
          skills: expect.arrayContaining(['JavaScript', 'React']),
          selectedTemplate: 'professional-classic'
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      )
    })

    // Verify success message
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining('Resume generated successfully')
      )
    })
  })

  it('should handle API errors gracefully', async () => {
    // Mock API error
    axios.post.mockRejectedValue({
      response: {
        status: 500,
        data: { message: 'Server error' }
      }
    })

    renderWithProviders(<ResumeBuilder />)

    // Fill minimal required data and submit
    await waitFor(() => {
      expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    })

    // Fill personal info
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('+1 (555) 123-4567'), { target: { value: '+1234567890' } })

    // Navigate through steps quickly
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Next'))
      await waitFor(() => {}, { timeout: 100 })
    }

    // Submit
    const generateButton = screen.getByText('Generate Resume')
    fireEvent.click(generateButton)

    // Verify error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Server error')
      )
    })
  })

  it('should save and restore form data from localStorage', async () => {
    // Pre-populate localStorage with form data
    const savedData = {
      personalInfo: {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+9876543210'
      },
      workExperience: [],
      education: [],
      skills: ['Python', 'Django'],
      achievements: [],
      selectedTemplate: 'professional-classic'
    }
    localStorage.setItem('resumeBuilderData', JSON.stringify(savedData))

    renderWithProviders(<ResumeBuilder />)

    // Verify data is restored
    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument()
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
      expect(screen.getByDisplayValue('+9876543210')).toBeInTheDocument()
    })

    // Verify toast message for restored data
    expect(toast.success).toHaveBeenCalledWith('Previous data restored')
  })

  it('should validate required fields before submission', async () => {
    renderWithProviders(<ResumeBuilder />)

    await waitFor(() => {
      expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    })

    // Try to submit without filling required fields - should be on first step showing "Next"
    const nextButton = screen.getByText('Next')
    fireEvent.click(nextButton)

    // Should show validation error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Please fix the errors before continuing')
      )
    })

    // Should not make API call
    expect(axios.post).not.toHaveBeenCalled()
  })

  it('should handle authentication errors', async () => {
    // Mock authentication error
    axios.post.mockRejectedValue({
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    })

    renderWithProviders(<ResumeBuilder />)

    // Fill form and submit
    await waitFor(() => {
      expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    })

    // Fill minimal data
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('+1 (555) 123-4567'), { target: { value: '+1234567890' } })

    // Navigate to end and submit
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Next'))
      await waitFor(() => {}, { timeout: 100 })
    }

    fireEvent.click(screen.getByText('Generate Resume'))

    // Should handle auth error
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('Please log in to generate your resume')
      )
    })
  })

  it('should show progress indicators during generation', async () => {
    renderWithProviders(<ResumeBuilder />)

    await waitFor(() => {
      expect(screen.getByText('Resume Builder')).toBeInTheDocument()
    })

    // Fill minimal data and submit
    fireEvent.change(screen.getByPlaceholderText('Enter your full name'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('your.email@example.com'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('+1 (555) 123-4567'), { target: { value: '+1234567890' } })

    // Navigate to end
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByText('Next'))
      await waitFor(() => {}, { timeout: 100 })
    }

    // Submit
    fireEvent.click(screen.getByText('Generate Resume'))

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Generating Your Resume')).toBeInTheDocument()
    })

    // Should show progress steps
    expect(screen.getByText(/Generating Resume/i)).toBeInTheDocument()
  })
})