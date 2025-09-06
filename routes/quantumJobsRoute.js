import express from "express";
import { QuantumJob } from "../database/jobsSchema.js";

const router = express.Router();

// Default route - Get all quantum jobs from MongoDB
router.get("/", async (req, res) => {
  try {
    // Build query object for filtering
    let query = {};
    
    // Filter by keyword if provided
    const keyword = req.query.keyword?.toLowerCase();
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // Filter by location if provided
    const location = req.query.location?.toLowerCase();
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by company if provided
    const company = req.query.company?.toLowerCase();
    if (company && company !== 'all') {
      query.company = { $regex: company, $options: 'i' };
    }
    
    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get total count and jobs in parallel
    const [totalJobs, jobs] = await Promise.all([
      QuantumJob.countDocuments(query),
      QuantumJob.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);
    
    // Format the jobs data
    const formattedJobs = jobs.map(job => ({
      id: job.jobId || job._id.toString(),
      title: job.title || "No title available",
      company: job.company || "Unknown",
      location: job.location || "Remote",
      type: job.type || "Full-time",
      posted: job.posted || new Date().toLocaleDateString(),
      description: job.description || "No description available",
      skills: job.skills || [],
      salary: job.salary || "Competitive",
      experience: job.experience || "Not specified",
      url: job.url || "#",
      portal: job.portal || "Unknown"
    }));
    
    return res.status(200).json({
      jobs: formattedJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
      jobsPerPage: limit,
      source: "mongodb"
    });
  } catch (error) {
    console.error('Error fetching quantum jobs:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    
    // Find the job with the matching ID
    const job = await QuantumJob.findOne({
      $or: [
        { jobId: jobId },
        { _id: jobId }
      ]
    }).lean();
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    // Format the job data
    const formattedJob = {
      id: job.jobId || job._id.toString(),
      title: job.title || "No title available",
      company: job.company || "Unknown",
      location: job.location || "Remote",
      type: job.type || "Full-time",
      posted: job.posted || new Date().toLocaleDateString(),
      description: job.description || "No description available",
      skills: job.skills || [],
      salary: job.salary || "Competitive",
      experience: job.experience || "Not specified",
      url: job.url || "#",
      portal: job.portal || "Unknown"
    };
    
    return res.status(200).json({
      job: formattedJob
    });
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;