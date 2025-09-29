import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import PersonalInfoSection from '../PersonalInfoSection'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}))

describe('PersonalInfoSection', () => {
  const mockData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    linkedIn: '',
    portfolio: ''
  }

  const mockOnChange = vi.fn()
  const mockSetTouched = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number *')).toBeInTheDocument()
    expect(screen.getByLabelText('Address')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn Profile')).toBeInTheDocument()
    expect(screen.getByLabelText('Portfolio/Website')).toBeInTheDocument()
  })

  it('displays pre-filled data', () => {
    const filledData = {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      linkedIn: 'https://linkedin.com/in/johndoe',
      portfolio: 'https://johndoe.com'
    }

    render(
      <PersonalInfoSection
        data={filledData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://linkedin.com/in/johndoe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://johndoe.com')).toBeInTheDocument()
  })

  it('calls onChange when input values change', () => {
    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockData,
      fullName: 'Jane Doe'
    })
  })

  it('calls setTouched when input loses focus', () => {
    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    const nameInput = screen.getByLabelText('Full Name *')
    fireEvent.blur(nameInput)

    expect(mockSetTouched).toHaveBeenCalledWith(expect.any(Function))
  })

  it('displays validation errors', () => {
    const errors = {
      fullName: 'Full name is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number'
    }

    const touched = {
      fullName: true,
      email: true,
      phone: true
    }

    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={errors}
        touched={touched}
        setTouched={mockSetTouched}
      />
    )

    expect(screen.getByText('Full name is required')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument()
  })

  it('applies error styling to invalid fields', () => {
    const errors = {
      fullName: 'Full name is required'
    }

    const touched = {
      fullName: true
    }

    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={errors}
        touched={touched}
        setTouched={mockSetTouched}
      />
    )

    const nameInput = screen.getByLabelText('Full Name *')
    expect(nameInput).toHaveClass('border-red-500/50')
  })

  it('shows help text and tips', () => {
    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    expect(screen.getByText('Tips for Personal Information')).toBeInTheDocument()
    expect(screen.getByText(/Use your full legal name/)).toBeInTheDocument()
    expect(screen.getByText(/Provide a professional email address/)).toBeInTheDocument()
  })

  it('handles all input types correctly', () => {
    render(
      <PersonalInfoSection
        data={mockData}
        onChange={mockOnChange}
        errors={{}}
        touched={{}}
        setTouched={mockSetTouched}
      />
    )

    // Test text input
    const nameInput = screen.getByLabelText('Full Name *')
    expect(nameInput).toHaveAttribute('type', 'text')

    // Test email input
    const emailInput = screen.getByLabelText('Email Address *')
    expect(emailInput).toHaveAttribute('type', 'email')

    // Test tel input
    const phoneInput = screen.getByLabelText('Phone Number *')
    expect(phoneInput).toHaveAttribute('type', 'tel')

    // Test url inputs
    const linkedInInput = screen.getByLabelText('LinkedIn Profile')
    expect(linkedInInput).toHaveAttribute('type', 'url')

    const portfolioInput = screen.getByLabelText('Portfolio/Website')
    expect(portfolioInput).toHaveAttribute('type', 'url')

    // Test textarea
    const addressInput = screen.getByLabelText('Address')
    expect(addressInput.tagName).toBe('TEXTAREA')
  })
})