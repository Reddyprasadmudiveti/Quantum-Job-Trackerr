import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

const TemplateSelector = ({ selectedTemplate, onTemplateSelect, errors }) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const [previewData, setPreviewData] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Sample data for template previews
  const getSampleData = () => ({
    personalInfo: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      address: 'New York, NY',
      linkedIn: 'linkedin.com/in/johnsmith',
      portfolio: 'johnsmith.dev',
      summary: 'Experienced professional with 8+ years in software development and team leadership. Proven track record of delivering high-quality solutions and driving innovation in fast-paced environments.'
    },
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Software Engineer',
        startDate: '2020-01-01',
        endDate: null,
        description: 'Lead development of scalable web applications using modern technologies.',
        enhancedDescription: 'Spearheaded the development of enterprise-grade web applications, resulting in 40% improved performance and enhanced user experience for over 10,000 daily active users.'
      },
      {
        company: 'Digital Innovations LLC',
        position: 'Software Developer',
        startDate: '2018-06-01',
        endDate: '2019-12-31',
        description: 'Developed and maintained web applications for various clients.',
        enhancedDescription: 'Collaborated with cross-functional teams to deliver robust web solutions, contributing to a 25% increase in client satisfaction and successful project delivery.'
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        graduationDate: '2018-05-01',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'Git'],
    achievements: [
      'Led team of 5 developers in successful product launch',
      'Reduced application load time by 60% through optimization',
      'Implemented CI/CD pipeline improving deployment efficiency by 80%'
    ]
  })

  // Default templates if API is not available
  const defaultTemplates = [
    {
      templateId: 'professional-classic',
      name: 'Professional Classic',
      description: 'Clean and modern design perfect for corporate roles and traditional industries',
      category: 'professional',
      previewImage: '/api/placeholder/300/400',
      features: ['ATS-friendly', 'Clean layout', 'Professional fonts', 'Structured sections'],
      pageLayout: 'single-column',
      colorScheme: { primary: '#2c3e50', secondary: '#34495e', accent: '#3498db' },
      rating: 4.8,
      usageCount: 1250
    },
    {
      templateId: 'creative-modern',
      name: 'Creative Modern',
      description: 'Eye-catching design for creative professionals and innovative industries',
      category: 'creative',
      previewImage: '/api/placeholder/300/400',
      features: ['Colorful design', 'Two-column layout', 'Visual elements', 'Modern typography'],
      pageLayout: 'two-column',
      colorScheme: { primary: '#2c3e50', secondary: '#7f8c8d', accent: '#e74c3c' },
      rating: 4.6,
      usageCount: 890
    },
    {
      templateId: 'academic-research',
      name: 'Academic Research',
      description: 'Comprehensive format ideal for academic and research positions',
      category: 'academic',
      previewImage: '/api/placeholder/300/400',
      features: ['Traditional layout', 'Publication sections', 'Research focus', 'Academic formatting'],
      pageLayout: 'single-column',
      colorScheme: { primary: '#1a365d', secondary: '#4a5568', accent: '#2b6cb0' },
      rating: 4.7,
      usageCount: 650
    }
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/resume/templates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      })
      setTemplates(response.data.data?.templates || defaultTemplates)
    } catch (error) {
      console.error('Error fetching templates:', error)
      setTemplates(defaultTemplates)
      toast.error('Using default templates')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewTemplate = async (templateId) => {
    try {
      setLoading(true)
      const sampleData = getSampleData()
      
      // Try to get preview from API, fallback to sample data display
      try {
        const response = await axios.post('/api/resume/preview', {
          ...sampleData,
          selectedTemplate: templateId
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        })
        setPreviewData(response.data)
      } catch (apiError) {
        // Fallback to showing sample data in a modal
        setPreviewData({ templateId, sampleData })
      }
      
      setShowPreview(true)
    } catch (error) {
      console.error('Error generating preview:', error)
      toast.error('Failed to generate preview')
    } finally {
      setLoading(false)
    }
  }

  const closePreview = () => {
    setShowPreview(false)
    setPreviewData(null)
  }

  const getCategoryColor = (category) => {
    const colors = {
      professional: 'from-blue-500 to-indigo-600',
      creative: 'from-purple-500 to-pink-600',
      academic: 'from-green-500 to-teal-600'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      professional: '💼',
      creative: '🎨',
      academic: '🎓'
    }
    return icons[category] || '📄'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Choose Template</h2>
          <p className="text-white/70">Loading available templates...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} data-testid="template-skeleton" className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 animate-pulse">
              <div className="aspect-[3/4] bg-white/20 rounded-xl mb-4"></div>
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Template</h2>
        <p className="text-white/70">Select a template that best fits your style and industry</p>
      </div>

      {/* Error Message */}
      {errors.template && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-4">
          <p className="text-red-200 text-sm">{errors.template}</p>
        </div>
      )}

      {/* Preview Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-1 flex">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              !previewMode 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Grid View
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 rounded-xl transition-all duration-300 ${
              previewMode 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Preview Mode
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className={`grid gap-6 ${previewMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {templates.map((template) => (
          <motion.div
            key={template.templateId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: previewMode ? 1 : 1.02 }}
            className={`bg-white/10 backdrop-blur-sm border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.templateId
                ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                : 'border-white/20 hover:border-white/40 hover:bg-white/15'
            }`}
            onClick={() => onTemplateSelect(template.templateId)}
          >
            {/* Template Preview */}
            <div className={`relative ${previewMode ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
              {/* Placeholder for template preview */}
              <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(template.category)} flex items-center justify-center relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
                  }}></div>
                </div>
                
                <div className="text-center text-white relative z-10">
                  <div className="text-6xl mb-4">{getCategoryIcon(template.category)}</div>
                  <div className="text-lg font-semibold">{template.name}</div>
                  <div className="text-sm opacity-80">Template Preview</div>
                  
                  {/* Preview Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreviewTemplate(template.templateId)
                    }}
                    className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg hover:bg-white/30 transition-all duration-300"
                  >
                    👁️ Preview
                  </button>
                </div>
              </div>
              
              {/* Selection Indicator */}
              {selectedTemplate === template.templateId && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white rounded-full p-2 shadow-lg">
                  ✓
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                  {template.category}
                </span>
              </div>

              {/* Rating and Usage */}
              {(template.rating || template.usageCount) && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  {template.rating && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                      ⭐ {template.rating}
                    </div>
                  )}
                  {template.usageCount && (
                    <div className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                      {template.usageCount}+ uses
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{template.name}</h3>
                <span className="text-2xl">{getCategoryIcon(template.category)}</span>
              </div>
              
              <p className="text-white/70 text-sm mb-4 line-clamp-2">{template.description}</p>
              
              {/* Template Stats */}
              <div className="flex items-center justify-between mb-4 text-xs text-white/60">
                <span>Layout: {template.pageLayout || 'Single Column'}</span>
                {template.colorScheme && (
                  <div className="flex items-center gap-1">
                    <span>Colors:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/30" 
                        style={{ backgroundColor: template.colorScheme.primary }}
                      ></div>
                      <div 
                        className="w-3 h-3 rounded-full border border-white/30" 
                        style={{ backgroundColor: template.colorScheme.accent }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Features */}
              {template.features && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-white font-medium text-sm">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.features.slice(0, 4).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white/80 text-xs rounded-lg"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 4 && (
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white/80 text-xs rounded-lg">
                        +{template.features.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTemplateSelect(template.templateId)
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    selectedTemplate === template.templateId
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {selectedTemplate === template.templateId ? '✓ Selected' : 'Select'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePreviewTemplate(template.templateId)
                  }}
                  className="px-4 py-3 bg-blue-500/20 text-blue-200 rounded-xl hover:bg-blue-500/30 transition-all duration-300"
                  title="Preview Template"
                >
                  👁️
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Template Comparison */}
      {templates.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            📊 Template Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white/80 text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3 px-2">Template</th>
                  <th className="text-left py-3 px-2">Category</th>
                  <th className="text-left py-3 px-2">Layout</th>
                  <th className="text-left py-3 px-2">Best For</th>
                  <th className="text-left py-3 px-2">ATS Friendly</th>
                  <th className="text-left py-3 px-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template, index) => (
                  <tr key={template.templateId} className={`border-b border-white/10 hover:bg-white/5 transition-colors ${
                    selectedTemplate === template.templateId ? 'bg-purple-500/10' : ''
                  }`}>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryIcon(template.category)}</span>
                        <span className="font-medium">{template.name}</span>
                        {selectedTemplate === template.templateId && (
                          <span className="text-purple-400 text-xs">✓ Selected</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 capitalize">{template.category}</td>
                    <td className="py-3 px-2 capitalize">{template.pageLayout || 'Single Column'}</td>
                    <td className="py-3 px-2">
                      {template.category === 'professional' && 'Corporate, Finance, Consulting'}
                      {template.category === 'creative' && 'Design, Marketing, Arts'}
                      {template.category === 'academic' && 'Research, Education, Science'}
                    </td>
                    <td className="py-3 px-2">
                      {template.features?.includes('ats-friendly') ? (
                        <span className="text-green-400 flex items-center gap-1">
                          ✓ Excellent
                        </span>
                      ) : (
                        <span className="text-yellow-400 flex items-center gap-1">
                          ⚠ Good
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      {template.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span>{template.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Template Preview</h3>
                <p className="text-purple-100 text-sm">
                  {templates.find(t => t.templateId === previewData.templateId)?.name || 'Template Preview'}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="text-white hover:text-purple-200 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {previewData.html ? (
                // If we have rendered HTML from API
                <div 
                  className="border rounded-lg overflow-hidden shadow-inner bg-white"
                  dangerouslySetInnerHTML={{ __html: previewData.html }}
                />
              ) : (
                // Fallback: Show sample data structure
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Sample Resume Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Personal Information</h5>
                        <div className="space-y-1 text-gray-600">
                          <p><strong>Name:</strong> {previewData.sampleData.personalInfo.fullName}</p>
                          <p><strong>Email:</strong> {previewData.sampleData.personalInfo.email}</p>
                          <p><strong>Phone:</strong> {previewData.sampleData.personalInfo.phone}</p>
                          <p><strong>Location:</strong> {previewData.sampleData.personalInfo.address}</p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {previewData.sampleData.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Work Experience</h5>
                      {previewData.sampleData.workExperience.map((exp, index) => (
                        <div key={index} className="mb-3 p-3 bg-white rounded border">
                          <div className="flex justify-between items-start mb-1">
                            <h6 className="font-medium text-gray-800">{exp.position}</h6>
                            <span className="text-xs text-gray-500">
                              {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{exp.company}</p>
                          <p className="text-xs text-gray-500">{exp.enhancedDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800">
                      <span className="text-lg">ℹ️</span>
                      <span className="font-medium">Preview Note</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-2">
                      This shows the sample data that would be used with this template. 
                      The actual resume will use your personal information and be formatted according to the template design.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Template: {templates.find(t => t.templateId === previewData.templateId)?.name}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onTemplateSelect(previewData.templateId)
                    closePreview()
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Select This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-blue-300 text-xl">💡</span>
          <div>
            <h4 className="text-blue-200 font-semibold mb-1">Choosing the Right Template</h4>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• <strong>Professional:</strong> Best for traditional industries and corporate roles</li>
              <li>• <strong>Creative:</strong> Perfect for design, marketing, and creative positions</li>
              <li>• <strong>Academic:</strong> Ideal for research, education, and scientific roles</li>
              <li>• Consider your industry's expectations and company culture</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelector