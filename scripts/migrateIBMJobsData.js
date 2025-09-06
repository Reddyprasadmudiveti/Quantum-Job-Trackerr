import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IBMJob } from '../database/jobsSchema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGOURI = process.env.MONGOURI;

async function migrateIBMJobsData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGOURI);
    console.log('Connected to MongoDB');

    // Read the IBM jobs JSON file
    const jsonFilePath = path.join(__dirname, '../ibm_jobs_india.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error('IBM jobs JSON file not found');
    }

    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error('Invalid JSON structure - jobs array not found');
    }

    console.log(`Found ${data.jobs.length} IBM jobs to migrate`);

    // Clear existing IBM jobs (optional - remove this line if you want to keep existing data)
    await IBMJob.deleteMany({});
    console.log('Cleared existing IBM jobs');

    // Process and insert jobs
    const jobsToInsert = [];
    let duplicateCount = 0;
    let processedCount = 0;
    let insertedCount = 0;

    for (const job of data.jobs) {
      processedCount++;
      
      // Create a unique job ID based on title, location, and a hash to avoid duplicates
      const baseId = `${job.title}-${job.location}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      let jobId = baseId;
      let counter = 1;
      
      // Check for existing job and create unique ID if needed
      while (await IBMJob.findOne({ jobId })) {
        jobId = `${baseId}-${counter}`;
        counter++;
        if (counter === 1) duplicateCount++; // Count original as duplicate
      }

      // Format the job data
      const formattedJob = {
        title: job.title || 'No title available',
        company: 'IBM',
        location: job.location || 'Remote',
        type: 'Full-time',
        posted: new Date().toLocaleDateString(),
        description: job.description || 'No description available',
        skills: job.skills || ['IBM', 'Technology'],
        salary: 'Competitive',
        experience: 'Not specified',
        url: job.url || 'https://www.ibm.com/careers',
        jobId: jobId,
        source: 'ibm_jobs_india.json'
      };

      jobsToInsert.push(formattedJob);

      // Insert in batches of 50 to avoid memory issues and handle duplicates better
      if (jobsToInsert.length >= 50) {
        try {
          await IBMJob.insertMany(jobsToInsert, { ordered: false });
          insertedCount += jobsToInsert.length;
          console.log(`Inserted batch of ${jobsToInsert.length} jobs (${processedCount}/${data.jobs.length} processed)`);
        } catch (error) {
          // Handle duplicate key errors gracefully
          if (error.code === 11000) {
            console.log(`Batch had some duplicates, continuing... (${processedCount}/${data.jobs.length} processed)`);
            insertedCount += (jobsToInsert.length - (error.writeErrors?.length || 0));
          } else {
            throw error;
          }
        }
        jobsToInsert.length = 0; // Clear the array
      }
    }

    // Insert remaining jobs
    if (jobsToInsert.length > 0) {
      try {
        await IBMJob.insertMany(jobsToInsert, { ordered: false });
        insertedCount += jobsToInsert.length;
        console.log(`Inserted final batch of ${jobsToInsert.length} jobs`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Final batch had some duplicates, but completed`);
          insertedCount += (jobsToInsert.length - (error.writeErrors?.length || 0));
        } else {
          throw error;
        }
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total jobs processed: ${processedCount}`);
    console.log(`   - Jobs inserted: ${insertedCount}`);
    console.log(`   - Duplicates handled: ${duplicateCount}`);

    // Verify the migration
    const totalJobsInDB = await IBMJob.countDocuments();
    console.log(`   - Total IBM jobs in database: ${totalJobsInDB}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateIBMJobsData();