import jwt from "jsonwebtoken"
import User from "../database/authSchema.js"

export const protectedRoute = async (req, res, next) => {
    // Try to get token from cookie first
    let token = req.cookies.auth
    
    // If no cookie token, check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1]
    }

    console.log("Token in middleware", token)

    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: token not found" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check if decoded has userId or id
        const userId = decoded.userId || decoded.id
        
        // For testing purposes, if userId is a number (like "1"), use a different approach
        // In production, you would want to ensure proper ObjectId format
        let user;
        if (typeof userId === 'number') {
            // For testing with numeric IDs, find by other unique field
            user = await User.findOne({ email: decoded.email }).select("-password");
        } else {
            // Normal case with proper MongoDB ObjectId
            user = await User.findById(userId).select("-password");
        }

        req.user = user

        next()
        
    } catch (error) {
        console.error("Authentication error:", error.message)
        res.status(401).json({ message: "Unauthorized: invalid token" })
    }
}  