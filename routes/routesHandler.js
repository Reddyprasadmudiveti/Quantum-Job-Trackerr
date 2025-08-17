import express from "express";
import { jobs } from "../pages/jobsPage.js";
import { authUser, forgotPassword, logout, resetPassword, Signin, Signup, verification } from "../pages/authentication.js";
import {protectedRoute}from "../middleware/middleware.js"


export const route = express.Router();

route.post("/logout", logout)
route.post("/signup", Signup)
route.post("/signin", Signin)
route.post("/verification",verification)
route.post("/forgot-password",forgotPassword)//url looks with /forgot-password/:token
route.post("/reset-password/:token",resetPassword)
route.post("/check-auth",protectedRoute,authUser)
route.get("/jobs", jobs)