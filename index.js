import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import { route } from "./routes/routesHandler.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import mongoose from "mongoose";
import newsRouter from "./routes/newsRoute.js";
import courseRoutes from "./routes/courses.js";
import adminRoutes from "./routes/admin.js";
import jobsRouter from "./routes/jobsRoute.js";
import ibmJobsRouter from "./routes/ibmJobsRoute.js";
import quantumJobsRouter from "./routes/quantumJobsRoute.js";
import { validateEnvironment, getConfig, isProduction } from "./config/environment.js";

// Load environment variables first
dotenv.config();

// Validate environment configuration before starting the server
console.log('🚀 Starting Quantum Job Tracker...');
try {
  validateEnvironment();
} catch (error) {
  console.error('💥 Failed to start server due to environment configuration errors:');
  console.error(error.message);
  console.error('\n📋 Please check your .env file and ensure all required variables are set.');
  console.error('💡 See .env.example for a template with all required variables.');
  process.exit(1);
}

const app = express();
const PORT = getConfig('PORT') || 3000;
const MONGOURI = getConfig('MONGOURI');

mongoose.connect(MONGOURI).then(() => {
  console.log("MongoDB Connected");
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});

// Middleware
const allowedOrigins = isProduction() 
  ? [getConfig('CLIENT_URL')] 
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Session configuration
app.use(session({
  secret: getConfig('SESSION_SECRET'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction(), // Enable secure cookies in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: isProduction() ? 'strict' : 'lax' // CSRF protection
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", route);
app.use("/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/news", newsRouter);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobsRouter);
app.use("/api/ibm-jobs", ibmJobsRouter);
app.use("/api/quantum-jobs", quantumJobsRouter);

app.listen(PORT, () => {
    console.log(`✅ Server is running on PORT ${PORT}`);
    console.log(`🌍 Environment: ${getConfig('NODE_ENV')}`);
    console.log(`🔗 Client URL: ${getConfig('CLIENT_URL')}`);
    if (!isProduction()) {
        console.log(`🚀 Server URL: http://localhost:${PORT}`);
    }
});