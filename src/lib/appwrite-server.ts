import { Client, Databases, Storage } from 'node-appwrite';

export const DATABASE_ID = '6a8c4408001ae24149b6';

export async function createAdminClient() {
  // Gunakan API Key untuk memastikan server Next.js punya hak akses penuh (Admin) 
  // ke Database dan Storage Appwrite. Keamanan halaman sudah dijamin oleh middleware.ts.
  const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('6a8c438600024a08a21e')
    .setKey(process.env.APPWRITE_API_KEY || 'standard_6dead5d8484c6b20b16b516d4d05c0517a602f05065c263f5323cf4399f4809c470e93e4a6a8b69fefc33db2c54ec3155112f7bf3837f0c73eb383b23d4287633fb906516f263720c7f9df06fa54707a53bc4630d0dea429d8f37047d3f9690841906dcbb77b2dea0d17917238f92860f83c6d056bffdbd2369b23afcc371e8a');

  return {
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
