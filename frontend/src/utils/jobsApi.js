// API utility functions for job-related operations
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

// IBM Jobs API
export const ibmJobsApi = {
  // Get all IBM jobs from MongoDB
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: 1,
      limit: 20,
      ...params
    })
    const response = await axios.get(`${API_BASE_URL}/ibm-jobs?${queryParams}`)
    return response.data
  },

  // Get IBM India jobs from MongoDB
  getIndiaJobs: async (params = {}) => {
    const queryParams = new URLSearchParams(params)
    const response = await axios.get(`${API_BASE_URL}/ibm-jobs/india?${queryParams}`)
    return response.data
  },

  // Trigger real-time scraping (saves to MongoDB)
  scrapeRealTime: async (params = {}) => {
    const queryParams = new URLSearchParams({
      keyword: 'quantum',
      limit: 10,
      ...params
    })
    const response = await axios.get(`${API_BASE_URL}/ibm-jobs/realtime?${queryParams}`)
    return response.data
  },

  // Scrape IBM India jobs (saves to MongoDB)
  scrapeIndia: async (params = {}) => {
    const queryParams = new URLSearchParams({
      keyword: 'engineer',
      limit: 10,
      ...params
    })
    const response = await axios.get(`${API_BASE_URL}/ibm-jobs/india-scrape?${queryParams}`)
    return response.data
  }
}

// Quantum Jobs API
export const quantumJobsApi = {
  // Get all quantum jobs from MongoDB
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: 1,
      limit: 20,
      ...params
    })
    const response = await axios.get(`${API_BASE_URL}/quantum-jobs?${queryParams}`)
    return response.data
  },

  // Get specific quantum job by ID
  getById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/quantum-jobs/${id}`)
    return response.data
  }
}

// General Jobs API (original jobs endpoint)
export const jobsApi = {
  // Get all jobs from MongoDB
  getAll: async (page = 1, limit = 10) => {
    const response = await axios.get(`${API_BASE_URL}/jobs/${page}/${limit}`)
    return response.data
  }
}

// Helper function to format job data consistently
export const formatJobData = (job) => {
  return {
    id: job.id || job.jobId || job._id,
    title: job.title || job.tittle || 'No title available',
    company: job.company || 'Unknown Company',
    location: job.location || 'Remote',
    type: job.type || 'Full-time',
    posted: job.posted || job.createdAt || 'Recently',
    description: job.description || 'No description available',
    skills: Array.isArray(job.skills) ? job.skills : [],
    salary: job.salary || 'Competitive',
    experience: job.experience || 'Not specified',
    url: job.url || '#',
    portal: job.portal || 'Unknown'
  }
}

// Helper function to handle API errors
export const handleApiError = (error, fallbackMessage = 'An error occurred') => {
  console.error('API Error:', error)
  
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || fallbackMessage
  } else if (error.request) {
    // Request was made but no response received
    return 'Unable to connect to server'
  } else {
    // Something else happened
    return error.message || fallbackMessage
  }
}