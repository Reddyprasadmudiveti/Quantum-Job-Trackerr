import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import TemplateSelector from '../TemplateSelector'

// Mock dependencies
vi.mock('axios')
vi.mock('react-hot-toast')
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

const mockTemplates = [
  {
    templateId: 'professional-classic',
    name: 'Professional Classic',
    description: 'Clean and modern design perfect for corporate roles',
    category: 'professional',
    previewImage: '/api/placeholder/300/400',
    features: ['ATS-friendly', 'Clean layout', 'Professional fonts'],
    pageLayout: 'single-column',
    colorScheme: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' },
    rating: 4.8,
    usageCount: 1250
  },
  {
    templateId: 'creative-modern',
    name: 'Creative Modern',
    description: 'Eye-catching design for creative professionals',
    category: 'creative',
    previewImage: '/api/placeholder/300/400',
    features: ['Colorful design', 'Two-column layout', 'Visual elements'],
    pageLayout: 'two-column',
    colorScheme: { primary: '#2c3e50', secondary: '#7f8c8d', accent: '#e74c3c' },
    rating: 4.6,
    usageCount: 890
  }
]

describe('TemplateSelector', () => {
  const mockOnTemplateSelect = vi.fn()
  const defaultProps = {
    selectedTemplate: '',
    onTemplateSelect: mockOnTemplateSelect,
    errors: {}
  }

  beforeEach(() => {
    vi.clearAllMocks()
    axios.get.mockResolvedValue({ data: { templates: mockTemplates } })
  })

  it('renders loading state initially', () => {
    render(<TemplateSelector {...defaultProps} />)
    
    expect(screen.getByText('Loading available templates...')).toBeInTheDocument()
    expect(screen.getAllByTestId('template-skeleton')).toHaveLength(3)
  })

  it('fetches and displays templates', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
      expect(screen.getByText('Creative Modern')).toBeInTheDocument()
    })

    expect(axios.get).toHaveBeenCalledWith('/api/resume/templates')
  })

  it('falls back to default templates when API fails', async () => {
    axios.get.mockRejectedValue(new Error('API Error'))
    
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    expect(toast.error).toHaveBeenCalledWith('Using default templates')
  })

  it('displays template information correctly', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    // Check template details
    expect(screen.getByText('Clean and modern design perfect for corporate roles')).toBeInTheDocument()
    expect(screen.getByText('ATS-friendly')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('1250+ uses')).toBeInTheDocument()
  })

  it('handles template selection', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    const selectButton = screen.getAllByText('Select')[0]
    fireEvent.click(selectButton)

    expect(mockOnTemplateSelect).toHaveBeenCalledWith('professional-classic')
  })

  it('shows selected template state', async () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="professional-classic" />)
    
    await waitFor(() => {
      expect(screen.getByText('✓ Selected')).toBeInTheDocument()
    })
  })

  it('displays error message when provided', async () => {
    const propsWithError = {
      ...defaultProps,
      errors: { template: 'Please select a template' }
    }
    
    render(<TemplateSelector {...propsWithError} />)
    
    await waitFor(() => {
      expect(screen.getByText('Please select a template')).toBeInTheDocument()
    })
  })

  it('toggles between grid and preview modes', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    const previewModeButton = screen.getByText('Preview Mode')
    fireEvent.click(previewModeButton)

    // Check if the layout changes (this would need to be verified through CSS classes or layout changes)
    expect(previewModeButton).toHaveClass('bg-white/20')
  })

  it('handles template preview', async () => {
    axios.post.mockResolvedValue({ 
      data: { 
        html: '<div>Preview HTML</div>',
        templateId: 'professional-classic'
      }
    })

    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    const previewButtons = screen.getAllByText('👁️')
    fireEvent.click(previewButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Template Preview')).toBeInTheDocument()
    })

    expect(axios.post).toHaveBeenCalledWith('/api/resume/preview', expect.objectContaining({
      templateId: 'professional-classic',
      resumeData: expect.any(Object)
    }))
  })

  it('handles preview API failure gracefully', async () => {
    axios.post.mockRejectedValue(new Error('Preview API Error'))

    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    const previewButtons = screen.getAllByText('👁️')
    fireEvent.click(previewButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Template Preview')).toBeInTheDocument()
      expect(screen.getByText('Sample Resume Data')).toBeInTheDocument()
    })
  })

  it('closes preview modal', async () => {
    axios.post.mockResolvedValue({ 
      data: { 
        html: '<div>Preview HTML</div>',
        templateId: 'professional-classic'
      }
    })

    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    // Open preview
    const previewButtons = screen.getAllByText('👁️')
    fireEvent.click(previewButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Template Preview')).toBeInTheDocument()
    })

    // Close preview
    const closeButton = screen.getByText('✕')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Template Preview')).not.toBeInTheDocument()
    })
  })

  it('displays template comparison table', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('📊 Template Comparison')).toBeInTheDocument()
    })

    // Check table headers
    expect(screen.getByText('Template')).toBeInTheDocument()
    expect(screen.getByText('Category')).toBeInTheDocument()
    expect(screen.getByText('Layout')).toBeInTheDocument()
    expect(screen.getByText('Best For')).toBeInTheDocument()
    expect(screen.getByText('ATS Friendly')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()

    // Check template rows
    expect(screen.getByText('Corporate, Finance, Consulting')).toBeInTheDocument()
    expect(screen.getByText('Design, Marketing, Arts')).toBeInTheDocument()
  })

  it('highlights selected template in comparison table', async () => {
    render(<TemplateSelector {...defaultProps} selectedTemplate="professional-classic" />)
    
    await waitFor(() => {
      expect(screen.getByText('✓ Selected')).toBeInTheDocument()
    })
  })

  it('displays help text', async () => {
    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Choosing the Right Template')).toBeInTheDocument()
      expect(screen.getByText('Professional: Best for traditional industries and corporate roles')).toBeInTheDocument()
      expect(screen.getByText('Creative: Perfect for design, marketing, and creative positions')).toBeInTheDocument()
      expect(screen.getByText('Academic: Ideal for research, education, and scientific roles')).toBeInTheDocument()
    })
  })

  it('handles template selection from preview modal', async () => {
    axios.post.mockResolvedValue({ 
      data: { 
        html: '<div>Preview HTML</div>',
        templateId: 'professional-classic'
      }
    })

    render(<TemplateSelector {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Professional Classic')).toBeInTheDocument()
    })

    // Open preview
    const previewButtons = screen.getAllByText('👁️')
    fireEvent.click(previewButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Template Preview')).toBeInTheDocument()
    })

    // Select from modal
    const selectButton = screen.getByText('Select This Template')
    fireEvent.click(selectButton)

    expect(mockOnTemplateSelect).toHaveBeenCalledWith('professional-classic')
    
    await waitFor(() => {
      expect(screen.queryByText('Template Preview')).not.toBeInTheDocument()
    })
  })
})