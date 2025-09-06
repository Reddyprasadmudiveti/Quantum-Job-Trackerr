import express from 'express';
import { Course, Enrollment } from '../database/jobsSchema.js';
import User from '../database/authSchema.js';
import { courseEnrollmentMail } from '../Mail/mail.js';
import { setCookiesAndToken as authenticateToken  } from '../middleware/jwtAuth.js';

 const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course categories and levels (must come before /:id route)
router.get('/metadata', async (req, res) => {
  try {
    const courseCategories = [
      { value: 'all', label: 'All Courses' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'computer-science', label: 'Computer Science' },
      { value: 'business', label: 'Business' },
      { value: 'arts', label: 'Arts & Literature' },
      { value: 'science', label: 'Sciences' },
      { value: 'quantum', label: 'Quantum Computing' }
    ];

    const courseLevels = [
      { value: 'all', label: 'All Levels' },
      { value: 'undergraduate', label: 'Undergraduate' },
      { value: 'postgraduate', label: 'Postgraduate' },
      { value: 'diploma', label: 'Diploma' },
      { value: 'certificate', label: 'Certificate' }
    ];

    res.status(200).json({
      categories: courseCategories,
      levels: courseLevels
    });
  } catch (error) {
    console.error('Error fetching course metadata:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Enroll in a course
router.post('/enroll', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      userId,
      courseId,
      status: 'confirmed', // Assuming direct confirmation for now
      paymentStatus: 'completed' // Assuming payment is handled elsewhere or free
    });

    await enrollment.save();

    // Send confirmation email
    await courseEnrollmentMail(user.email, {
      id: course._id,
      title: course.title,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level
    });

    res.status(201).json({ 
      message: 'Successfully enrolled in the course',
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's enrolled courses
router.get('/user/enrollments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const enrollments = await Enrollment.find({ userId })
      .populate('courseId')
      .sort({ enrollmentDate: -1 });
    
    res.status(200).json(enrollments);
  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



export default router;