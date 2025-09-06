import JWT from "jsonwebtoken";
import User from "../database/authSchema.js";

// Middleware to check if user is authenticated and is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Check if authorization header exists
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    console.log('Token extracted:', token);
    
    // Verify token
    // Use the hardcoded fallback value since there seems to be an issue with environment variables
    const jwtSecret = 'dravidian_university_jwt_secret_key_2024_super_secure';
    console.log('JWT Secret used:', jwtSecret);
    
    let decoded;
    try {
      decoded = JWT.verify(token, jwtSecret);
      console.log('Token decoded successfully:', decoded);
    } catch (verifyError) {
      console.error('JWT verification error details:', verifyError);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied - Admin privileges required' });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};