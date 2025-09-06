import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import {FaSpinner} from "react-icons/fa";
import {FaBriefcase, FaMapMarkerAlt, FaExternalLinkAlt} from "react-icons/fa";
import { ibmJobsApi, formatJobData, handleApiError } from '../utils/jobsApi'

const Course = () => {
  const { id } = useParams()
  const { isAuthenticated, token } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [ibmJobs, setIbmJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  
  // Fetch course data from API
  const fetchCourse = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`)
      
      if (!response.ok) {
        throw new Error('Course not found')
      }
      
      const courseData = await response.json()
      
      // Format the course data to match frontend expectations
      const formattedCourse = {
        id: courseData._id,
        title: courseData.title,
        category: courseData.category,
        level: courseData.level,
        duration: courseData.duration,
        credits: courseData.credits,
        description: courseData.description,
        instructor: courseData.instructor,
        students: courseData.students,
        rating: courseData.rating,
        price: courseData.price,
        image: courseData.imageUrl,
        skills: courseData.skills,
        prerequisites: courseData.prerequisites,
        syllabus: courseData.syllabus
      }
      
      setCourse(formattedCourse)
    } catch (error) {
      console.error('Error fetching course:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }
  
  // Handle enrollment and payment
  const handleEnrollment = async (courseId) => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course')
      return
    }

    try {
      setPaymentLoading(true)
      
      // For testing purposes, use a valid MongoDB ObjectId format
      // In production, this would be the actual course ID from the database
      const testCourseId = '64f5ce68b94a9e5a26e71234' // Example MongoDB ObjectId
      
      // Create Razorpay order
      const response = await axios.post(
        'http://localhost:3000/api/payments/create-order',
        { courseId: testCourseId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const { orderId, amount, currency, key } = response.data
      
      // Initialize Razorpay payment
      const options = {
        key,
        amount,
        currency,
        name: 'Quantum Job Tracker',
        description: `Enrollment for ${course.title}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              'http://localhost:3000/api/payments/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              }
            )

            if (verifyResponse.data.success) {
              // Complete enrollment
              await axios.post(
                'http://localhost:3000/api/courses/enroll',
                { courseId },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                }
              )

              toast.success('Successfully enrolled in the course!')
            }
          } catch (error) {
            console.error('Error verifying payment:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          name: 'Student Name',
          email: 'student@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#6366F1'
        }
      }


      // Open Razorpay payment form
      const razorpay = new window.Razorpay(options)
      razorpay.open()
      
    } catch (error) {
      console.error('Error initiating payment:', error)
      toast.error('Failed to initiate payment. Please try again.')
    } finally {
      setPaymentLoading(false)
    }
  }

  useEffect(() => {
    fetchCourse()
  }, [id])
  
  // Fetch IBM jobs from MongoDB
  useEffect(() => {
    const fetchIbmJobs = async () => {
      setJobsLoading(true)
      try {
        // Use the utility function to get IBM jobs from MongoDB
        const data = await ibmJobsApi.getAll({ limit: 10 })
        
        // Handle both array and object responses
        const jobs = data.jobs || data || []
        const formattedJobs = jobs.slice(0, 10).map(formatJobData)
        setIbmJobs(formattedJobs)
        
        console.log(`Loaded ${formattedJobs.length} IBM jobs from MongoDB for course page`)
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load IBM jobs from database')
        console.error('Error fetching IBM jobs from MongoDB:', error)
        setIbmJobs([])
        toast.error(errorMessage)
      } finally {
        setJobsLoading(false)
      }
    }
    
    fetchIbmJobs()
  }, [])

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          resolve(true)
        }
        script.onerror = () => {
          resolve(false)
        }
        document.body.appendChild(script)
      })
    }

    loadRazorpayScript()
  }, [])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }
  
  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Course Not Found</h2>
          <p className="text-white/70 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/courses" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Courses</span>
        </Link>
      </div>
      
      {/* Course header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-xl mb-8">
        <div className="md:flex">
          {/* Course image */}
          <div className="md:w-1/3 h-64 md:h-auto">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Course header info */}
          <div className="p-8 md:w-2/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <span className="bg-purple-500/20 text-purple-400 text-xs font-medium px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{course.title}</h1>
              
              <p className="text-gray-300 mb-6">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Price</p>
                  <p className="text-white font-bold">{course.price}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Duration</p>
                  <p className="text-white font-bold">{course.duration}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Students</p>
                  <p className="text-white font-bold">{course.students}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="text-white font-bold flex items-center">
                    {course.rating}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <button 
                onClick={() => handleEnrollment(course.id)}
                disabled={paymentLoading}
                className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 ${paymentLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {paymentLoading ? <FaSpinner className='animate-spin h-5 w-5 text-white' /> : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course details */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Instructor */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Instructor</h2>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                {course.instructor.split(' ').map(name => name[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{course.instructor}</h3>
                <p className="text-gray-400">Course Instructor</p>
              </div>
            </div>
          </div>
          
          {/* Syllabus */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Course Syllabus</h2>
            <div className="space-y-4">
              {course.syllabus && course.syllabus.map((item, index) => (
                <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                  {item.week && (
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">Week {item.week}: {item.topic}</h3>
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {item.semester && (
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">Semester {item.semester}</h3>
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {item.content && (
                    <p className="text-gray-400">{item.content}</p>
                  )}
                  {item.courses && (
                    <ul className="list-disc list-inside text-gray-400 ml-4 mt-2 space-y-1">
                      {item.courses.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div>
          {/* Course details */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Course Details</h2>
            
            {course.credits && (
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-gray-400">Credits</span>
                <span className="text-white font-medium">{course.credits}</span>
              </div>
            )}
            
            {/* Skills you'll gain */}
            <div className="py-4 border-b border-gray-700">
              <h3 className="text-white font-medium mb-3">Skills you'll gain</h3>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Prerequisites */}
            <div className="py-4">
              <h3 className="text-white font-medium mb-3">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Share */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Share This Course</h2>
            <div className="flex gap-4">
              <button onClick={() => window.open('https://facebook.com', '_blank')} className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </button>
              <button onClick={() => window.open('https://x.com', '_blank')} className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-900 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button onClick={() => window.open('https://reddit.com', '_blank')} className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 21.6 0 39.2-17.6 39.2-39.2s-17.6-39.2-39.2-39.2c-15.4 0-28.7 9.3-34.9 22.3l-97.2-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22.9 18.7-41.6 41.6-41.6 23 0 41.7 18.7 41.7 41.6 0 22.9-18.7 41.6-41.7 41.6-22.9 0-41.6-18.7-41.6-41.6zm214.3 93.4c-26.1 26.1-81.9 31.5-97.7 31.5-15.8 0-71.6-5.4-97.7-31.5-4.1-4.1-4.1-10.8 0-14.9 4.1-4.1 10.8-4.1 14.9 0 18.7 18.7 64.7 25.4 82.8 25.4 18.1 0 64.1-6.7 82.8-25.4 4.1-4.1 10.8-4.1 14.9 0 4.1 4.1 4.1 10.8 0 14.9zm-.8-110.1c-22.9 0-41.6-18.7-41.6-41.6 0-22.9 18.7-41.6 41.6-41.6 22.9 0 41.6 18.7 41.6 41.6 0 22.9-18.7 41.6-41.6 41.6z"/>
                </svg>
              </button>
              <button onClick={() => window.open('https://linkedin.com', '_blank')} className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* IBM Jobs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Related IBM Job Opportunities</h2>
        
        {jobsLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ibmJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {ibmJobs.map((job) => (
              <div key={job.id} className="bg-gray-800 rounded-xl p-5 hover:bg-gray-750 transition-colors">
                <h3 className="text-lg font-semibold text-white mb-2">{job.title}</h3>
                <div className="flex items-center text-gray-400 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{job.location}</span>
                </div>
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-3 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <FaBriefcase className="mr-2" />
                  Apply at IBM
                  <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <p className="text-gray-400">No IBM jobs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
export default Course
