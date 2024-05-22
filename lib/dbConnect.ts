import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
let isConnected = false; // This will keep track of the connection status

export async function dbConnect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true; // Set to true once connected
    console.log("Connected to MongoDB");
  }
  return client.db('yourDatabaseName'); // Adjust 'yourDatabaseName' accordingly
}

export default dbConnect;
