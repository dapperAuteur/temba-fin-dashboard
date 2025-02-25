import mongoose from "mongoose";

/**
 * Connection cache to avoid multiple connections
 */
interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Connection cache - keeps track of our connection status
const cache: ConnectionCache = {
  conn: null,
  promise: null
};

/**
 * Connect to MongoDB with fallback from cloud to local
 * 
 * @returns Mongoose instance
 */
async function dbConnect(): Promise<typeof mongoose> {
  // If we already have a connection, return it
  if (cache.conn) {
    console.log('Using existing MongoDB connection');
    return cache.conn;
  }

  // If we're already connecting (promise exists), wait for that to complete
  if (cache.promise) {
    console.log('Waiting for existing MongoDB connection attempt...');
    return await cache.promise;
  }

  // Options for mongoose connection
  const options = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds when connecting
  };

  // Try to connect to cloud first, then local
  async function attemptConnection(): Promise<typeof mongoose> {
    // First try the cloud connection from environment variable
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (MONGODB_URI) {
      try {
        console.log('Attempting to connect to MongoDB cloud instance...');
        return await mongoose.connect(MONGODB_URI, options);
      } catch (error) {
        console.error('Error connecting to cloud MongoDB:', error);
        console.log('Falling back to local MongoDB instance...');
      }
    } else {
      console.log('No MONGODB_URI environment variable found');
    }

    // Fallback to local MongoDB
    try {
      const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/financial_dashboard';
      console.log('Connecting to local MongoDB instance...');
      return await mongoose.connect(LOCAL_MONGODB_URI, options);
    } catch (error) {
      console.error('Error connecting to local MongoDB:', error);
      throw new Error(
        'Failed to connect to MongoDB. Please ensure MongoDB is running locally or provide a valid MONGODB_URI.'
      );
    }
  }

  // Store the connection promise so we don't try to connect multiple times simultaneously
  cache.promise = attemptConnection();

  try {
    // Wait for the connection to complete
    cache.conn = await cache.promise;
    console.log('Successfully connected to MongoDB');
    return cache.conn;
  } catch (error) {
    // Clear the promise so we can try again next time
    cache.promise = null;
    throw error;
  }
}

export default dbConnect;