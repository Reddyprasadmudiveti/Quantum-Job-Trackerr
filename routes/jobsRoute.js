import express from "express";
import { getJobs } from "../pages/jobsPage.js";

const router = express.Router();

// Default route - will use default pagination (page 1, limit 10)
router.get("/", (req, res) => {
  req.params = { page: 1, limit: 10 };
  return getJobs(req, res);
});

// Route with pagination parameters
router.get("/:page/:limit", getJobs);

export default router;
