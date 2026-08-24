const { Client, Databases, Permission, Role } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6a8c438600024a08a21e')
  .setKey('standard_6dead5d8484c6b20b16b516d4d05c0517a602f05065c263f5323cf4399f4809c470e93e4a6a8b69fefc33db2c54ec3155112f7bf3837f0c73eb383b23d4287633fb906516f263720c7f9df06fa54707a53bc4630d0dea429d8f37047d3f9690841906dcbb77b2dea0d17917238f92860f83c6d056bffdbd2369b23afcc371e8a');

const databases = new Databases(client);
const dbId = '6a8c4408001ae24149b6';
const collId = 'portfolios';

async function setup() {
  try {
    console.log("Creating portfolios collection...");
    await databases.createCollection(
      dbId, 
      collId, 
      'Portfolios', 
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log("Collection created.");
  } catch (err) {
    console.log("Collection exists or error:", err.message);
  }

  try {
    await databases.createStringAttribute(dbId, collId, 'title', 255, true);
    await databases.createStringAttribute(dbId, collId, 'category', 100, true);
    await databases.createStringAttribute(dbId, collId, 'imageUrl', 2048, true);
    await databases.createIntegerAttribute(dbId, collId, 'sequence', false, 0, 10000, 0, false);
    console.log("Attributes creation initiated.");
  } catch (err) {
    console.log("Error creating attributes:", err.message);
  }
}

setup();
