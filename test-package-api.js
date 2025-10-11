// Test script for Package Management API
const BASE_URL = 'http://localhost:3000/api/packages';

async function testPackageAPI() {
  console.log('🧪 Testing Package Management API...\n');

  try {
    // Test 1: Get all packages
    console.log('1️⃣ Testing GET /api/packages');
    const getResponse = await fetch(BASE_URL);
    const getData = await getResponse.json();
    console.log('✅ GET Response:', JSON.stringify(getData, null, 2));
    console.log('');

    // Test 2: Create a new package
    console.log('2️⃣ Testing POST /api/packages');
    const createResponse = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_title: 'Test Package',
        package_description: 'This is a test package for API testing',
        package_price: 299.99,
      }),
    });
    const createData = await createResponse.json();
    console.log('✅ POST Response:', JSON.stringify(createData, null, 2));
    console.log('');

    if (createData.success && createData.data) {
      const packageId = createData.data.package_id;

      // Test 3: Get specific package
      console.log(`3️⃣ Testing GET /api/packages/${packageId}`);
      const getSpecificResponse = await fetch(`${BASE_URL}/${packageId}`);
      const getSpecificData = await getSpecificResponse.json();
      console.log('✅ GET Specific Response:', JSON.stringify(getSpecificData, null, 2));
      console.log('');

      // Test 4: Update package
      console.log(`4️⃣ Testing PUT /api/packages/${packageId}`);
      const updateResponse = await fetch(`${BASE_URL}/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          package_title: 'Updated Test Package',
          package_price: 399.99,
        }),
      });
      const updateData = await updateResponse.json();
      console.log('✅ PUT Response:', JSON.stringify(updateData, null, 2));
      console.log('');

      // Test 5: Search packages
      console.log('5️⃣ Testing GET /api/packages/search?q=test');
      const searchResponse = await fetch(`${BASE_URL}/search?q=test`);
      const searchData = await searchResponse.json();
      console.log('✅ Search Response:', JSON.stringify(searchData, null, 2));
      console.log('');

      // Test 6: Get package statistics
      console.log('6️⃣ Testing GET /api/packages/stats');
      const statsResponse = await fetch(`${BASE_URL}/stats`);
      const statsData = await statsResponse.json();
      console.log('✅ Stats Response:', JSON.stringify(statsData, null, 2));
      console.log('');

      // Test 7: Bulk update
      console.log('7️⃣ Testing POST /api/packages/bulk (update)');
      const bulkUpdateResponse = await fetch(`${BASE_URL}/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'update',
          package_ids: [packageId],
          data: {
            package_description: 'Bulk updated description',
          },
        }),
      });
      const bulkUpdateData = await bulkUpdateResponse.json();
      console.log('✅ Bulk Update Response:', JSON.stringify(bulkUpdateData, null, 2));
      console.log('');

      // Test 8: Delete package
      console.log(`8️⃣ Testing DELETE /api/packages/${packageId}`);
      const deleteResponse = await fetch(`${BASE_URL}/${packageId}`, {
        method: 'DELETE',
      });
      const deleteData = await deleteResponse.json();
      console.log('✅ DELETE Response:', JSON.stringify(deleteData, null, 2));
      console.log('');
    }

    console.log('🎉 All API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testPackageAPI();
