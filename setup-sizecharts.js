import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6a8c438600024a08a21e')
  .setKey('standard_6dead5d8484c6b20b16b516d4d05c0517a602f05065c263f5323cf4399f4809c470e93e4a6a8b69fefc33db2c54ec3155112f7bf3837f0c73eb383b23d4287633fb906516f263720c7f9df06fa54707a53bc4630d0dea429d8f37047d3f9690841906dcbb77b2dea0d17917238f92860f83c6d056bffdbd2369b23afcc371e8a');

const databases = new Databases(client);

const DATABASE_ID = '6a8c4408001ae24149b6';
const COLLECTION_ID = 'size_charts';

async function setupDatabase() {
  try {
    try {
      await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      console.log(`Collection ${COLLECTION_ID} already exists.`);
    } catch (e) {
      console.log(`Collection ${COLLECTION_ID} not found. Creating...`);
      await databases.createCollection(
        DATABASE_ID,
        COLLECTION_ID,
        'Size Charts'
      );
      
      console.log('Creating attributes...');
      // Title
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'title', 255, true);
      // Image URL
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'imageUrl', 500, true);
      // Sequence
      await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'sequence', false, 0, 10000, 0);
      
      console.log('Size charts collection setup completed successfully.');
    }
  } catch (error) {
    console.error('Error setting up size charts collection:', error);
  }
}

setupDatabase();
