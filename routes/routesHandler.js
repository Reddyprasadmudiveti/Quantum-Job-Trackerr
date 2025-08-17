import express from "express";
import { jobs } from "../pages/jobsPage.js";
import { authUser, forgotPassword, Logout, resetPassword, signin, signup, verification } from "../pages/authentication.js";
import {protectedRoute}from "../middleware/middleware.js"


export const route = express.Router();

route.post("/logout", Logout)
route.post("/signup", signup)
route.post("/signin", signin)
route.post("/verification",verification)
route.post("/forgot-password",forgotPassword)
route.post("/reset-password/:token",resetPassword)
route.post("/check-auth",protectedRoute,authUser)
route.get("/jobs", jobs)