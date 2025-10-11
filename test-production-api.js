// Production API Testing Script
const PRODUCTION_URL = 'https://corpulate.vercel.app'; // Update this after deployment
const LOCAL_URL = 'http://localhost:3000';

// Use local URL for testing, update to production URL after deployment
const BASE_URL = LOCAL_URL;

async function testProductionAPI() {
  console.log('🧪 Testing Production API Endpoints...\n');
  console.log(`📍 Testing against: ${BASE_URL}\n`);

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check');
    try {
      const healthResponse = await fetch(`${BASE_URL}/api/health`);
      const healthData = await healthResponse.json();
      console.log('✅ Health Check:', JSON.stringify(healthData, null, 2));
    } catch (error) {
      console.log('⚠️ Health endpoint not available, continuing...');
    }
    console.log('');

    // Test 2: Get all packages
    console.log('2️⃣ Testing GET /api/packages');
    const getResponse = await fetch(`${BASE_URL}/api/packages`);
    const getData = await getResponse.json();
    console.log('✅ GET Packages Response:', JSON.stringify(getData, null, 2));
    console.log('');

    // Test 3: Create test packages
    console.log('3️⃣ Testing POST /api/packages (Creating test packages)');
    const testPackages = [
      {
        package_title: 'Basic Startup Package',
        package_description: 'Perfect for new businesses starting their journey',
        package_price: 99.99
      },
      {
        package_title: 'Professional Business Package',
        package_description: 'Comprehensive solution for established businesses',
        package_price: 299.99
      },
      {
        package_title: 'Enterprise Premium Package',
        package_description: 'Complete business management solution for large enterprises',
        package_price: 599.99
      }
    ];

    const createdPackages = [];
    for (const pkg of testPackages) {
      try {
        const createResponse = await fetch(`${BASE_URL}/api/packages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pkg),
        });
        const createData = await createResponse.json();
        console.log(`✅ Created Package: ${pkg.package_title}`, createData.success ? 'SUCCESS' : 'FAILED');
        if (createData.success) {
          createdPackages.push(createData.data);
        }
      } catch (error) {
        console.log(`❌ Failed to create package: ${pkg.package_title}`, error.message);
      }
    }
    console.log('');

    // Test 4: Get package statistics
    console.log('4️⃣ Testing GET /api/packages/stats');
    const statsResponse = await fetch(`${BASE_URL}/api/packages/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Package Statistics:', JSON.stringify(statsData, null, 2));
    console.log('');

    // Test 5: Search packages
    console.log('5️⃣ Testing GET /api/packages/search');
    const searchResponse = await fetch(`${BASE_URL}/api/packages/search?q=package&min_price=100&max_price=500`);
    const searchData = await searchResponse.json();
    console.log('✅ Search Results:', JSON.stringify(searchData, null, 2));
    console.log('');

    // Test 6: Test authentication endpoints
    console.log('6️⃣ Testing Authentication Endpoints');
    
    // Test signup
    try {
      const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `test${Date.now()}@example.com`,
          phoneNumber: '+1234567890',
          password: 'test123456'
        }),
      });
      const signupData = await signupResponse.json();
      console.log('✅ Signup Test:', signupData.success ? 'SUCCESS' : 'FAILED');
      if (signupData.success) {
        console.log('   Token received:', signupData.token ? 'YES' : 'NO');
        console.log('   User created:', signupData.user ? 'YES' : 'NO');
      }
    } catch (error) {
      console.log('❌ Signup test failed:', error.message);
    }

    // Test login
    try {
      const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123456'
        }),
      });
      const loginData = await loginResponse.json();
      console.log('✅ Login Test:', loginData.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ Login test failed:', error.message);
    }
    console.log('');

    // Test 7: Test email functionality
    console.log('7️⃣ Testing Email Functionality');
    try {
      const emailResponse = await fetch(`${BASE_URL}/api/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'test@example.com',
          subject: 'Production Test Email'
        }),
      });
      const emailData = await emailResponse.json();
      console.log('✅ Email Test:', emailData.success ? 'SUCCESS' : 'FAILED');
    } catch (error) {
      console.log('❌ Email test failed:', error.message);
    }
    console.log('');

    // Test 8: Cleanup - Delete test packages
    console.log('8️⃣ Cleaning up test packages');
    for (const pkg of createdPackages) {
      try {
        const deleteResponse = await fetch(`${BASE_URL}/api/packages/${pkg.package_id}`, {
          method: 'DELETE',
        });
        const deleteData = await deleteResponse.json();
        console.log(`✅ Deleted Package: ${pkg.package_title}`, deleteData.success ? 'SUCCESS' : 'FAILED');
      } catch (error) {
        console.log(`❌ Failed to delete package: ${pkg.package_title}`, error.message);
      }
    }
    console.log('');

    console.log('🎉 Production API testing completed!');
    console.log('\n📋 Summary:');
    console.log(`   Base URL: ${BASE_URL}`);
    console.log(`   Packages API: ${BASE_URL}/api/packages`);
    console.log(`   Auth API: ${BASE_URL}/api/auth`);
    console.log(`   Stats API: ${BASE_URL}/api/packages/stats`);
    console.log(`   Search API: ${BASE_URL}/api/packages/search`);

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
testProductionAPI();
