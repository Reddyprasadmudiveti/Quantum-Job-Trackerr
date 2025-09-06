import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiUserPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const AdminCourses = () => {
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'create', 'edit', 'enrollments', 'enroll'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [enrollmentSubmitting, setEnrollmentSubmitting] = useState(false);
  
  // Form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '',
    duration: '',
    credits: '',
    instructor: '',
    imageUrl: '',
    skills: '',
    prerequisites: ''
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Enrollment form state
  const [enrollmentForm, setEnrollmentForm] = useState({
    userId: '',
    courseId: '',
    status: 'confirmed',
    paymentStatus: 'completed'
  });
  
  // Enrollment form validation state
  const [enrollmentFormErrors, setEnrollmentFormErrors] = useState({});

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrollments
  const fetchEnrollments = async () => {
    try {
      setEnrollmentLoading(true);
      const response = await fetch('http://localhost:3000/api/admin/enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch enrollments');
      }
      
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      toast.error('Failed to load enrollments');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  // Fetch users for enrollment management
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
    fetchUsers();
  }, [token]);
  
  // Fetch courses
  // Fetch course enrollments
  const fetchCourseEnrollments = async (courseId) => {
    try {
      setEnrollmentLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/courses/${courseId}/enrollments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch course enrollments');
      }
      
      const data = await response.json();
      setEnrollments(data);
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      toast.error('Failed to load course enrollments');
    } finally {
      setEnrollmentLoading(false);
    }
  };
  
  // Handle enrollment form input changes
  const handleEnrollmentInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentForm({
      ...enrollmentForm,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (enrollmentFormErrors[name]) {
      setEnrollmentFormErrors({
        ...enrollmentFormErrors,
        [name]: ''
      });
    }
  };
  
  // Validate enrollment form
  const validateEnrollmentForm = () => {
    const errors = {};
    
    if (!enrollmentForm.userId) errors.userId = 'User is required';
    if (!enrollmentForm.courseId) errors.courseId = 'Course is required';
    if (!enrollmentForm.status) errors.status = 'Status is required';
    if (!enrollmentForm.paymentStatus) errors.paymentStatus = 'Payment status is required';
    
    setEnrollmentFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!courseForm.title.trim()) errors.title = 'Title is required';
    if (!courseForm.description.trim()) errors.description = 'Description is required';
    if (!courseForm.category.trim()) errors.category = 'Category is required';
    if (!courseForm.level) errors.level = 'Level is required';
    if (!courseForm.price.trim()) errors.price = 'Price is required';
    if (!courseForm.duration.trim()) errors.duration = 'Duration is required';
    if (!courseForm.instructor.trim()) errors.instructor = 'Instructor name is required';
    if (!courseForm.imageUrl.trim()) errors.imageUrl = 'Image URL is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      // Format the data
      const courseData = {
        ...courseForm,
        credits: courseForm.credits ? parseInt(courseForm.credits) : 0,
        skills: courseForm.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        prerequisites: courseForm.prerequisites.split(',').map(prereq => prereq.trim()).filter(Boolean)
      };
      
      const url = selectedCourse 
        ? `http://localhost:3000/api/admin/courses/${selectedCourse._id}` 
        : 'http://localhost:3000/api/admin/courses';
      
      const method = selectedCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save course');
      }
      
      toast.success(selectedCourse ? 'Course updated successfully' : 'Course created successfully');
      
      // Reset form and refresh courses
      setCourseForm({

        title: '',
        description: '',
        category: '',
        level: 'beginner',
        price: '',
        duration: '',
        credits: '',
        instructor: '',
        imageUrl: '',
        skills: '',
        prerequisites: ''
      });
      
      setActiveTab('list');
      fetchCourses();
      
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error(error.message || 'Failed to save course');
    } finally {
      setFormSubmitting(false);
    }
  };
  
  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      toast.success('Course deleted successfully');
      setCourses(courses.filter(course => course._id !== courseId));
      
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    }
  };
  
  // Handle enrollment submission
  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEnrollmentForm()) {
      toast.error('Please fix the errors in the enrollment form');
      return;
    }
    
    try {
      setEnrollmentSubmitting(true);
      
      const url = selectedEnrollment 
        ? `http://localhost:3000/api/admin/enrollments/${selectedEnrollment._id}` 
        : 'http://localhost:3000/api/admin/enrollments';
      
      const method = selectedEnrollment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(enrollmentForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save enrollment');
      }
      
      toast.success(selectedEnrollment ? 'Enrollment updated successfully' : 'User enrolled successfully');
      
      // Reset form and refresh enrollments
      setEnrollmentForm({
        userId: '',
        courseId: '',
        status: 'confirmed',
        paymentStatus: 'completed'
      });
      
      setActiveTab('enrollments');
      fetchEnrollments();
      
    } catch (error) {
      console.error('Error saving enrollment:', error);
      toast.error(error.message || 'Failed to save enrollment');
    } finally {
      setEnrollmentSubmitting(false);
    }
  };
  
  // Handle delete enrollment
  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to delete this enrollment?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3000/api/admin/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete enrollment');
      }
      
      toast.success('Enrollment deleted successfully');
      setEnrollments(enrollments.filter(enrollment => enrollment._id !== enrollmentId));
      
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      toast.error('Failed to delete enrollment');
    }
  };
  
  // Handle edit enrollment
  const handleEditEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setEnrollmentForm({
      userId: enrollment.userId._id,
      courseId: enrollment.courseId._id,
      status: enrollment.status,
      paymentStatus: enrollment.paymentStatus,
      completionPercentage: enrollment.completionPercentage || 0,
      certificateIssued: enrollment.certificateIssued || false
    });
    setActiveTab('enroll');
  };
  
  // Handle view course enrollments
  const handleViewCourseEnrollments = (courseId) => {
    fetchCourseEnrollments(courseId);
    setEnrollmentForm({
      ...enrollmentForm,
      courseId: courseId
    });
    setActiveTab('enrollments');
  };
  
  // Handle new enrollment for a course
  const handleNewEnrollment = (courseId) => {
    setSelectedEnrollment(null);
    setEnrollmentForm({
      userId: '',
      courseId: courseId,
      status: 'confirmed',
      paymentStatus: 'completed'
    });
    setActiveTab('enroll');
  };
  
  // Set form data when editing
  useEffect(() => {
    if (selectedCourse && activeTab === 'edit') {
      setCourseForm({
        title: selectedCourse.title || '',
        description: selectedCourse.description || '',
        category: selectedCourse.category || '',
        level: selectedCourse.level || 'beginner',
        price: selectedCourse.price?.toString() || '',
        duration: selectedCourse.duration || '',
        credits: selectedCourse.credits || '',
        instructor: selectedCourse.instructor || '',
        imageUrl: selectedCourse.imageUrl || '',
        skills: Array.isArray(selectedCourse.skills) ? selectedCourse.skills.join(', ') : '',
        prerequisites: Array.isArray(selectedCourse.prerequisites) ? selectedCourse.prerequisites.join(', ') : ''
      });
    }
  }, [selectedCourse, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-6 border border-gray-200 border-opacity-20">
        <h1 className="text-3xl font-bold text-white mb-6">Course Management</h1>
        
        {/* Admin Navigation Tabs */}
        <div className="flex mb-6 border-b border-gray-600">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'list' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300 hover:text-white'}`}
            onClick={() => setActiveTab('list')}
          >
            Course List
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'create' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300 hover:text-white'}`}
            onClick={() => {
              setSelectedCourse(null);
              setActiveTab('create');
            }}
          >
            Create Course
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'enrollments' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300 hover:text-white'}`}
            onClick={() => {
              fetchEnrollments();
              setActiveTab('enrollments');
            }}
          >
            Enrollments
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'enroll' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-300 hover:text-white'}`}
            onClick={() => {
              setSelectedEnrollment(null);
              setEnrollmentForm({
                userId: '',
                courseId: '',
                status: 'confirmed',
                paymentStatus: 'completed'
              });
              setActiveTab('enroll');
            }}
          >
            Enroll User
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === 'list' && (
            <div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : courses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300 text-lg">No courses available</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    onClick={() => setActiveTab('create')}
                  >
                    Create Your First Course
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700 bg-opacity-40">
                      {courses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-700 hover:bg-opacity-30 transition">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{course.level}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${course.price}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-indigo-400 hover:text-indigo-300 mr-3"
                              onClick={() => {
                                setSelectedCourse(course);
                                setActiveTab('edit');
                              }}
                            >
                              <FiEdit className="inline mr-1" /> Edit
                            </button>
                            <button 
                              className="text-red-400 hover:text-red-300 mr-3"
                              onClick={() => handleDeleteCourse(course._id)}
                            >
                              <FiTrash2 className="inline mr-1" /> Delete
                            </button>
                            <button
                              className="text-green-400 hover:text-green-300 mr-3"
                              onClick={() => handleViewCourseEnrollments(course._id)}
                            >
                              View Enrollments
                            </button>
                            <button
                              className="text-purple-400 hover:text-purple-300"
                              onClick={() => handleNewEnrollment(course._id)}
                            >
                              <FiUserPlus className="inline mr-1" /> Enroll
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          
          {/* Enrollments List */}
          {activeTab === 'enrollments' && (
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Course Enrollments</h2>
              
              {enrollmentLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-300">No enrollments found for this course</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    onClick={() => setActiveTab('enroll')}
                  >
                    <FiUserPlus className="inline mr-2" /> Enroll New User
                  </button>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Enrolled On</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700 bg-opacity-40">
                        {enrollments.map((enrollment) => (
                          <tr key={enrollment._id} className="hover:bg-gray-700 hover:bg-opacity-30 transition">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                              {enrollment.userId?.name || 'Unknown User'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {enrollment.courseId?.title || 'Unknown Course'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                enrollment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {enrollment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                enrollment.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                enrollment.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {enrollment.paymentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              {new Date(enrollment.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button 
                                className="text-indigo-400 hover:text-indigo-300 mr-3"
                                onClick={() => handleEditEnrollment(enrollment)}
                              >
                                <FiEdit className="inline mr-1" /> Edit
                              </button>
                              <button 
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteEnrollment(enrollment._id)}
                              >
                                <FiTrash2 className="inline mr-1" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center"
                      onClick={() => setActiveTab('enroll')}
                    >
                      <FiUserPlus className="mr-2" /> Enroll New User
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Enrollment Form */}
          {activeTab === 'enroll' && (
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                {selectedEnrollment ? 'Edit Enrollment' : 'Enroll User in Course'}
              </h2>
              
              <form onSubmit={handleEnrollmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Selection */}
                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-1">User*</label>
                    <select
                      id="userId"
                      name="userId"
                      value={enrollmentForm.userId}
                      onChange={handleEnrollmentInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${enrollmentFormErrors.userId ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="">Select a user</option>
                      {users.map(user => (
                        <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                    {enrollmentFormErrors.userId && <p className="mt-1 text-sm text-red-500">{enrollmentFormErrors.userId}</p>}
                  </div>
                  
                  {/* Course Selection */}
                  <div>
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-300 mb-1">Course*</label>
                    <select
                      id="courseId"
                      name="courseId"
                      value={enrollmentForm.courseId}
                      onChange={handleEnrollmentInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${enrollmentFormErrors.courseId ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      disabled={enrollmentForm.courseId && activeTab === 'enroll'}
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                      ))}
                    </select>
                    {enrollmentFormErrors.courseId && <p className="mt-1 text-sm text-red-500">{enrollmentFormErrors.courseId}</p>}
                  </div>
                  
                  {/* Enrollment Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Status*</label>
                    <select
                      id="status"
                      name="status"
                      value={enrollmentForm.status}
                      onChange={handleEnrollmentInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${enrollmentFormErrors.status ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {enrollmentFormErrors.status && <p className="mt-1 text-sm text-red-500">{enrollmentFormErrors.status}</p>}
                  </div>
                  
                  {/* Payment Status */}
                  <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-300 mb-1">Payment Status*</label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={enrollmentForm.paymentStatus}
                      onChange={handleEnrollmentInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${enrollmentFormErrors.paymentStatus ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    {enrollmentFormErrors.paymentStatus && <p className="mt-1 text-sm text-red-500">{enrollmentFormErrors.paymentStatus}</p>}
                  </div>
                  
                  {/* Completion Percentage - Only for Edit */}
                  {selectedEnrollment && (
                    <div>
                      <label htmlFor="completionPercentage" className="block text-sm font-medium text-gray-300 mb-1">Completion (%)</label>
                      <input
                        type="number"
                        id="completionPercentage"
                        name="completionPercentage"
                        value={enrollmentForm.completionPercentage || 0}
                        onChange={handleEnrollmentInputChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}
                  
                  {/* Certificate Issued - Only for Edit */}
                  {selectedEnrollment && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="certificateIssued"
                        name="certificateIssued"
                        checked={enrollmentForm.certificateIssued || false}
                        onChange={(e) => setEnrollmentForm({
                          ...enrollmentForm,
                          certificateIssued: e.target.checked
                        })}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="certificateIssued" className="ml-2 block text-sm text-gray-300">
                        Certificate Issued
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('enrollments');
                      setEnrollmentFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={enrollmentSubmitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {enrollmentSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      selectedEnrollment ? 'Update Enrollment' : 'Enroll User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
            </div>
          )}

          {(activeTab === 'create' || activeTab === 'edit') && (
            <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                {activeTab === 'edit' ? `Edit Course: ${selectedCourse?.title}` : 'Create New Course'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Course Title*</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={courseForm.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.title ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Enter course title"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category*</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={courseForm.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.category ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="e.g. Programming, Data Science"
                    />
                    {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
                  </div>
                  
                  {/* Level */}
                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-300 mb-1">Level*</label>
                    <select
                      id="level"
                      name="level"
                      value={courseForm.level}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.level ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {formErrors.level && <p className="mt-1 text-sm text-red-500">{formErrors.level}</p>}
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price ($)*</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={courseForm.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.price ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Enter price"
                    />
                    {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
                  </div>
                  
                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration*</label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={courseForm.duration}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.duration ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="e.g. 8 weeks, 3 months"
                    />
                    {formErrors.duration && <p className="mt-1 text-sm text-red-500">{formErrors.duration}</p>}
                  </div>
                  
                  {/* Credits */}
                  <div>
                    <label htmlFor="credits" className="block text-sm font-medium text-gray-300 mb-1">Credits</label>
                    <input
                      type="text"
                      id="credits"
                      name="credits"
                      value={courseForm.credits}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. 3 credits"
                    />
                  </div>
                  
                  {/* Instructor */}
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-300 mb-1">Instructor*</label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      value={courseForm.instructor}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.instructor ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Enter instructor name"
                    />
                    {formErrors.instructor && <p className="mt-1 text-sm text-red-500">{formErrors.instructor}</p>}
                  </div>
                  
                  {/* Image URL */}
                  <div className="md:col-span-2">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-1">Course Image URL*</label>
                    <div className="flex">
                      <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={courseForm.imageUrl}
                        onChange={handleInputChange}
                        className={`flex-grow px-4 py-2 bg-gray-700 border ${formErrors.imageUrl ? 'border-red-500' : 'border-gray-600'} rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Enter image URL"
                      />
                      <button 
                        type="button"
                        className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
                      >
                        <FiUpload className="mr-2" /> Upload
                      </button>
                    </div>
                    {formErrors.imageUrl && <p className="mt-1 text-sm text-red-500">{formErrors.imageUrl}</p>}
                    {courseForm.imageUrl && (
                      <div className="mt-2 relative inline-block">
                        <img 
                          src={courseForm.imageUrl} 
                          alt="Course preview" 
                          className="h-20 w-36 object-cover rounded-md border border-gray-600" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Image+Error';
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => setCourseForm({...courseForm, imageUrl: ''})} 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Skills (comma separated)</label>
                    <input
                      type="text"
                      id="skills"
                      name="skills"
                      value={courseForm.skills}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Python, Data Analysis, Machine Learning"
                    />
                  </div>
                  
                  {/* Prerequisites */}
                  <div>
                    <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-300 mb-1">Prerequisites (comma separated)</label>
                    <input
                      type="text"
                      id="prerequisites"
                      name="prerequisites"
                      value={courseForm.prerequisites}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g. Basic Programming, Statistics"
                    />
                  </div>
                  
                  {/* Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                    <textarea
                      id="description"
                      name="description"
                      value={courseForm.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-2 bg-gray-700 border ${formErrors.description ? 'border-red-500' : 'border-gray-600'} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      placeholder="Enter course description"
                    ></textarea>
                    {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('list');
                      setFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {formSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      selectedCourse ? 'Update Course' : 'Create Course'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;