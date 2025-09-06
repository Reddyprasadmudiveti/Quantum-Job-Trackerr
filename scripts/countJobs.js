import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../database/jobsSchema.js';

dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const MONGOURI = process.env.MONGOURI;
    if (!MONGOURI) {
      console.error('MongoDB URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(MONGOURI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Count jobs in the database
const countJobs = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Count jobs
    const count = await Job.countDocuments();
    console.log(`Total jobs in database: ${count}`);
    
    // Get a sample of jobs
    const sampleJobs = await Job.find().limit(5);
    console.log('\nSample jobs:');
    sampleJobs.forEach(job => {
      console.log(`- ${job.tittle} (${job.location})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error counting jobs:', error);
    process.exit(1);
  }
};

// Run the count function
countJobs();