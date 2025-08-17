import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')

  const courseCategories = [
    { value: 'all', label: 'All Courses' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'business', label: 'Business' },
    { value: 'arts', label: 'Arts & Literature' },
    { value: 'science', label: 'Sciences' },
    { value: 'quantum', label: 'Quantum Computing' }
  ]

  const courseLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'postgraduate', label: 'Postgraduate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'certificate', label: 'Certificate' }
  ]

  const courses = [
    {
      id: 1,
      title: 'Quantum Computing Fundamentals',
      category: 'quantum',
      level: 'postgraduate',
      duration: '6 months',
      credits: 6,
      description: 'Explore the fascinating world of quantum computing, quantum algorithms, and quantum information theory.',
      instructor: 'Dr. Rajesh Kumar',
      students: 45,
      rating: 4.9,
      price: '₹25,000',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      skills: ['Quantum Algorithms', 'Qiskit', 'Quantum Mechanics', 'Linear Algebra'],
      prerequisites: ['Linear Algebra', 'Basic Physics', 'Programming']
    },
    {
      id: 2,
      title: 'Artificial Intelligence & Machine Learning',
      category: 'computer-science',
      level: 'undergraduate',
      duration: '8 months',
      credits: 8,
      description: 'Master AI and ML concepts with hands-on projects using Python, TensorFlow, and real-world datasets.',
      instructor: 'Prof. Priya Sharma',
      students: 120,
      rating: 4.8,
      price: '₹30,000',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
      skills: ['Python', 'TensorFlow', 'Deep Learning', 'Neural Networks'],
      prerequisites: ['Programming Basics', 'Mathematics', 'Statistics']
    },
    {
      id: 3,
      title: 'Full Stack Web Development',
      category: 'computer-science',
      level: 'undergraduate',
      duration: '10 months',
      credits: 10,
      description: 'Learn modern web development with React, Node.js, databases, and cloud deployment.',
      instructor: 'Dr. Arjun Reddy',
      students: 200,
      rating: 4.7,
      price: '₹35,000',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'JavaScript'],
      prerequisites: ['HTML/CSS', 'JavaScript Basics']
    },
    {
      id: 4,
      title: 'Data Science & Analytics',
      category: 'computer-science',
      level: 'postgraduate',
      duration: '12 months',
      credits: 12,
      description: 'Comprehensive data science program covering statistics, machine learning, and big data technologies.',
      instructor: 'Dr. Meera Patel',
      students: 85,
      rating: 4.9,
      price: '₹40,000',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      skills: ['Python', 'R', 'SQL', 'Tableau', 'Big Data', 'Statistics'],
      prerequisites: ['Mathematics', 'Programming', 'Statistics']
    },
    {
      id: 5,
      title: 'Mechanical Engineering Design',
      category: 'engineering',
      level: 'undergraduate',
      duration: '4 years',
      credits: 160,
      description: 'Complete mechanical engineering program with focus on design, manufacturing, and automation.',
      instructor: 'Prof. Suresh Kumar',
      students: 150,
      rating: 4.6,
      price: '₹2,50,000',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      skills: ['CAD Design', 'Manufacturing', 'Thermodynamics', 'Materials Science'],
      prerequisites: ['Physics', 'Mathematics', 'Chemistry']
    },
    {
      id: 6,
      title: 'Digital Marketing & E-Commerce',
      category: 'business',
      level: 'diploma',
      duration: '6 months',
      credits: 6,
      description: 'Learn digital marketing strategies, SEO, social media marketing, and e-commerce management.',
      instructor: 'Ms. Kavya Nair',
      students: 180,
      rating: 4.5,
      price: '₹20,000',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      skills: ['SEO', 'Social Media', 'Google Ads', 'Analytics', 'Content Marketing'],
      prerequisites: ['Basic Computer Skills']
    },
    {
      id: 7,
      title: 'Creative Writing & Literature',
      category: 'arts',
      level: 'undergraduate',
      duration: '3 years',
      credits: 120,
      description: 'Explore creative writing, literary analysis, and develop your unique voice as a writer.',
      instructor: 'Dr. Lakshmi Devi',
      students: 60,
      rating: 4.8,
      price: '₹1,80,000',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
      skills: ['Creative Writing', 'Literary Analysis', 'Poetry', 'Storytelling'],
      prerequisites: ['Language Proficiency']
    },
    {
      id: 8,
      title: 'Biotechnology & Genetics',
      category: 'science',
      level: 'postgraduate',
      duration: '2 years',
      credits: 80,
      description: 'Advanced biotechnology program covering genetic engineering, molecular biology, and bioprocessing.',
      instructor: 'Dr. Ramesh Babu',
      students: 40,
      rating: 4.7,
      price: '₹3,00,000',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      skills: ['Genetic Engineering', 'Molecular Biology', 'Bioprocessing', 'Research'],
      prerequisites: ['Biology', 'Chemistry', 'Biochemistry']
    }
  ]

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
        <h1 className='text-6xl font-bold text-white mb-4 drop-shadow-2xl'>
          Explore Our <span className='bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>Courses</span>
        </h1>
        <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
          Discover world-class education programs designed to shape your future and advance your career.
        </p>
      </div>

      {/* Filters Section */}
      <div className='relative z-10 px-6 mb-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Category Filter */}
              <div>
                <label className='block text-white font-semibold mb-3'>Course Category</label>
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
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className='relative z-10 px-6 pb-20'>
        <div className='max-w-7xl mx-auto'>
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
              <div key={course.id} className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-white/15'>
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
                <div className='p-6'>
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
                  <div className='mb-6'>
                    <h4 className='text-white font-semibold text-sm mb-2'>Prerequisites:</h4>
                    <p className='text-white/70 text-sm'>{course.prerequisites.join(', ')}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <button className='flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300'>
                      Enroll Now
                    </button>
                    <button className='bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold py-3 px-4 rounded-2xl hover:bg-white/30 transition-all duration-300'>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>📚</div>
              <h3 className='text-3xl font-bold text-white mb-4'>No Courses Found</h3>
              <p className='text-white/70 text-lg'>Try adjusting your filters to see more courses.</p>
            </div>
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