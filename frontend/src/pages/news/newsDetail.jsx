import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExternalLinkAlt, FaArrowCircleLeft, FaCalendarAlt, FaUser, FaScribd, FaLaptopCode, FaTerminal, FaAward, FaHandPeace, FaShare, FaBookmark, FaHeart, FaEye, FaClock, FaImage, FaExpand } from 'react-icons/fa'

const NewsDetail = () => {
  const { id } = useParams()
  const [feed, setFeed] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [readingTime, setReadingTime] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageError, setImageError] = useState({})
  
  // Source icon mapping
  const sourceIcons = {
    quantum: <FaScribd className="text-blue-400" />,
    programming: <FaLaptopCode className="text-green-400" />,
    tech: <FaTerminal className="text-purple-400" />,
    ai: <FaAward className="text-red-400" />,
    science: <FaHandPeace className="text-yellow-400" />
  }

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // Handle image error
  const handleImageError = (imageSrc) => {
    setImageError(prev => ({ ...prev, [imageSrc]: true }))
  }

  // Handle image click for modal
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc)
  }

  // Close image modal
  const closeImageModal = () => {
    setSelectedImage(null)
  }

  // Extract images from content
  const extractImages = (content) => {
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    const images = []
    let match
    while ((match = imgRegex.exec(content)) !== null) {
      images.push(match[1])
    }
    return images
  }

  // Remove images from content
  const removeImagesFromContent = (content) => {
    return content.replace(/<img[^>]*>/g, '')
  }

  useEffect(() => {
    const fetchFeedDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const source = urlParams.get('source')
        
        let url = `http://localhost:3000/api/news/rss/${id}`
        if (source) {
          url += `?source=${source}`
        }
        
        const response = await axios.get(url)
        if (response.data.message === 'success') {
          setFeed(response.data.data)
          setReadingTime(calculateReadingTime(response.data.data.content))
        } else {
          setError('Failed to fetch news details')
        }
      } catch (err) {
        setError('Error connecting to news service')
        console.error('News detail error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedDetail()
  }, [id])

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

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const shareToSocial = (platform) => {
    const url = window.location.href
    const title = feed?.title || 'Check out this article'
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    setShowShareMenu(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareMenu(false)
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/news" 
            className="inline-flex items-center gap-3 text-white/80 hover:text-white mb-4 group transition-all duration-300 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:border-purple-400/50"
            >
            <FaArrowCircleLeft className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to News</span>
            </Link>
        </motion.div>
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-center items-center h-96 gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-t-purple-500 border-r-transparent border-b-pink-500 border-l-transparent rounded-full animate-spin shadow-2xl"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-t-transparent border-r-blue-500 border-b-transparent border-l-cyan-500 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <div className="text-center">
              <p className="text-purple-300 animate-pulse font-medium text-lg mb-2">Loading news details...</p>
              <p className="text-white/60 text-sm">Please wait while we fetch the content</p>
                  </div>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-900/40 to-red-800/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-10 text-center shadow-2xl"
                >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-red-200 text-xl font-bold mb-3">Oops! Something went wrong</h3>
            <p className="text-red-300/80 text-lg font-medium mb-2">{error}</p>
            <p className="text-gray-400 mb-8">Unable to load the news details. Please try again later.</p>
            <Link 
              to="/news"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 inline-block transform hover:scale-105"
            >
              Return to News
            </Link>
          </motion.div>
        ) : feed ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-white/10 via-purple-900/20 to-pink-900/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl shadow-purple-500/10 overflow-hidden"
          >
            {/* Header Section */}
            <div className="relative p-8 md:p-12 border-b border-white/10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 leading-tight tracking-tight mb-8"
              >
                {feed.title}
              </motion.h1>
              
              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 right-8 flex gap-3"
              >
                <div className="relative">
                <button
                    onClick={handleShare}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <FaShare className="text-white/80 hover:text-white" />
                  </button>
                  <AnimatePresence>
                    {showShareMenu && (
          <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute top-full right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-3 min-w-[200px] shadow-xl z-50"
          >
                        <div className="space-y-2">
                          <button onClick={() => shareToSocial('twitter')} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white">
                            Share on Twitter
                          </button>
                          <button onClick={() => shareToSocial('facebook')} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white">
                            Share on Facebook
                          </button>
                          <button onClick={() => shareToSocial('linkedin')} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white">
                            Share on LinkedIn
                          </button>
                          <button onClick={copyToClipboard} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white">
                            Copy Link
                          </button>
              </div>
          </motion.div>
        )}
                  </AnimatePresence>
      </div>
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-3 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 ${
                    isBookmarked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  <FaBookmark />
                </button>
                
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110 ${
                    isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                  }`}
                >
                  <FaHeart />
                </button>
              </motion.div>

              {/* Source and Categories */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                {feed.source && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium shadow-lg border border-purple-400/30">
                      {sourceIcons[feed.source] || <FaTerminal className="text-blue-400" />}
                      <span className="capitalize font-semibold">{feed.sourceName || feed.source}</span>
    </div>
                  </div>
                )}
                
                {feed.categories && feed.categories.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {feed.categories.map((category, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-purple-200 px-4 py-2 rounded-full font-medium shadow-sm border border-purple-400/30 hover:border-purple-300/50 transition-all duration-300 hover:scale-105"
                      >
                        {category}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
              
              {/* Meta Information */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-300"
              >
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <FaUser className="text-purple-300" size={16} />
                  <span className="font-medium">{feed.author || 'Unknown Author'}</span>
                </div>
                {feed.pubDate && (
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                    <FaCalendarAlt className="text-purple-300" size={16} />
                    <span className="font-medium">{formatDate(feed.pubDate)}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <FaClock className="text-purple-300" size={16} />
                  <span className="font-medium">{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <FaEye className="text-purple-300" size={16} />
                  <span className="font-medium">Reading now</span>
                </div>
                {extractImages(feed.content).length > 0 && (
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                    <FaImage className="text-purple-300" size={16} />
                    <span className="font-medium">{extractImages(feed.content).length} images</span>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Images Section */}
            {(feed.image || extractImages(feed.content).length > 0) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="p-8 md:p-12 border-b border-white/10"
            >
                {/* Featured Image */}
                {feed.image && !imageError[feed.image] && (
                  <div className="mb-8 relative group cursor-pointer" onClick={() => handleImageClick(feed.image)}>
                    <img 
                      src={feed.image} 
                      alt={feed.title}
                      className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
                      onError={() => handleImageError(feed.image)}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl flex items-center justify-center">
                      <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl" />
              </div>
                  </div>
                )}

                {/* Content Images */}
                {extractImages(feed.content).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {extractImages(feed.content).map((imageSrc, index) => (
                      !imageError[imageSrc] && imageSrc !== feed.image && (
                        <div key={index} className="relative group cursor-pointer" onClick={() => handleImageClick(imageSrc)}>
                          <img 
                            src={imageSrc} 
                            alt={`Content image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
                            onError={() => handleImageError(imageSrc)}
                            loading="lazy"
              />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl flex items-center justify-center">
                            <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xl" />
    </div>
                        </div>
  )
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Content Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-8 md:p-12"
            >
              <div 
                className="prose prose-xl prose-invert max-w-none
                text-white
                  prose-headings:text-white prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8
                  prose-p:text-gray-200 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
                  prose-strong:text-white prose-strong:font-semibold
                  prose-li:text-gray-200 prose-li:mb-2
                  prose-blockquote:border-l-purple-400 prose-blockquote:bg-white/5 prose-blockquote:backdrop-blur-sm prose-blockquote:rounded-r-xl prose-blockquote:border-r prose-blockquote:border-t prose-blockquote:border-b prose-blockquote:border-white/10
                  prose-code:bg-purple-900/30 prose-code:text-purple-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:border prose-code:border-purple-500/30"
                dangerouslySetInnerHTML={{ 
                  __html: removeImagesFromContent(feed.content)
                    .replace(/<p>/g, '<p class="hover:text-white transition-colors duration-300">')
                    .replace(/<h([1-6])>/g, '<h$1 class="hover:text-purple-200 transition-colors duration-300">')
                }}
              />
            </motion.div>

            {/* Footer Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="p-8 md:p-12 pt-0 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/10"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isLiked 
                      ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                      : 'bg-white/5 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <FaHeart />
                  <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
                </button>
                
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isBookmarked 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' 
                      : 'bg-white/5 text-white/70 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <FaBookmark />
                  <span className="font-medium">{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              
              <a 
                href={feed.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-purple-900/40 border border-purple-400/30 text-lg hover:scale-105 transform"
              >
                <span>Read Full Article</span>
                <FaExternalLinkAlt />
              </a>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-yellow-900/40 to-orange-800/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-10 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m6 0V7a2 2 0 01-2 2H9a2 2 0 01-2-2V6.306"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-yellow-200 text-xl font-bold mb-3">Article Not Found</h3>
            <p className="text-yellow-300/80 text-lg font-medium mb-8">The news article you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/news"
              className="bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-500 hover:to-orange-400 text-white px-8 py-3 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-yellow-500/25 inline-block transform hover:scale-105"
            >
              Return to News
            </Link>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                onError={() => {
                  handleImageError(selectedImage)
                  closeImageModal()
                }}
              />
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NewsDetail