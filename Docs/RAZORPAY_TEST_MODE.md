# Razorpay Test Mode Integration Guide

## Overview
This guide explains how to set up and use Razorpay in test mode for the Quantum Job Tracker application. Test mode allows you to simulate payments without actual money transfers, which is ideal for development and testing.

## Prerequisites
- A Razorpay account (sign up at [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup))
- Node.js and npm installed
- Quantum Job Tracker application codebase

## Setup Instructions

### 1. Get Razorpay Test API Keys

1. Log in to your Razorpay Dashboard
2. Navigate to Settings > API Keys
3. Click on "Generate Key"
4. Copy both the Key ID and Key Secret
   - Test mode keys always start with `rzp_test_`

### 2. Configure Environment Variables

Update your `.env` file with the test API keys:

```
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"
```

### 3. Test Mode Features

- **Test Cards**: Use the following test cards for simulating payments:
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3-digit number
  - Name: Any name

- **Test UPI**: Use the following test UPI IDs:
  - For success: `success@razorpay`
  - For failure: `failure@razorpay`

- **Test Netbanking**: Any bank option will work in test mode

### 4. Testing Workflow

1. Click "Enroll Now" on a course
2. The Razorpay payment form will appear
3. Use test payment details
4. For successful payments, use the success test credentials
5. For failed payments, use the failure test credentials

### 5. Verification

In test mode, the application will log payment verification details to the console. Check your server logs to see:
- Order ID
- Payment ID
- Expected signature
- Generated signature
- Validation result

### 6. Switching to Production

When ready to go live:

1. Generate production API keys from the Razorpay dashboard
2. Update your `.env` file with production keys (starting with `rzp_live_`)
3. Remove or comment out the debug logging in `razorpayService.js`
4. Set `NODE_ENV=production` in your `.env` file

## Troubleshooting

### Common Issues

1. **Payment verification fails**:
   - Ensure your Key Secret is correctly set in the `.env` file
   - Check that the order ID and payment ID are being passed correctly

2. **Razorpay form doesn't appear**:
   - Verify that the Razorpay script is loading properly
   - Check browser console for any JavaScript errors

3. **Test payments always fail**:
   - Ensure you're using the correct test credentials
   - Verify your internet connection

## Additional Resources

- [Razorpay Test Mode Documentation](https://razorpay.com/docs/payments/payments/test-mode/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Test Card Details](https://razorpay.com/docs/payments/payments/test-mode/#test-card-details)