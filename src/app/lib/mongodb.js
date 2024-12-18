import { MongoClient } from "mongodb";

// Use MongoDB URI based on the environment
const mongoURI =
  process.env.NODE_ENV === "production" ? process.env.MONGODB_URI : "mongodb://localhost:27017";

const client = new MongoClient(mongoURI);

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable so the MongoClient is not constantly re-instantiated
  if (global._mongoClientPromise) {
    clientPromise = global._mongoClientPromise;
  } else {
    global._mongoClientPromise = client.connect();
    clientPromise = global._mongoClientPromise;
  }
} else {
  // In production, it's safe to create a new MongoClient for each request
  clientPromise = client.connect();
}

export default clientPromise;

