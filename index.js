import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import { route } from "./routes/routesHandler.js";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MONGOURI = process.env.MONGOURI;

mongoose.connect(MONGOURI).then(() => {
  console.log("MongoDB Connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", route);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is Running on PORT http://localhost:${PORT}`);
});