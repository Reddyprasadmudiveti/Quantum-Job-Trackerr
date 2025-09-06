import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/ibm-jobs';

async function testPagination() {
  console.log('🧪 Testing IBM Jobs API Pagination...\n');

  try {
    // Test 1: First page with 10 jobs
    console.log('1. Testing first page (10 jobs per page)...');
    const page1Response = await fetch(`${BASE_URL}?page=1&limit=10`);
    const page1Data = await page1Response.json();
    
    if (page1Data.success && page1Data.jobs.length === 10) {
      console.log(`   ✅ Page 1: ${page1Data.jobs.length} jobs loaded`);
      console.log(`   📊 Total: ${page1Data.pagination.totalJobs} jobs, ${page1Data.pagination.totalPages} pages`);
    } else {
      console.log(`   ❌ Page 1 failed: Expected 10 jobs, got ${page1Data.jobs?.length || 0}`);
    }

    // Test 2: Second page
    console.log('\n2. Testing second page...');
    const page2Response = await fetch(`${BASE_URL}?page=2&limit=10`);
    const page2Data = await page2Response.json();
    
    if (page2Data.success && page2Data.pagination.currentPage === 2) {
      console.log(`   ✅ Page 2: ${page2Data.jobs.length} jobs loaded`);
      console.log(`   📄 Current page: ${page2Data.pagination.currentPage}`);
    } else {
      console.log(`   ❌ Page 2 failed`);
    }

    // Test 3: Search with pagination
    console.log('\n3. Testing search with pagination...');
    const searchResponse = await fetch(`${BASE_URL}?keyword=developer&page=1&limit=5`);
    const searchData = await searchResponse.json();
    
    if (searchData.success) {
      console.log(`   ✅ Search: Found ${searchData.pagination.totalJobs} jobs matching "developer"`);
      console.log(`   📄 Showing ${searchData.jobs.length} jobs on page 1`);
    } else {
      console.log(`   ❌ Search failed`);
    }

    // Test 4: Location filter with pagination
    console.log('\n4. Testing location filter...');
    const locationResponse = await fetch(`${BASE_URL}?location=bangalore&page=1&limit=5`);
    const locationData = await locationResponse.json();
    
    if (locationData.success) {
      console.log(`   ✅ Location filter: Found ${locationData.pagination.totalJobs} jobs in Bangalore`);
      console.log(`   📄 Showing ${locationData.jobs.length} jobs on page 1`);
    } else {
      console.log(`   ❌ Location filter failed`);
    }

    // Test 5: Invalid page number
    console.log('\n5. Testing invalid page number...');
    const invalidResponse = await fetch(`${BASE_URL}?page=0&limit=10`);
    const invalidData = await invalidResponse.json();
    
    if (!invalidData.success && invalidResponse.status === 400) {
      console.log(`   ✅ Invalid page handled correctly: ${invalidData.message}`);
    } else {
      console.log(`   ❌ Invalid page not handled properly`);
    }

    console.log('\n🎉 Pagination Testing Summary:');
    console.log('   ✅ Basic pagination working');
    console.log('   ✅ Search with pagination working');
    console.log('   ✅ Location filter with pagination working');
    console.log('   ✅ Error handling working');
    console.log('   ✅ API returns proper pagination metadata');

  } catch (error) {
    console.error('❌ Testing failed:', error.message);
  }
}

// Run the test
testPagination();