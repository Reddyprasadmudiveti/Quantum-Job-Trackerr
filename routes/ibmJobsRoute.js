import express from "express";
import { IBMJob } from "../database/jobsSchema.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const router = express.Router();

// Get the directory name using ES module syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to read the latest IBM jobs JSON file
const getLatestIBMJobsFile = () => {
  const dataDir = path.join(__dirname, "../data");
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Get all IBM job JSON files
  const files = fs.readdirSync(dataDir)
    .filter(file => file.startsWith('ibm_quantum_jobs') && file.endsWith('.json'))
    .map(file => ({
      name: file,
      path: path.join(dataDir, file),
      time: fs.statSync(path.join(dataDir, file)).mtime.getTime()
    }));
  
  // Sort by modification time (newest first)
  files.sort((a, b) => b.time - a.time);
  
  // If no files found, use the root directory file
  if (files.length === 0) {
    const rootFile = path.join(__dirname, "../ibm_quantum_jobs_india.json");
    if (fs.existsSync(rootFile)) {
      return rootFile;
    }
    return null;
  }
  
  return files[0].path;
};

// Helper function to format job data
const formatJobData = (jobs) => {
  return jobs.map(job => ({
    id: job.id || job._id || Math.random().toString(36).substring(2, 15),
    title: job.title || job.tittle || "No title available",
    company: job.company || "IBM",
    location: job.location || "Remote",
    type: job.type || "Full-time",
    posted: job.posted || new Date().toLocaleDateString(),
    description: job.description || "No description available",
    skills: job.skills || job.requirements?.split(',').map(skill => skill.trim()) || ["Quantum Computing"],
    salary: job.salary || "Competitive",
    experience: job.experience || "Not specified",
    url: job.url || job.applicationUrl || "https://careers.ibm.com"
  }));
};

