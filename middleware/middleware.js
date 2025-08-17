import jwt from "jsonwebtoken"
import { User } from "../Models/User.model.js"

export const protectedRoute = async (req, res, next) => {
    const token = req.cookies.auth

    console.log("Token in middleware", token)

    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: token not found" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password")

        req.user = user

        next()
        
    } catch (error) {
        console.error("Authentication error:", error.message)
        res.status(401).json({ message: "Unauthorized: invalid token" })
    }
}