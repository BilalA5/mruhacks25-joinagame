// Simple test script to verify setup
console.log('🧪 Testing JoinAGame setup...');

// Test 1: Check if we can import required modules
try {
  const express = require('express');
  const cors = require('cors');
  console.log('✅ Backend dependencies loaded successfully');
  console.log(`   Express version: ${express.version || 'loaded'}`);
} catch (error) {
  console.error('❌ Backend dependencies missing:', error.message);
}

// Test 2: Check if we can access Node.js built-ins
try {
  const fs = require('fs');
  const path = require('path');
  console.log('✅ Node.js built-ins available');
} catch (error) {
  console.error('❌ Node.js built-ins not available:', error.message);
}

// Test 3: Check if data.json exists or can be created
try {
  const fs = require('fs');
  const path = require('path');
  const dataFile = path.join(__dirname, 'data.json');
  
  if (fs.existsSync(dataFile)) {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log('✅ Data file exists and is readable');
    console.log(`   Users: ${data.users?.length || 0}`);
    console.log(`   Games: ${data.games?.length || 0}`);
  } else {
    console.log('⚠️  Data file does not exist (will be created on first run)');
  }
} catch (error) {
  console.error('❌ Data file issue:', error.message);
}

console.log('\n🎉 Setup test completed!');
console.log('📋 If you see ✅ for all tests, the backend is ready to run.');
console.log('🚀 Run "npm start" to start the backend server.');
