import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FaSpinner, FaCalendarAlt, FaUser, FaSearch, FaScribd, FaLaptopCode, FaTerminal, FaAward, FaHandPeace } from 'react-icons/fa'
 
const Rss = () => {
  const navigate = useNavigate()
  const [feeds, setFeeds] = useState([])
  const [sources, setSources] = useState([])
  const [selectedSource, setSelectedSource] = useState('quantum')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRssFeeds = async (source = selectedSource, search = searchQuery) => {
    setLoading(true)
    setError(null)
    try {
      // Build URL with query parameters
      let url = "http://localhost:3000/api/news/rss"
      const params = new URLSearchParams()
      
      if (source) {
        params.append('source', source)
      }
      
      if (search && search.trim() !== '') {
        params.append('search', search.trim())
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await axios.get(url)
      
      if (response.data.message === 'success') {
        setFeeds(response.data.data)
        
        // Set available sources if provided
        if (response.data.sources && response.data.sources.length > 0) {
          setSources(response.data.sources)
        }
      } else {
        setError('Failed to fetch RSS feeds')
      }
    } catch (err) {
      setError('Error connecting to RSS feed service')
      console.error('RSS feed error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRssFeeds(selectedSource, searchQuery)
  }, [selectedSource, searchQuery])

  const handleSourceChange = (source) => {
    setSelectedSource(source)
  }
  
  const handleSearch = (e) => {
    e.preventDefault()
    fetchRssFeeds(selectedSource, searchQuery)
  }

  const navigateToNewsDetail = (feed) => {
    // Include source parameter in the URL if available
    if (feed.source) {
      navigate(`/news/${feed.id}?source=${feed.source}`)
    } else {
      navigate(`/news/${feed.id}`)
    }
  }

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Source icon mapping
  const sourceIcons = {
    quantum: <FaScribd className="text-blue-500" />,
    programming: <FaLaptopCode className="text-green-500" />,
    tech: <FaTerminal className="text-purple-500" />,
    ai: <FaAward className="text-red-500" />,
    science: <FaHandPeace className="text-yellow-500" />
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-white/10">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
            Latest News
          </h1>
          <button 
            onClick={fetchRssFeeds}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-purple-900/30 font-medium"
            disabled={loading}
          >
            <FaSpinner className={loading ? "animate-spin" : ""} /> {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
        
        {/* Search and filter section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Source selection */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSourceChange('quantum')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${selectedSource === 'quantum' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 dark:bg-gray-700 text-gray-200'}`}
              >
                <FaScribd /> Quantum
              </button>
              <button
                onClick={() => handleSourceChange('programming')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${selectedSource === 'programming' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 dark:bg-gray-700 text-gray-200'}`}
              >
                <FaLaptopCode className="text-green-500" /> Programming
              </button>
              <button
                onClick={() => handleSourceChange('tech')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${selectedSource === 'tech' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 dark:bg-gray-700 text-gray-200'}`}
              >
                <FaTerminal className="text-purple-500" /> Tech
              </button>
              <button
                onClick={() => handleSourceChange('ai')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${selectedSource === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 dark:bg-gray-700 text-gray-200'}`}
              >
                <FaAward className="text-red-500" /> AI
              </button>
              <button
                onClick={() => handleSourceChange('science')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors ${selectedSource === 'science' ? 'bg-purple-600 text-white' : 'bg-gray-800/50 dark:bg-gray-700 text-gray-200'}`}
              >
                <FaHandPeace className="text-yellow-500" /> Science
              </button>
            </div>
            
            {/* Search input */}
            <form onSubmit={handleSearch} className="flex-1 flex">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for topics or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-white/10 rounded-l-md bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* Current source indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Current source:</span>
            <div className="flex items-center gap-1">
              {sourceIcons[selectedSource]}
              <span className="capitalize">{selectedSource}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-pink-600 border-l-transparent rounded-full animate-spin shadow-lg"></div>
            <p className="text-purple-300 animate-pulse font-medium">Loading latest news...</p>
          </div>
        ) : error ? (
          <div className="bg-gradient-to-br from-red-900/30 to-black/30 backdrop-blur-sm border border-red-500/50 rounded-xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-red-200 text-lg font-medium mb-2">{error}</p>
            <p className="text-gray-400 mb-6">Unable to load the news feed. Please try again.</p>
            <button 
              onClick={fetchRssFeeds}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-lg transition-all font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feeds.map((feed, index) => (
              <motion.div 
                key={feed.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full flex flex-col transform hover:-translate-y-1"
                onClick={() => navigateToNewsDetail(feed)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Source indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    {feed.source && sourceIcons[feed.source] ? (
                      <>
                        {sourceIcons[feed.source]}
                        <span className="text-xs text-gray-400 capitalize">{feed.source}</span>
                      </>
                    ) : (
                      <>
                        <FiAtom className="text-blue-500" />
                        <span className="text-xs text-gray-400">Quantum</span>
                      </>
                    )}
                  </div>
                  
                  <h2 className="text-xl text-white font-semibold mb-4 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {feed.title}
                  </h2>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-300 border-t border-white/10 pt-4">
                    {feed.pubDate && (
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-purple-400" />
                        <span>{new Date(feed.pubDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FaUser className="text-purple-400" />
                      <span>{feed.author}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}


      </div>
    </div>
  )
}

export default Rss