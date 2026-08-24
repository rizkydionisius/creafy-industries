const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://sgp.cloud.appwrite.io/v1')
  .setProject('6a8c438600024a08a21e')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

async function checkAttributes() {
  try {
    const res = await databases.createIntegerAttribute(
      '6a8c4408001ae24149b6', 
      'products', 
      'sequence', 
      false, // required
      0, // min
      10000, // max
      0, // default
      false // array
    );
    console.log("Attribute created/checked:", res);
  } catch (err) {
    console.log("Attribute might already exist:", err.message);
  }
}

checkAttributes();

checkAttributes();
