import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Job from '../database/jobsSchema.js';

dotenv.config();

// Get the directory name using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Import jobs from JSON file
const importJobs = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Read the JSON file
    const jsonPath = path.join(__dirname, '..', 'pages', 'ibm_jobs_india.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonData);
    
    if (!data.jobs || !Array.isArray(data.jobs)) {
      console.error('Invalid JSON format: Expected an array of jobs');
      process.exit(1);
    }
    
    // Delete existing jobs (optional)
    console.log('Clearing existing jobs...');
    await Job.deleteMany({});
    
    // Map and transform the data to match the schema
    const jobsToInsert = data.jobs.map(job => ({
      tittle: job.title, // Note: Schema has a typo 'tittle' instead of 'title'
      location: job.location,
      id: job.id,
      url: job.url,
      description: job.description || 'No description available',
      company: 'IBM' // Default value
    }));
    
    // Insert the jobs into the database
    console.log(`Importing ${jobsToInsert.length} jobs...`);
    await Job.insertMany(jobsToInsert);
    
    console.log('Jobs imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error importing jobs:', error);
    process.exit(1);
  }
};

// Run the import function
importJobs();