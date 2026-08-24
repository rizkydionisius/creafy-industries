import { Client, Storage } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('6a8c438600024a08a21e')
    .setKey('standard_6dead5d8484c6b20b16b516d4d05c0517a602f05065c263f5323cf4399f4809c470e93e4a6a8b69fefc33db2c54ec3155112f7bf3837f0c73eb383b23d4287633fb906516f263720c7f9df06fa54707a53bc4630d0dea429d8f37047d3f9690841906dcbb77b2dea0d17917238f92860f83c6d056bffdbd2369b23afcc371e8a');

const storage = new Storage(client);

async function fix() {
    try {
        const bucket = await storage.getBucket('images');
        console.log('Bucket exists. Enabled:', bucket.enabled);
        if (!bucket.enabled) {
            console.log('Enabling bucket...');
            await storage.updateBucket('images', bucket.name, bucket.$permissions, bucket.fileSecurity, true);
            console.log('Bucket enabled!');
        }
    } catch(e) {
        console.error('Error:', e.message);
    }
}
fix();
