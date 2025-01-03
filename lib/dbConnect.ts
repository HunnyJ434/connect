// lib/dbConnect.js
import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://Hunnyj:LcUvjchCZByDCFUy@cluster0.8ehw0.mongodb.net/yourDatabaseName?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
let isConnected = false; // This will keep track of the connection status

export async function dbConnect() {
  if (!isConnected) {
    await client.connect();
    isConnected = true; // Set to true once connected
    console.log("Connected to MongoDB");
  }
  return client.db('yourDatabaseName'); // Adjust 'yourDatabaseName' accordingly
}

// New function to check database connection
export async function checkDbConnection() {
  try {
    const db = await dbConnect();
    return db !== null;
  } catch (error) {
    console.error("DB Connection Error:", error);
    return false;
  }
}
