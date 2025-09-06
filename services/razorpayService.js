import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Flag to use mock implementation for testing
const USE_MOCK = true;

// Initialize Razorpay with API keys only if not using mock
let razorpay;
if (!USE_MOCK) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('Razorpay initialized with key_id:', process.env.RAZORPAY_KEY_ID);
} else {
  console.log('Using Razorpay mock implementation');
}

/**
 * Create a new Razorpay order
 * @param {Object} options - Order options
 * @param {number} options.amount - Amount in smallest currency unit (paise for INR)
 * @param {string} options.currency - Currency code (default: INR)
 * @param {string} options.receipt - Receipt ID (usually your internal order ID)
 * @param {Object} options.notes - Additional notes for the order
 * @returns {Promise<Object>} - Razorpay order object
 */
export const createOrder = async (options) => {
  try {
    if (USE_MOCK) {
      console.log('Using mock Razorpay implementation');
      // Create a mock order response
      return {
        id: 'order_mock_' + Date.now(),
        entity: 'order',
        amount: options.amount,
        amount_paid: 0,
        amount_due: options.amount,
        currency: options.currency || 'INR',
        receipt: options.receipt,
        status: 'created',
        attempts: 0,
        notes: options.notes || {},
        created_at: Math.floor(Date.now() / 1000)
      };
    }
    
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes || {}
    });
    
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Payment initialization failed');
  }
};

/**
 * Verify Razorpay payment signature
 * @param {Object} options - Verification options
 * @param {string} options.orderId - Razorpay order ID
 * @param {string} options.paymentId - Razorpay payment ID
 * @param {string} options.signature - Razorpay signature
 * @returns {boolean} - Whether signature is valid
 */
export const verifyPaymentSignature = (options) => {
  try {
    if (USE_MOCK) {
      console.log('Using mock signature verification');
      // Always return true for mock implementation
      return true;
    }
    
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${options.orderId}|${options.paymentId}`)
      .digest('hex');
    
    return generatedSignature === options.signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

/**
 * Get payment details by payment ID
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} - Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    throw new Error('Failed to fetch payment details');
  }
};

export default {
  createOrder,
  verifyPaymentSignature,
  getPaymentDetails
};