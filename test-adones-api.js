const BASE_URL = 'http://localhost:3000/api';

// Test data
const sampleAdOnes = [
  {
    ad_title: 'Priority Processing',
    ad_price: 99.99,
    ad_description: 'Get your request processed with priority handling',
    ad_information: 'This add-on ensures your request is processed within 24 hours instead of the standard 3-5 business days.',
  },
  {
    ad_title: 'Express Delivery',
    ad_price: 149.99,
    ad_description: 'Fast-track document delivery',
    ad_information: 'Receive your documents via express courier service within 2-3 business days.',
  },
  {
    ad_title: 'Legal Consultation',
    ad_price: 299.99,
    ad_description: 'One-on-one legal consultation session',
    ad_information: '30-minute consultation with our legal expert to discuss your business structure and compliance requirements.',
  },
  {
    ad_title: 'Document Review',
    ad_price: 199.99,
    ad_description: 'Professional document review service',
    ad_information: 'Our experts will review all your submitted documents for accuracy and completeness.',
  },
  {
    ad_title: 'Compliance Monitoring',
    ad_price: 399.99,
    ad_description: 'Ongoing compliance monitoring for 1 year',
    ad_information: 'Monthly compliance checks and notifications for regulatory changes affecting your business.',
  },
];

// Utility function to make API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    console.log(`\n${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return { response, result };
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error.message);
    return { error };
  }
}

// Test functions
async function testCreateAdOnes() {
  console.log('\n=== Testing Create Add-ons ===');
  
  for (const adOne of sampleAdOnes) {
    await apiCall('/adones', 'POST', adOne);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
}

async function testGetAllAdOnes() {
  console.log('\n=== Testing Get All Add-ons ===');
  
  // Test basic GET
  await apiCall('/adones');
  
  // Test with pagination
  await apiCall('/adones?page=1&limit=3');
  
  // Test with search
  await apiCall('/adones?search=priority');
  
  // Test with price filter
  await apiCall('/adones?minPrice=100&maxPrice=300');
  
  // Test with sorting
  await apiCall('/adones?sortBy=ad_price&sortOrder=asc');
}

async function testGetAdOneById() {
  console.log('\n=== Testing Get Add-on by ID ===');
  
  // First get all to find an ID
  const { result } = await apiCall('/adones?limit=1');
  if (result.success && result.data.length > 0) {
    const adId = result.data[0].ad_id;
    await apiCall(`/adones/${adId}`);
    
    // Test invalid ID
    await apiCall('/adones/99999');
  }
}

async function testUpdateAdOne() {
  console.log('\n=== Testing Update Add-on ===');
  
  // First get all to find an ID
  const { result } = await apiCall('/adones?limit=1');
  if (result.success && result.data.length > 0) {
    const adId = result.data[0].ad_id;
    
    // Update add-on
    await apiCall(`/adones/${adId}`, 'PUT', {
      ad_title: 'Updated Priority Processing',
      ad_price: 129.99,
      ad_description: 'Updated description for priority processing',
    });
    
    // Test invalid update
    await apiCall(`/adones/${adId}`, 'PUT', {
      ad_price: -50, // Invalid negative price
    });
  }
}

async function testSearchAdOnes() {
  console.log('\n=== Testing Search Add-ons ===');
  
  // Basic search
  await apiCall('/adones/search?q=legal');
  
  // Advanced search with filters
  await apiCall('/adones/search?q=processing&minPrice=50&maxPrice=200&sortBy=price&sortOrder=asc');
  
  // Search by category
  await apiCall('/adones/search?category=document&hasRequests=false');
  
  // Search with pagination
  await apiCall('/adones/search?limit=2&offset=0');
}

async function testAdOnesStats() {
  console.log('\n=== Testing Add-ons Statistics ===');
  
  // Get all-time stats
  await apiCall('/adones/stats');
  
  // Get monthly stats
  await apiCall('/adones/stats?period=month');
  
  // Get yearly stats
  await apiCall('/adones/stats?period=year');
}

async function testBulkOperations() {
  console.log('\n=== Testing Bulk Operations ===');
  
  // First get some IDs
  const { result } = await apiCall('/adones?limit=3');
  if (result.success && result.data.length >= 2) {
    const ids = result.data.map(ad => ad.ad_id);
    
    // Bulk update
    await apiCall('/adones/bulk', 'POST', {
      operation: 'update',
      ids: ids.slice(0, 2),
      data: {
        ad_description: 'Bulk updated description',
      },
    });
    
    // Bulk export
    await apiCall('/adones/bulk', 'POST', {
      operation: 'export',
      ids: ids.slice(0, 2),
    });
    
    // Test invalid operation
    await apiCall('/adones/bulk', 'POST', {
      operation: 'invalid',
      ids: ids.slice(0, 2),
    });
  }
}

async function testDeleteAdOne() {
  console.log('\n=== Testing Delete Add-on ===');
  
  // First get all to find an ID
  const { result } = await apiCall('/adones?limit=1');
  if (result.success && result.data.length > 0) {
    const adId = result.data[0].ad_id;
    
    // Try to delete (this might fail if the add-on is being used)
    await apiCall(`/adones/${adId}`, 'DELETE');
    
    // Test invalid ID
    await apiCall('/adones/99999', 'DELETE');
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Add-ons Management API Tests');
  console.log('==========================================');
  
  try {
    // Run tests in sequence
    await testCreateAdOnes();
    await testGetAllAdOnes();
    await testGetAdOneById();
    await testUpdateAdOne();
    await testSearchAdOnes();
    await testAdOnesStats();
    await testBulkOperations();
    await testDeleteAdOne();
    
    console.log('\n✅ All tests completed!');
    console.log('\n📊 API Endpoints Summary:');
    console.log('GET    /api/adones              - List all add-ons with pagination and filters');
    console.log('POST   /api/adones              - Create new add-on');
    console.log('GET    /api/adones/[id]         - Get specific add-on');
    console.log('PUT    /api/adones/[id]         - Update add-on');
    console.log('DELETE /api/adones/[id]         - Delete add-on');
    console.log('GET    /api/adones/stats        - Get add-ons statistics');
    console.log('GET    /api/adones/search       - Advanced search');
    console.log('POST   /api/adones/bulk         - Bulk operations');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
runTests();
