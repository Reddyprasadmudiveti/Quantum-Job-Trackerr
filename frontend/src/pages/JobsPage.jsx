import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch IBM jobs from backend with real-time scraping
  const fetchJobs = async (useRealTime = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        keyword: searchTerm,
        location: selectedLocation === 'all' ? '' : selectedLocation,
        page: 1,
        limit: 20
      })

      // Use real-time endpoint if requested
      const endpoint = useRealTime ? 'realtime' : ''
      const response = await fetch(`http://localhost:3001/api/ibm-jobs/${endpoint}?${params}`)
      const data = await response.json()
      
      if (data.jobs) {
        setJobs(data.jobs)
        setError(null)
        console.log(`Fetched ${data.jobs.length} jobs from ${data.source || 'backend'}`)
      } else {
        setError('No jobs found')
        setJobs([])
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError('Failed to fetch jobs')
      // Fallback to sample data
      setJobs(getSampleJobs())
    } finally {
      setLoading(false)
    }
  }

  // Real-time scraping function
  const fetchRealTimeJobs = () => {
    fetchJobs(true)
  }

  // IBM India specific scraping
  const fetchIBMIndiaJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        keyword: searchTerm || 'engineer',
        limit: 20
      })

      const response = await fetch(`http://localhost:3001/api/ibm-jobs/india-scrape?${params}`)
      const data = await response.json()
      
      if (data.jobs) {
        setJobs(data.jobs)
        setError(null)
        console.log(`Fetched ${data.jobs.length} jobs from IBM India scraping`)
      } else {
        setError('No jobs found from IBM India')
        setJobs([])
      }
    } catch (err) {
      console.error('Error fetching IBM India jobs:', err)
      setError('Failed to fetch IBM India jobs')
      setJobs(getSampleJobs())
    } finally {
      setLoading(false)
    }
  }

  // Use effect to fetch jobs when component mounts or search parameters change
  useEffect(() => {
    fetchJobs()
  }, [searchTerm, selectedLocation])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        fetchJobs()
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Filter jobs based on category (search and location are handled by API)
  const filteredJobs = jobs.filter(job => {
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory
    return matchesCategory
  })

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
      </div>

      {/* Search and Filters */}
      <div className='relative select-none z-10 scale-80 px-6 mb-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='grid md:grid-cols-4 gap-6'>
              {/* Search Input */}
              <div className='md:col-span-2'>
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                />
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
              {loading ? 'Loading...' : `${filteredJobs.length} IBM Job${filteredJobs.length !== 1 ? 's' : ''} Found`}
            </h2>
            <div className='flex items-center gap-4'>
              <div className='text-white/70'>
                {!loading && `Showing ${filteredJobs.length} of ${jobs.length} jobs`}
              </div>
              <button 
                onClick={() => fetchJobs(false)}
                disabled={loading}
                className='bg-gradient-to-r from-green-500/30 to-blue-500/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-green-500/40 transition-all duration-300 disabled:opacity-50'
              >
                🔄 Refresh
              </button>
              <button 
                onClick={fetchRealTimeJobs}
                disabled={loading}
                className='bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-red-500/40 transition-all duration-300 disabled:opacity-50'
              >
                🔴 Live Scrape
              </button>
              <button 
                onClick={() => fetchIBMIndiaJobs()}
                disabled={loading}
                className='bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-sm border border-white/30 text-white font-bold py-2 px-4 rounded-xl hover:bg-blue-600/40 transition-all duration-300 disabled:opacity-50'
              >
                🇮🇳 IBM India
              </button>
            </div>
          </div>

          {loading ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>⏳</div>
              <h3 className='text-3xl font-bold text-white mb-4'>Loading IBM Jobs...</h3>
              <p className='text-white/70 text-lg'>Fetching the latest opportunities from IBM careers portal.</p>
            </div>
          ) : error ? (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>⚠️</div>
              <h3 className='text-3xl font-bold text-white mb-4'>Unable to Load Jobs</h3>
              <p className='text-white/70 text-lg mb-6'>{error}</p>
              <button 
                onClick={fetchJobs}
                className='bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300'
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredJobs.map(job => (
              <div key={job.id} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-white/15'>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex-1'>
                    <h3 className='text-2xl font-bold text-white mb-2'>{job.title}</h3>
                    <p className='text-purple-300 text-lg mb-1'>{job.company}</p>
                    <div className='flex items-center gap-2 text-white/70 mb-2'>
                      <span>📍</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='bg-gradient-to-r from-blue-500/30 to-purple-500/30 px-3 py-1 rounded-full text-white text-sm mb-2'>
                      {job.type}
                    </div>
                    <div className='text-white/70 text-sm'>{job.posted}</div>
                  </div>
                </div>

                <p className='text-white/80 mb-4 line-clamp-2'>{job.description}</p>

                <div className='mb-4'>
                  <div className='flex flex-wrap gap-2'>
                    {job.skills.map(skill => (
                      <span key={skill} className='bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-3 py-1 rounded-full text-white text-sm'>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className='flex justify-between items-center mb-6'>
                  <div>
                    <div className='text-white font-bold text-lg'>{job.salary}</div>
                    <div className='text-white/70 text-sm'>{job.experience}</div>
                  </div>
                </div>

                <div className='flex gap-3'>
                  <a 
                    href={job.url || 'https://careers.ibm.com'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 text-center'
                  >
                    Apply at IBM
                  </a>
                  <button className='bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-6 rounded-2xl hover:bg-white/30 transition-all duration-300'>
                    Save
                  </button>
                </div>
              </div>
              ))}
            </div>
          )}

          {filteredJobs.length === 0 && (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🔍</div>
              <h3 className='text-3xl font-bold text-white mb-4'>No Jobs Found</h3>
              <p className='text-white/70 text-lg'>Try adjusting your search criteria or filters.</p>
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