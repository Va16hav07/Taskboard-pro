import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Configure Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Check existing indexes
      const db = mongoose.connection.db;
      const userCollection = db.collection('users');
      
      // Get index information
      const indexes = await userCollection.indexes();
      console.log('Current indexes:', indexes);
      
      // Find problematic indexes
      const problematicIndex = indexes.find(idx => 
        idx.name === 'firebaseUid_1' || idx.key.firebaseUid
      );
      
      if (problematicIndex) {
        console.log('Found problematic index:', problematicIndex);
        
        // Drop the index
        await userCollection.dropIndex(problematicIndex.name);
        console.log(`Dropped index: ${problematicIndex.name}`);
      } else {
        console.log('No problematic indexes found');
      }
      
      // Check for documents with null UID
      const nullUidDocs = await userCollection.find({ firebaseUid: null }).toArray();
      if (nullUidDocs.length > 0) {
        console.log(`Found ${nullUidDocs.length} documents with null firebaseUid`);
        
        // Delete documents with null UID
        await userCollection.deleteMany({ firebaseUid: null });
        console.log('Deleted documents with null firebaseUid');
      }
      
      // Verify schema fields consistency
      if (await userCollection.countDocuments() > 0) {
        const sampleDoc = await userCollection.findOne();
        console.log('Sample document fields:', Object.keys(sampleDoc));
        
        // Check if we need to rename firebaseUid to uid
        if (sampleDoc.firebaseUid && !sampleDoc.uid) {
          console.log('Renaming firebaseUid to uid for all documents');
          await userCollection.updateMany(
            { firebaseUid: { $exists: true } },
            [{ $set: { uid: '$firebaseUid' } }]
          );
          console.log('Field renamed for all documents');
        }
      }
      
      console.log('Database fix completed!');
    } catch (error) {
      console.error('Error fixing database:', error);
    } finally {
      mongoose.connection.close();
      console.log('Connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
