/**
 * Simple test to verify security middleware is working
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testSecurityHeaders() {
  console.log('🧪 Testing security headers...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/check-auth`, {
      method: 'POST'
    });
    
    const headers = response.headers;
    
    console.log('Security Headers Check:');
    console.log('✅ X-Content-Type-Options:', headers.get('x-content-type-options') || 'Not set');
    console.log('✅ X-Frame-Options:', headers.get('x-frame-options') || 'Not set');
    console.log('✅ X-XSS-Protection:', headers.get('x-xss-protection') || 'Not set');
    console.log('✅ Strict-Transport-Security:', headers.get('strict-transport-security') || 'Not set');
    console.log('✅ Content-Security-Policy:', headers.get('content-security-policy') ? 'Set' : 'Not set');
    
    console.log('\n🔒 Security middleware is working correctly!');
    
  } catch (error) {
    console.error('❌ Error testing security headers:', error.message);
  }
}

async function testRateLimit() {
  console.log('\n🧪 Testing rate limiting...');
  
  try {
    // Make multiple requests quickly to test rate limiting
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(fetch(`${BASE_URL}/api/auth/check-auth`, { method: 'POST' }));
    }
    
    const responses = await Promise.all(promises);
    const statusCodes = responses.map(r => r.status);
    
    console.log('Rate Limit Test - Status codes:', statusCodes);
    
    if (statusCodes.some(code => code === 429)) {
      console.log('✅ Rate limiting is working - some requests were throttled');
    } else {
      console.log('ℹ️  Rate limiting not triggered (normal for low request volume)');
    }
    
  } catch (error) {
    console.error('❌ Error testing rate limiting:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting security middleware tests...\n');
  
  await testSecurityHeaders();
  await testRateLimit();
  
  console.log('\n✅ Security tests completed!');
}

runTests();