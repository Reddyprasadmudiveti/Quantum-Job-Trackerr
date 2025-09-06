import fetch from 'node-fetch';

// Test the jobs API endpoint
const testJobsAPI = async () => {
  try {
    // Test default route
    console.log('Testing default jobs route...');
    const defaultResponse = await fetch('http://localhost:3000/api/jobs');
    const defaultData = await defaultResponse.json();
    
    console.log(`Status: ${defaultResponse.status}`);
    console.log(`Total jobs: ${defaultData.totalJobs}`);
    console.log(`Jobs per page: ${defaultData.jobsPerPage}`);
    console.log(`Current page: ${defaultData.currentPage}`);
    console.log(`Total pages: ${defaultData.totalPages}`);
    console.log('\nSample jobs:');
    defaultData.jobs.slice(0, 3).forEach(job => {
      console.log(`- ${job.title} (${job.location}) - ${job.company}`);
    });
    
    // Test pagination
    console.log('\n\nTesting pagination (page 2, limit 5)...');
    const paginatedResponse = await fetch('http://localhost:3000/api/jobs/2/5');
    const paginatedData = await paginatedResponse.json();
    
    console.log(`Status: ${paginatedResponse.status}`);
    console.log(`Total jobs: ${paginatedData.totalJobs}`);
    console.log(`Jobs per page: ${paginatedData.jobsPerPage}`);
    console.log(`Current page: ${paginatedData.currentPage}`);
    console.log(`Total pages: ${paginatedData.totalPages}`);
    console.log('\nSample jobs:');
    paginatedData.jobs.forEach(job => {
      console.log(`- ${job.title} (${job.location}) - ${job.company}`);
    });
    
  } catch (error) {
    console.error('Error testing jobs API:', error);
  }
};

// Run the test function
testJobsAPI();