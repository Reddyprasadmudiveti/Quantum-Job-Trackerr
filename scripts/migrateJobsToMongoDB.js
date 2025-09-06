import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { IBMJob, QuantumJob } from "../database/jobsSchema.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGOURI = process.env.MONGOURI;

async function migrateIBMJobs() {
    console.log("Starting IBM jobs migration...");

    try {
        // Read IBM jobs from JSON files
        const ibmJobsPath = path.join(__dirname, "../ibm_quantum_jobs_india.json");
        const ibmIndiaJobsPath = path.join(__dirname, "../ibm_jobs_india.json");

        let allIBMJobs = [];

        // Read main IBM jobs file
        if (fs.existsSync(ibmJobsPath)) {
            const ibmData = JSON.parse(fs.readFileSync(ibmJobsPath, 'utf8'));
            const jobs = ibmData.jobs || [];
            allIBMJobs = allIBMJobs.concat(jobs);
            console.log(`Found ${jobs.length} jobs in main IBM file`);
        }

        // Read IBM India jobs file
        if (fs.existsSync(ibmIndiaJobsPath)) {
            const ibmIndiaData = JSON.parse(fs.readFileSync(ibmIndiaJobsPath, 'utf8'));
            const jobs = ibmIndiaData.jobs || [];
            allIBMJobs = allIBMJobs.concat(jobs);
            console.log(`Found ${jobs.length} jobs in IBM India file`);
        }

        // Read from data directory
        const dataDir = path.join(__dirname, "../data");
        if (fs.existsSync(dataDir)) {
            const files = fs.readdirSync(dataDir)
                .filter(file => file.startsWith('ibm_quantum_jobs') && file.endsWith('.json'));

            for (const file of files) {
                const filePath = path.join(dataDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const jobs = data.jobs || [];
                allIBMJobs = allIBMJobs.concat(jobs);
                console.log(`Found ${jobs.length} jobs in ${file}`);
            }
        }

        console.log(`Total IBM jobs found: ${allIBMJobs.length}`);

        // Remove duplicates based on job ID or URL
        const uniqueJobs = [];
        const seenIds = new Set();

        for (const job of allIBMJobs) {
            const jobId = job.id || job.url || `${job.title}-${job.company}`;
            if (!seenIds.has(jobId)) {
                seenIds.add(jobId);
                uniqueJobs.push({
                    title: job.title || job.tittle || "No title available",
                    company: job.company || "IBM",
                    location: job.location || "Remote",
                    type: job.type || "Full-time",
                    posted: job.posted || new Date().toLocaleDateString(),
                    description: job.description || "No description available",
                    skills: Array.isArray(job.skills) ? job.skills :
                        (job.requirements ? job.requirements.split(',').map(s => s.trim()) : ["Quantum Computing"]),
                    salary: job.salary || "Competitive",
                    experience: job.experience || "Not specified",
                    url: job.url || job.applicationUrl || "https://careers.ibm.com",
                    jobId: jobId
                });
            }
        }

        console.log(`Unique IBM jobs to migrate: ${uniqueJobs.length}`);

        // Insert jobs into MongoDB
        if (uniqueJobs.length > 0) {
            await IBMJob.deleteMany({}); // Clear existing data
            await IBMJob.insertMany(uniqueJobs);
            console.log(`Successfully migrated ${uniqueJobs.length} IBM jobs to MongoDB`);
        }

    } catch (error) {
        console.error("Error migrating IBM jobs:", error);
    }
}

async function migrateQuantumJobs() {
    console.log("Starting quantum jobs migration...");

    try {
        // Read quantum jobs from JSON file
        const quantumJobsPath = path.join(__dirname, "../quantum_jobs_complete.json");

        if (!fs.existsSync(quantumJobsPath)) {
            console.log("Quantum jobs file not found, skipping migration");
            return;
        }

        const quantumData = JSON.parse(fs.readFileSync(quantumJobsPath, 'utf8'));
        const jobs = quantumData.jobs || [];

        console.log(`Found ${jobs.length} quantum jobs`);

        // Remove duplicates and format jobs
        const uniqueJobs = [];
        const seenIds = new Set();

        for (const job of jobs) {
            const jobId = job.id || job.url || `${job.title}-${job.company}`;
            if (!seenIds.has(jobId)) {
                seenIds.add(jobId);
                uniqueJobs.push({
                    title: job.title || "No title available",
                    company: job.company || "Unknown",
                    location: job.location || "Remote",
                    type: job.type || "Full-time",
                    posted: job.posted || new Date().toLocaleDateString(),
                    description: job.description || "No description available",
                    skills: Array.isArray(job.skills) ? job.skills : [],
                    salary: job.salary || "Competitive",
                    experience: job.experience || "Not specified",
                    url: job.link || job.url || "#",
                    portal: job.portal || "Unknown",
                    jobId: jobId
                });
            }
        }

        console.log(`Unique quantum jobs to migrate: ${uniqueJobs.length}`);

        // Insert jobs into MongoDB
        if (uniqueJobs.length > 0) {
            await QuantumJob.deleteMany({}); // Clear existing data
            await QuantumJob.insertMany(uniqueJobs);
            console.log(`Successfully migrated ${uniqueJobs.length} quantum jobs to MongoDB`);
        }

    } catch (error) {
        console.error("Error migrating quantum jobs:", error);
    }
}

async function main() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGOURI);
        console.log("Connected to MongoDB");

        // Run migrations
        await migrateIBMJobs();
        await migrateQuantumJobs();

        console.log("Migration completed successfully!");

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
}

main();