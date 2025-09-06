import express from 'express';
import { Course } from '../database/jobsSchema.js';
import User from '../database/authSchema.js';
import { createOrder, verifyPaymentSignature } from '../services/razorpayService.js';
import { protectedRoute } from '../middleware/middleware.js';

const router = express.Router();

// Create a new payment order for course enrollment
router.post('/create-order', protectedRoute, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id;

    // Check if course exists
    let course;
    try {
      course = await Course.findById(courseId);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid course ID format' });
    }
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user exists
    let user;
    try {
      user = await User.findOne({ email: req.user.email });
    } catch (error) {
      return res.status(400).json({ message: 'Error finding user' });  
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a unique receipt ID
    const receipt = `receipt_${userId}_${courseId}_${Date.now()}`;

    // Create Razorpay order
    const order = await createOrder({
      amount: course.price * 100, // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt,
      notes: {
        userId,
        courseId,
        courseTitle: course.title
      }
    });

    // Return order details to client
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      course: {
        id: course._id,
        title: course.title,
        price: course.price
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere'
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
});

// Verify payment and complete enrollment
router.post('/verify-payment', protectedRoute, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
    const userId = req.user.id;

    // Verify payment signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // At this point, payment is verified
    // You would typically update your database to record the payment and enrollment
    // This is handled by the /courses/enroll endpoint, so we'll redirect there

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      courseId
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Payment verification failed', error: error.message });
  }
});

export default router;