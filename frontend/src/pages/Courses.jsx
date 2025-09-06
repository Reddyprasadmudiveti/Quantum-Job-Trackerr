import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const Courses = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [savedCourses, setSavedCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [courseCategories, setCourseCategories] = useState([])
  const [courseLevels, setCourseLevels] = useState([])

  // Fetch courses and metadata from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch courses and metadata in parallel
        const [coursesResponse, metadataResponse] = await Promise.all([
          fetch('http://localhost:3000/api/courses'),
          fetch('http://localhost:3000/api/courses/metadata')
        ])
        
        if (!coursesResponse.ok || !metadataResponse.ok) {
          throw new Error('Failed to fetch data')
        }
        
        const [coursesData, metadataData] = await Promise.all([
          coursesResponse.json(),
          metadataResponse.json()
        ])
        
        // Format the courses data to match frontend expectations
        const formattedCourses = coursesData.map(course => ({
          id: course._id,
          title: course.title,
          category: course.category,
          level: course.level,
          duration: course.duration,
          credits: course.credits,
          description: course.description,
          instructor: course.instructor,
          students: course.students,
          rating: course.rating,
          price: course.price,
          image: course.imageUrl,
          skills: course.skills,
          prerequisites: course.prerequisites
        }))
        
        setCourses(formattedCourses)
        setCourseCategories(metadataData.categories)
        setCourseLevels(metadataData.levels)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

const onBtnClick = (id) => {
  navigate(`/course/${id}`)
  //redirected to course.jsx
}

const handleSaveCourse = (courseId) => {
  setSavedCourses(prev => {
    if (prev.includes(courseId)) {
      return prev.filter(id => id !== courseId)
    } else {
      return [...prev, courseId]
    }
  })
}

  // Filter courses based on selected category and level
  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    return matchesCategory && matchesLevel
  })

  return (
   <div>

      {/* Header Section */}
      <div className='relative z-10 text-center py-12 px-6'>
        <h1 className='text-6xl select-none font-bold text-white mb-4 drop-shadow-2xl'>
          Explore Our <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Courses</span>
        </h1>
        <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
          Discover world-class education programs designed to shape your future and advance your career.
        </p>
      </div>

      {/* Filters Section */}
      <div className='relative z-10 px-6 mb-12'>
        <div className='max-w-4xl flex flex-col mx-auto'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Category Filter */}
              <div>
                <label className='block text-white  font-semibold mb-3'>Course Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                >
                  {courseCategories.map(category => (
                    <option key={category.value} value={category.value} className='bg-gray-800'>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className='block text-white font-semibold mb-3'>Course Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className='w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300'
                >
                  {courseLevels.map(level => (
                    <option key={level.value} value={level.value} className='bg-gray-800'>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
               <button className='w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl text-white font-semibold shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center'><span className='text-sm'>Reset Filters</span></button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className='relative z-10 px-6 pb-20'>
        <div className='max-w-7xl mx-auto'>
          {loading ? (
            <div className='text-center py-20'>
              <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4'></div>
              <h3 className='text-2xl font-bold text-white mb-2'>Loading Courses...</h3>
              <p className='text-white/70'>Fetching the latest course information</p>
            </div>
          ) : (
            <>
              <div className='flex justify-between items-center mb-8'>
                <h2 className='text-3xl font-bold text-white'>
                  {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Available
                </h2>
                <div className='text-white/70'>
                  Showing {filteredCourses.length} of {courses.length} courses
                </div>
              </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filteredCourses.map(course => (
              <div key={course.id} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-white/15 flex flex-col'>
                {/* Course Image */}
                <div className='relative h-48 overflow-hidden'>
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute top-4 right-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold'>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                  </div>
                  <div className='absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm'>
                    ⭐ {course.rating}
                  </div>
                </div>

                {/* Course Content */}
                <div className='p-6 flex flex-col flex-grow'>
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-xl font-bold text-white mb-2'>{course.title}</h3>
                    <div className='text-right'>
                      <div className='text-purple-300 font-bold text-lg'>{course.price}</div>
                    </div>
                  </div>

                  <p className='text-white/80 mb-4 line-clamp-3'>{course.description}</p>

                  <div className='flex items-center gap-4 mb-4 text-sm text-white/70'>
                    <div className='flex items-center gap-1'>
                      <span>👨‍🏫</span>
                      <span>{course.instructor}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span>👥</span>
                      <span>{course.students}</span>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 mb-4 text-sm text-white/70'>
                    <div className='flex items-center gap-1'>
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <span>🎓</span>
                      <span>{course.credits} Credits</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className='mb-4'>
                    <div className='flex flex-wrap gap-2'>
                      {course.skills.slice(0, 3).map(skill => (
                        <span key={skill} className='bg-gradient-to-r from-pink-500/30 to-purple-500/30 px-3 py-1 rounded-full text-white text-xs'>
                          {skill}
                        </span>
                      ))}
                      {course.skills.length > 3 && (
                        <span className='bg-gradient-to-r from-gray-500/30 to-gray-600/30 px-3 py-1 rounded-full text-white text-xs'>
                          +{course.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div className='mb-6 flex-grow'>
                    <h4 className='text-white font-semibold text-sm mb-2'>Prerequisites:</h4>
                    <p className='text-white/70 text-sm'>{course.prerequisites.join(', ')}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3 mt-auto'>
                    <button onClick={()=>onBtnClick(course.id)} className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300'>
                      Enroll Now
                    </button>
                    <button 
                      onClick={() => handleSaveCourse(course.id)}
                      className={`bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-4 rounded-2xl hover:bg-white/30 transition-all duration-300 ${savedCourses.includes(course.id) ? 'bg-green-500/30 border-green-400/50' : ''}`}
                    >
                      {savedCourses.includes(course.id) ? '💾 Saved' : '💾 Save'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

              {filteredCourses.length === 0 && !loading && (
                <div className='text-center py-20'>
                  <div className='text-6xl mb-4'>📚</div>
                  <h3 className='text-3xl font-bold text-white mb-4'>No Courses Found</h3>
                  <p className='text-white/70 text-lg'>Try adjusting your filters to see more courses.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Featured Video Section */}
      <div className='relative z-10 py-20 px-6 bg-black/20 backdrop-blur-lg border-t border-white/20'>
        <div className='max-w-6xl mx-auto text-center'>
          <h2 className='text-4xl font-bold text-white mb-8 drop-shadow-2xl'>
            Featured: <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Quantum Computing</span>
          </h2>
          <p className='text-white/80 mb-8 text-lg'>
            Discover the future of computing with our quantum computing program
          </p>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <iframe 
              width="100%" 
              height="480" 
              src="https://www.youtube.com/embed/B3U1NDUiwSA"
              title="Quantum Computers Explained: How Quantum Computing Works"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className='rounded-2xl'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses