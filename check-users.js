const mongoose = require('mongoose');
require('dotenv').config({ path: './Backend/.env' });

// Connection string from .env file
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

console.log(`Connecting to MongoDB with URI: ${MONGODB_URI.substring(0, 20)}...`);

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Check if users collection exists
    const hasUsers = collections.some(c => c.name === 'users');
    if (!hasUsers) {
      console.log('No users collection found. It will be created when the first user is saved.');
    } else {
      // Count users
      const usersCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log(`Found ${usersCount} users in database`);
      
      // Show sample users
      if (usersCount > 0) {
        const sampleUsers = await mongoose.connection.db.collection('users').find({}).limit(3).toArray();
        console.log('Sample users:');
        sampleUsers.forEach((user, index) => {
          console.log(`[${index + 1}] ${user.email || 'No email'} (${user.uid || 'No UID'})`);
        });
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

checkUsers();
