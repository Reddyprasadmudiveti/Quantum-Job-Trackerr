import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Tab } from '@headlessui/react'
import { ibmJobsApi, quantumJobsApi, formatJobData, handleApiError } from '../utils/jobsApi'

// Sample jobs data for fallback
const getSampleJobs = () => {
  return [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'IBM',
      location: 'Bangalore',
      type: 'Full-time',
      posted: '2 days ago',
      description: 'We are looking for a skilled software engineer to join our team and help build innovative solutions.',
      skills: ['JavaScript', 'React', 'Node.js'],
      salary: '₹15-20 LPA',
      experience: '3-5 years',
      url: 'https://careers.ibm.com'
    },
    {
      id: 2,
      title: 'Data Scientist',
      company: 'IBM',
      location: 'Hyderabad',
      type: 'Full-time',
      posted: '1 week ago',
      description: 'Join our data science team to work on cutting-edge AI and machine learning projects.',
      skills: ['Python', 'Machine Learning', 'SQL'],
      salary: '₹18-25 LPA',
      experience: '2-4 years',
      url: 'https://careers.ibm.com'
    },
    {
      id: 3,
      title: 'Cloud Solutions Architect',
      company: 'IBM',
      location: 'Pune',
      type: 'Full-time',
      posted: '3 days ago',
      description: 'Design and implement cloud-based solutions for enterprise clients using IBM Cloud.',
      skills: ['AWS', 'IBM Cloud', 'Kubernetes'],
      salary: '₹25-35 LPA',
      experience: '5-8 years',
      url: 'https://careers.ibm.com'
    }
  ];
}

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [ibmJobs, setIbmJobs] = useState([])
  const [quantumJobs, setQuantumJobs] = useState([])
  const [activeJobType, setActiveJobType] = useState('ibm') // 'ibm' or 'quantum'
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [jobsPerPage] = useState(9)

  // Fetch IBM jobs from MongoDB backend with pagination
  const fetchIbmJobs = useCallback(async (useRealTime = false, showLoading = true, page = 1) => {
    try {
      if (showLoading) {
        setLoading(true)
        setError(null)
      }
      
      const params = {
        keyword: searchTerm,
        location: selectedLocation === 'all' ? '' : selectedLocation,
        page: page,
        limit: jobsPerPage
      }

      let data
      if (useRealTime) {
        // Use real-time scraping (saves to MongoDB)
        data = await ibmJobsApi.scrapeRealTime(params)
      } else {
        // Get jobs from MongoDB
        data = await ibmJobsApi.getAll(params)
      }
      
      if (data.success && data.jobs && data.jobs.length > 0) {
        const formattedJobs = data.jobs.map(formatJobData)
        setIbmJobs(formattedJobs)
        
        // Update pagination state
        if (data.pagination) {
          setCurrentPage(data.pagination.currentPage)
          setTotalPages(data.pagination.totalPages)
          setTotalJobs(data.pagination.totalJobs)
        }
        
        setError(null)
        console.log(`Fetched ${formattedJobs.length} IBM jobs from MongoDB (Page ${page}/${data.pagination?.totalPages || 1})`)
        if (data.newJobsSaved) {
          console.log(`${data.newJobsSaved} new jobs saved to database`)
        }
      } else {
        setError('No IBM jobs found in database')
        setIbmJobs([])
        setCurrentPage(1)
        setTotalPages(1)
        setTotalJobs(0)
      }
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch IBM jobs from database')
      console.error('Error fetching IBM jobs:', err)
      setError(errorMessage)
      // Fallback to sample data
      setIbmJobs(getSampleJobs())
      setCurrentPage(1)
      setTotalPages(1)
      setTotalJobs(getSampleJobs().length)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
      setInitialLoading(false)
    }
  }, [searchTerm, selectedLocation, jobsPerPage])

  // Fetch all quantum jobs from MongoDB backend
  const fetchQuantumJobs = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
        setError(null)
      }
      
      const params = {
        keyword: searchTerm,
        location: selectedLocation === 'all' ? '' : selectedLocation,
        page: 1,
        limit: 50
      }

      const data = await quantumJobsApi.getAll(params)
      
      if (data.jobs && data.jobs.length > 0) {
        const formattedJobs = data.jobs.map(formatJobData)
        setQuantumJobs(formattedJobs)
        setError(null)
        console.log(`Fetched ${formattedJobs.length} quantum jobs from MongoDB (${data.source || 'database'})`)
      } else {
        setError('No quantum jobs found in database')
        setQuantumJobs([])
      }
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch quantum jobs from database')
      console.error('Error fetching quantum jobs:', err)
      setError(errorMessage)
      // Fallback to sample data
      setQuantumJobs(getSampleJobs())
    } finally {
      if (showLoading) {
        setLoading(false)
      }
      setInitialLoading(false)
    }
  }, [searchTerm, selectedLocation])

  // Real-time scraping function
  const fetchRealTimeJobs = useCallback(() => {
    fetchIbmJobs(true, true)
  }, [fetchIbmJobs])

  // IBM India specific jobs from MongoDB (with optional scraping)
  const fetchIBMIndiaJobs = useCallback(async (shouldScrape = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        keyword: searchTerm || 'engineer',
        limit: 20
      }

      let data
      if (shouldScrape) {
        // Use scraping endpoint (saves to MongoDB)
        data = await ibmJobsApi.scrapeIndia(params)
      } else {
        // Get India jobs from MongoDB
        data = await ibmJobsApi.getIndiaJobs(params)
      }
      
      let jobs = []
      if (data.jobs && data.jobs.length > 0) {
        jobs = data.jobs.map(formatJobData)
        console.log(`Fetched ${jobs.length} IBM India jobs from MongoDB`)
        if (data.newJobsSaved) {
          console.log(`${data.newJobsSaved} new jobs saved to database`)
        }
      } else if (Array.isArray(data) && data.length > 0) {
        // Handle direct array response from /india endpoint
        jobs = data.map(formatJobData)
        console.log(`Fetched ${jobs.length} IBM India jobs from MongoDB`)
      }

      if (jobs.length > 0) {
        setIbmJobs(jobs)
        setError(null)
      } else {
        setError('No IBM India jobs found in database')
        setIbmJobs([])
      }
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch IBM India jobs from database')
      console.error('Error fetching IBM India jobs:', err)
      setError(errorMessage)
      setIbmJobs(getSampleJobs())
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  // Initial data load - only run once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true)
      // Load both job types initially but don't show loading for inactive tab
      await Promise.all([
        fetchIbmJobs(false, activeJobType === 'ibm'),
        fetchQuantumJobs(activeJobType === 'quantum')
      ])
      setInitialLoading(false)
    }
    
    loadInitialData()
  }, []) // Empty dependency array - only run once

  // Handle tab switching
  const handleTabChange = useCallback((jobType) => {
    setActiveJobType(jobType)
    setError(null) // Clear any existing errors when switching tabs
    setCurrentPage(1) // Reset to first page when switching tabs
  }, [])

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      if (activeJobType === 'ibm') {
        fetchIbmJobs(false, true, newPage)
      } else {
        fetchQuantumJobs(true)
      }
    }
  }, [totalPages, activeJobType, fetchIbmJobs, fetchQuantumJobs])

  // Debounced search effect
  useEffect(() => {
    if (initialLoading) return // Don't search during initial load
    
    const timeoutId = setTimeout(() => {
      setIsSearching(true)
      setCurrentPage(1) // Reset to first page when searching
      if (activeJobType === 'ibm') {
        fetchIbmJobs(false, true, 1).finally(() => setIsSearching(false))
      } else {
        fetchQuantumJobs(true).finally(() => setIsSearching(false))
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedLocation, activeJobType, fetchIbmJobs, fetchQuantumJobs, initialLoading])

  // Memoized filtered jobs to prevent unnecessary re-renders
  const filteredJobs = useMemo(() => {
    const jobs = activeJobType === 'ibm' ? ibmJobs : quantumJobs
    return jobs.filter(job => {
      const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
      return matchesCategory
    })
  }, [activeJobType, ibmJobs, quantumJobs, selectedCategory])

  // Determine if we should show loading state
  const isLoading = initialLoading || loading || isSearching

  return (
    <div >
      {/* Header Section */}
      <div className='relative select-none z-10 text-center py-12 px-6'>
        <h1 className='text-6xl font-bold text-white mb-4 drop-shadow-2xl'>
          Find Your <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Dream Job</span>
        </h1>
        <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
          Discover amazing career opportunities from top companies and kickstart your professional journey.
        </p>
        
        {/* Job Type Tabs */}
        <div className="max-w-md mx-auto mb-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-white/10 backdrop-blur-lg p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white transition-all duration-200
                  ${selected ? 'bg-gradient-to-r from-blue-500/70 to-purple-500/70 shadow' : 'hover:bg-white/10'}`
                }
                onClick={() => handleTabChange('ibm')}
              >
                IBM Jobs
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-white transition-all duration-200
                  ${selected ? 'bg-gradient-to-r from-purple-500/70 to-pink-500/70 shadow' : 'hover:bg-white/10'}`
                }
                onClick={() => handleTabChange('quantum')}
              >
                Quantum Jobs
              </Tab>
            </Tab.List>
          </Tab.Group>
        </div>
      </div>

      {/* Search and Filters */}
      <div className='relative select-none z-10 scale-80 px-6 mb-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='grid md:grid-cols-4 gap-6'>
              {/* Search Input */}
              <div className='md:col-span-2 relative'>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                />
                {isSearching && (
                  <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                    <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white/70'></div>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                >
                  <option value="all" className='bg-gray-800'>All Categories</option>
                  <option value="technology" className='bg-gray-800'>Technology</option>
                  <option value="marketing" className='bg-gray-800'>Marketing</option>
                  <option value="finance" className='bg-gray-800'>Finance</option>
                  <option value="design" className='bg-gray-800'>Design</option>
                  <option value="hr" className='bg-gray-800'>Human Resources</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                >
                  <option value="all" className='bg-gray-800'>All Locations</option>
                  <option value="Bangalore" className='bg-gray-800'>Bangalore</option>
                  <option value="Hyderabad" className='bg-gray-800'>Hyderabad</option>
                  <option value="Mumbai" className='bg-gray-800'>Mumbai</option>
                  <option value="Delhi" className='bg-gray-800'>Delhi</option>
                  <option value="Pune" className='bg-gray-800'>Pune</option>
                  <option value="Chennai" className='bg-gray-800'>Chennai</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className='relative select-none z-10 px-6 pb-20'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-3xl font-bold text-white'>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  Loading Jobs...
                </span>
              ) : (
                `${filteredJobs.length} Job${filteredJobs.length !== 1 ? 's' : ''} Found`
              )}
            </h2>
            <div className='flex items-center gap-4'>
              <div className='text-white/70'>
                {!isLoading && activeJobType === 'ibm' && totalJobs > 0 && (
                  `Page ${currentPage} of ${totalPages} (${totalJobs} total jobs)`
                )}
                {!isLoading && activeJobType === 'quantum' && (
                  `Showing ${filteredJobs.length} of ${quantumJobs.length} jobs`
                )}
              </div>
              {activeJobType === 'ibm' ? (
                <>
                  <button 
                    onClick={() => fetchIbmJobs(false, true, currentPage)}
                    disabled={isLoading}
                    className='bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 disabled:opacity-50'
                  >
                    {isLoading ? '🔄' : '🔄'} Refresh IBM Jobs
                  </button>
                  <button 
                    onClick={fetchRealTimeJobs}
                    disabled={isLoading}
                    className='bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-500/40 transition-all duration-300 disabled:opacity-50'
                  >
                    🔴 Live Scrape
                  </button>
                  <button 
                    onClick={() => fetchIBMIndiaJobs(false)}
                    disabled={isLoading}
                    className='bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600/40 transition-all duration-300 disabled:opacity-50'
                  >
                    🇮🇳 IBM India
                  </button>
                  <button 
                    onClick={() => fetchIBMIndiaJobs(true)}
                    disabled={isLoading}
                    className='bg-gradient-to-r from-orange-600/30 to-red-600/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-orange-600/40 transition-all duration-300 disabled:opacity-50'
                  >
                    🔥 Scrape India
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => fetchQuantumJobs(true)}
                  disabled={isLoading}
                  className='bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-purple-500/40 transition-all duration-300 disabled:opacity-50'
                >
                  🔬 Refresh Quantum Jobs
                </button>
              )}
            </div>
          </div>

          {isLoading && filteredJobs.length === 0 ? (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Skeleton loading cards */}
              {[...Array(6)].map((_, index) => (
                <div key={index} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl animate-pulse'>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex-1'>
                      <div className='h-6 bg-white/20 rounded mb-2 w-3/4'></div>
                      <div className='h-4 bg-white/20 rounded mb-1 w-1/2'></div>
                      <div className='h-4 bg-white/20 rounded w-1/3'></div>
                    </div>
                    <div className='text-right'>
                      <div className='h-6 bg-white/20 rounded mb-2 w-16'></div>
                      <div className='h-3 bg-white/20 rounded w-12'></div>
                    </div>
                  </div>
                  <div className='h-4 bg-white/20 rounded mb-2 w-full'></div>
                  <div className='h-4 bg-white/20 rounded mb-4 w-2/3'></div>
                  <div className='flex gap-2 mb-4'>
                    <div className='h-6 bg-white/20 rounded-full w-16'></div>
                    <div className='h-6 bg-white/20 rounded-full w-20'></div>
                    <div className='h-6 bg-white/20 rounded-full w-14'></div>
                  </div>
                  <div className='flex justify-between items-center mb-6'>
                    <div>
                      <div className='h-5 bg-white/20 rounded mb-1 w-20'></div>
                      <div className='h-3 bg-white/20 rounded w-16'></div>
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div className='flex-1 h-12 bg-white/20 rounded-2xl'></div>
                    <div className='h-12 w-16 bg-white/20 rounded-2xl'></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error && filteredJobs.length === 0 ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>⚠️</div>
              <h3 className='text-3xl font-bold text-white mb-4'>Unable to Load Jobs</h3>
              <p className='text-white/70 text-lg mb-6'>{error}</p>
              <button 
                onClick={() => activeJobType === 'ibm' ? fetchIbmJobs(false, true, 1) : fetchQuantumJobs(true)}
                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300'
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className='relative'>
              {/* Show loading overlay when searching */}
              {isLoading && filteredJobs.length > 0 && (
                <div className='absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center'>
                  <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2'></div>
                    <p className='text-white font-medium'>Updating jobs...</p>
                  </div>
                </div>
              )}
              
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {filteredJobs.map(job => (
                <div key={job.id} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-white/15'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold text-white mb-2'>{job.title}</h3>
                    <p className='text-purple-300 text-lg mb-1'>{job.company || 'IBM'}</p>
                    <div className='flex items-center gap-2 text-white/70 mb-2'>
                      <span>📍</span>
                      <span>{job.location || 'Remote'}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-3 py-1 rounded-full text-white text-sm mb-2'>
                      {job.type || 'Full-time'}
                    </div>
                    <div className='text-white/70 text-sm'>{job.posted || 'Recent'}</div>
                  </div>
                </div>

                <p className='text-white/80 mb-4 line-clamp-2'>{job.description || 'No description available'}</p>

                <div className='mb-4'>
                  <div className='flex flex-wrap gap-2'>
                    {(job.skills && Array.isArray(job.skills) ? job.skills : []).map((skill, index) => (
                      <span key={index} className='bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-3 py-1 rounded-full text-white text-sm'>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <div className='text-white font-bold text-lg'>{job.salary || 'Competitive'}</div>
                    <div className='text-white/70 text-sm'>{job.experience || 'Not specified'}</div>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <a 
                    href={job.url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-center'
                  >
                    Apply Now
                  </a>
                  <button className='bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-6 rounded-2xl hover:bg-white/30 transition-all duration-300'>
                    Save
                  </button>
                </div>
                </div>
                ))}
              </div>
            </div>
          )}

          {filteredJobs.length === 0 && !isLoading && !error && (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-3xl font-bold text-white mb-4'>No Jobs Found</h3>
              <p className='text-white/70 text-lg'>Try adjusting your search criteria or filters.</p>
            </div>
          )}

          {/* Pagination Component */}
          {!isLoading && !error && filteredJobs.length > 0 && activeJobType === 'ibm' && totalPages > 1 && (
            <div className='flex justify-center items-center mt-12 mb-8'>
              <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4'>
                <div className='flex items-center gap-2'>
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    ← Previous
                  </button>

                  {/* Page Numbers */}
                  <div className='flex items-center gap-1 mx-4'>
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className='w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-white/30 transition-all duration-300'
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className='text-white/70 px-2'>...</span>}
                      </>
                    )}

                    {/* Current page and neighbors */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg backdrop-blur-sm border font-medium transition-all duration-300 ${
                            pageNum === currentPage
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white shadow-lg'
                              : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className='text-white/70 px-2'>...</span>}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className='w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-white/30 transition-all duration-300'
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Next →
                  </button>
                </div>

                {/* Page Info */}
                <div className='text-center mt-3 text-white/70 text-sm'>
                  Showing {((currentPage - 1) * jobsPerPage) + 1} to {Math.min(currentPage * jobsPerPage, totalJobs)} of {totalJobs} jobs
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {/* <div className='relative z-10 py-20 px-6 bg-black/20 backdrop-blur-lg border-t border-white/20'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-8 text-center'>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
              <div className='text-4xl font-bold text-white mb-2'>500+</div>
              <div className='text-purple-300'>Active Jobs</div>
            </div>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
              <div className='text-4xl font-bold text-white mb-2'>200+</div>
              <div className='text-purple-300'>Partner Companies</div>
            </div>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
              <div className='text-4xl font-bold text-white mb-2'>10,000+</div>
              <div className='text-purple-300'>Students Placed</div>
            </div>
            <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
              <div className='text-4xl font-bold text-white mb-2'>95%</div>
              <div className='text-purple-300'>Success Rate</div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default JobsPage