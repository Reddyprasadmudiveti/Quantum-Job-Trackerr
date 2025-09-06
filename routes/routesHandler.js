import express from "express";
import { authUser, checkEmailAvailability, forgotPassword, logout, resetPassword, Signin, Signup, updatePassword, updateProfile, verification } from "../pages/authentication.js";
import { getJobs } from "../pages/jobsPage.js";
import {protectedRoute}from "../middleware/middleware.js"
import upload from "../middleware/uploadMiddleware.js";

export const route = express.Router();

route.post("/logout", logout)
route.post("/signup", Signup)
route.post("/signin", Signin)
route.post("/verification",verification)
route.post("/forgot-password",forgotPassword)//url looks with /forgot-password/:token
route.post("/reset-password/:token",resetPassword)
route.post("/check-email", checkEmailAvailability)
route.post("/check-auth",protectedRoute,authUser)
route.get("/jobs", getJobs)

// User profile routes
route.get("/user/profile", protectedRoute, authUser)
route.put("/user/profile", protectedRoute, upload.single('profileImage'), updateProfile)
route.put("/user/password", protectedRoute, updatePassword)