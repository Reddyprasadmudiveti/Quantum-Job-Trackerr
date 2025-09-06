import express from 'express';
import { isAdmin } from '../middleware/adminAuth.js';
import { Course, Enrollment } from '../database/jobsSchema.js';
import User from '../database/authSchema.js';

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(isAdmin);

// Get all courses (admin view)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create a new course
router.post('/courses', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      level, 
      duration, 
      credits,
      price, 
      instructor,
      imageUrl,
      skills,
      prerequisites,
      syllabus
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !level || !duration || !instructor || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new course
    const newCourse = new Course({
      title,
      description,
      category,
      level,
      duration,
      credits: credits || 0,
      price,
      instructor,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      skills: skills || [],
      prerequisites: prerequisites || [],
      syllabus: syllabus || [],
      students: 0,
      rating: 4.5
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      category, 
      level, 
      duration, 
      credits,
      price, 
      instructor,
      imageUrl,
      skills,
      prerequisites,
      syllabus
    } = req.body;

    // Find and update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        level,
        duration,
        credits,
        price,
        instructor,
        imageUrl,
        skills,
        prerequisites,
        syllabus
      },
      { new: true } // Return updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get a single course by ID
router.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('userId', 'username email')
      .populate('courseId', 'title category')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Get enrollments for a specific course
router.get('/courses/:courseId/enrollments', async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await Enrollment.find({ courseId })
      .populate('userId', 'username email')
      .populate('courseId', 'title category')
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching course enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch course enrollments' });
  }
});

// Create a new enrollment (admin enrolling a user)
router.post('/enrollments', async (req, res) => {
  try {
    const { userId, courseId, status, paymentStatus } = req.body;

    // Validate required fields
    if (!userId || !courseId) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ error: 'User is already enrolled in this course' });
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      userId,
      courseId,
      status: status || 'confirmed', // Default to confirmed for admin enrollments
      paymentStatus: paymentStatus || 'completed', // Default to completed for admin enrollments
      enrollmentDate: new Date()
    });

    await newEnrollment.save();
    
    // Populate user and course details for response
    const populatedEnrollment = await Enrollment.findById(newEnrollment._id)
      .populate('userId', 'username email')
      .populate('courseId', 'title category');

    res.status(201).json(populatedEnrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

// Update enrollment status
router.put('/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, completionPercentage, certificateIssued } = req.body;

    // Find and update enrollment
    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      id,
      {
        status,
        paymentStatus,
        completionPercentage,
        certificateIssued,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    )
    .populate('userId', 'username email')
    .populate('courseId', 'title category');

    if (!updatedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(updatedEnrollment);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
});

// Delete an enrollment
router.delete('/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEnrollment = await Enrollment.findByIdAndDelete(id);

    if (!deletedEnrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ message: 'Enrollment deleted successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

// Get all users (for admin enrollment selection)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email role');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user role (make a user an admin)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true } // Return updated document
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: `User role updated to ${role} successfully`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

export default router;