// Default route - Get IBM jobs from MongoDB with pagination
router.get("/", async (req, res) => {
  try {
    // Build query object for filtering
    let query = {};
    
    // Filter by keyword if provided
    const keyword = req.query.keyword?.toLowerCase();
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Filter by location if provided
    const location = req.query.location?.toLowerCase();
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }
    
    // Apply pagination - default to 9 jobs per page
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    
    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({ 
        success: false,
        message: "Page number must be greater than 0" 
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false,
        message: "Limit must be between 1 and 100" 
      });
    }
    
    // Get total count and jobs in parallel
    const [totalJobs, jobs] = await Promise.all([
      IBMJob.countDocuments(query),
      IBMJob.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalJobs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Format the jobs data
    const formattedJobs = jobs.map(job => ({
      id: job.jobId || job._id.toString(),
      title: job.title || "No title available",
      company: job.company || "IBM",
      location: job.location || "Remote",
      type: job.type || "Full-time",
      posted: job.posted || new Date().toLocaleDateString(),
      description: job.description || "No description available",
      skills: job.skills || ["IBM", "Technology"],
      salary: job.salary || "Competitive",
      experience: job.experience || "Not specified",
      url: job.url || "https://careers.ibm.com",
      source: job.source || "database"
    }));
    
    return res.status(200).json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        currentPage: page,
        totalPages,
        totalJobs,
        jobsPerPage: limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      },
      source: "mongodb"
    });
  } catch (error) {
    console.error('Error fetching IBM jobs:', error);
    return res.status(500).json({ 
      success: false,
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Real-time scraping route
router.get("/realtime", async (req, res) => {
  try {
    const keyword = req.query.keyword || "quantum";
    const limit = req.query.limit || 10;
    
    // Execute the scraper script
    exec(`node practicalScraper.js 1 ${keyword} ${limit}`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Scraper execution error: ${error}`);
        return res.status(500).json({ message: "Scraper execution failed" });
      }
      
      try {
        // Get the latest file after scraping
        const jsonFilePath = getLatestIBMJobsFile();
        
        if (!jsonFilePath) {
          return res.status(404).json({ message: "No IBM jobs data found after scraping" });
        }
        
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonData);
        
        // Extract jobs and save to MongoDB
        const jobs = data.jobs || [];
        const jobsToSave = [];
        
        for (const job of jobs) {
          const jobId = job.id || job.url || `${job.title}-${job.company}`;
          
          // Check if job already exists
          const existingJob = await IBMJob.findOne({ jobId });
          
          if (!existingJob) {
            jobsToSave.push({
              title: job.title || "No title available",
              company: job.company || "IBM",
              location: job.location || "Remote",
              type: job.type || "Full-time",
              posted: job.posted || new Date().toLocaleDateString(),
              description: job.description || "No description available",
              skills: Array.isArray(job.skills) ? job.skills : ["Quantum Computing"],
              salary: job.salary || "Competitive",
              experience: job.experience || "Not specified",
              url: job.url || "https://careers.ibm.com",
              jobId: jobId
            });
          }
        }
        
        // Save new jobs to MongoDB
        if (jobsToSave.length > 0) {
          await IBMJob.insertMany(jobsToSave);
        }
        
        // Return the scraped jobs
        const formattedJobs = jobs.map(job => ({
          id: job.id || job.url || `${job.title}-${job.company}`,
          title: job.title || "No title available",
          company: job.company || "IBM",
          location: job.location || "Remote",
          type: job.type || "Full-time",
          posted: job.posted || new Date().toLocaleDateString(),
          description: job.description || "No description available",
          skills: Array.isArray(job.skills) ? job.skills : ["Quantum Computing"],
          salary: job.salary || "Competitive",
          experience: job.experience || "Not specified",
          url: job.url || "https://careers.ibm.com"
        }));
        
        return res.status(200).json({
          jobs: formattedJobs,
          totalJobs: formattedJobs.length,
          newJobsSaved: jobsToSave.length,
          source: "realtime"
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ message: "Database error during scraping" });
      }
    });
  } catch (error) {
    console.error('Error in real-time scraping:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// IBM India specific scraping route
router.get("/india-scrape", async (req, res) => {
  try {
    const keyword = req.query.keyword || "engineer";
    const limit = req.query.limit || 10;
    
    // Execute the scraper script with India location
    exec(`node practicalScraper.js 1 ${keyword} ${limit} India`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`India scraper execution error: ${error}`);
        return res.status(500).json({ message: "India scraper execution failed" });
      }
      
      try {
        // Get the latest file after scraping
        const jsonFilePath = getLatestIBMJobsFile();
        
        if (!jsonFilePath) {
          return res.status(404).json({ message: "No IBM India jobs data found after scraping" });
        }
        
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        const data = JSON.parse(jsonData);
        
        // Extract jobs and save to MongoDB
        const jobs = data.jobs || [];
        const jobsToSave = [];
        
        for (const job of jobs) {
          const jobId = job.id || job.url || `${job.title}-${job.company}`;
          
          // Check if job already exists
          const existingJob = await IBMJob.findOne({ jobId });
          
          if (!existingJob) {
            jobsToSave.push({
              title: job.title || "No title available",
              company: job.company || "IBM",
              location: job.location || "India",
              type: job.type || "Full-time",
              posted: job.posted || new Date().toLocaleDateString(),
              description: job.description || "No description available",
              skills: Array.isArray(job.skills) ? job.skills : ["Quantum Computing"],
              salary: job.salary || "Competitive",
              experience: job.experience || "Not specified",
              url: job.url || "https://careers.ibm.com",
              jobId: jobId
            });
          }
        }
        
        // Save new jobs to MongoDB
        if (jobsToSave.length > 0) {
          await IBMJob.insertMany(jobsToSave);
        }
        
        // Return the scraped jobs
        const formattedJobs = jobs.map(job => ({
          id: job.id || job.url || `${job.title}-${job.company}`,
          title: job.title || "No title available",
          company: job.company || "IBM",
          location: job.location || "India",
          type: job.type || "Full-time",
          posted: job.posted || new Date().toLocaleDateString(),
          description: job.description || "No description available",
          skills: Array.isArray(job.skills) ? job.skills : ["Quantum Computing"],
          salary: job.salary || "Competitive",
          experience: job.experience || "Not specified",
          url: job.url || "https://careers.ibm.com"
        }));
        
        return res.status(200).json({
          jobs: formattedJobs,
          totalJobs: formattedJobs.length,
          newJobsSaved: jobsToSave.length,
          source: "ibm-india"
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ message: "Database error during scraping" });
      }
    });
  } catch (error) {
    console.error('Error in IBM India scraping:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get IBM India jobs from MongoDB
router.get("/india", async (req, res) => {
  try {
    // Build query for India-specific jobs
    let query = {
      location: { $regex: 'india', $options: 'i' }
    };
    
    // Filter by keyword if provided
    const keyword = req.query.keyword?.toLowerCase();
    if (keyword) {
      query.$and = [
        { location: { $regex: 'india', $options: 'i' } },
        {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
          ]
        }
      ];
    }
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get jobs from MongoDB
    const jobs = await IBMJob.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Format the jobs data
    const formattedJobs = jobs.map(job => ({
      id: job.jobId || job._id.toString(),
      title: job.title || "No title available",
      company: job.company || "IBM",
      location: job.location || "Remote",
      type: job.type || "Full-time",
      posted: job.posted || new Date().toLocaleDateString(),
      description: job.description || "No description available",
      skills: job.skills || ["Quantum Computing"],
      salary: job.salary || "Competitive",
      experience: job.experience || "Not specified",
      url: job.url || "https://careers.ibm.com"
    }));
    
    return res.status(200).json(formattedJobs);
  } catch (error) {
    console.error('Error fetching IBM India jobs:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;