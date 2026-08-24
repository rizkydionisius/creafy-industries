import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://sgp.cloud.appwrite.io/v1') // SGP Regional Endpoint!
    .setProject('6a8c438600024a08a21e'); 

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const appwriteConfig = {
    databaseId: '6a8c4408001ae24149b6',
};
