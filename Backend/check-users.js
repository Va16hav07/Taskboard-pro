import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Check .env file
const envPath = path.join(__dirname, '.env');
console.log('Checking .env file:', fs.existsSync(envPath) ? 'Exists' : 'Missing');

// Check MongoDB URI
const mongoUri = process.env.MONGODB_URI;
console.log('MongoDB URI defined:', mongoUri ? 'Yes' : 'No');
if (mongoUri) {
  console.log('MongoDB URI starts with:', mongoUri.substring(0, 20) + '...');
}

// Test connection
console.log('Testing MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    
    // Use our actual user model instead of creating a new one
    try {
      const User = mongoose.model('User');
      console.log('User model exists, using it for testing');
    } catch (e) {
      console.log('Creating user model for testing');
      
      // Create a test user model
      const userSchema = new mongoose.Schema({
        uid: {
          type: String,
          required: true,
          unique: true
        },
        email: String,
        name: String
      });
      
      mongoose.model('User', userSchema);
    }
    
    const User = mongoose.model('User');
    
    // Create test user with a unique UID
    try {
      const uniqueUid = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const testUser = new User({
        uid: uniqueUid,
        email: `test-${uniqueUid}@example.com`,
        name: 'Test User'
      });
      
      await testUser.save();
      console.log('Test user created successfully:', testUser);
      
      // Check if the user was actually saved
      const savedUser = await User.findOne({ uid: uniqueUid });
      
      if (savedUser) {
        console.log('User was successfully retrieved from database');
        
        // Clean up test user
        await User.findOneAndDelete({ uid: uniqueUid });
        console.log('Test user removed');
      } else {
        console.error('User could not be retrieved from database after save!');
      }
    } catch (error) {
      console.error('Error creating test user:', error);
    }
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check users collection
    const users = await User.find().limit(5);
    console.log(`Found ${users.length} users in database`);
    if (users.length > 0) {
      console.log('Sample user:', users[0]);
    }
    
    mongoose.connection.close();
    console.log('Connection closed');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
