import { MongoClient } from "mongodb";

// Your MongoDB connection URI (this is for local development, adjust if using a different setup)
const MONGODB_URI = process.env.MONGODB_URI;
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use the MongoClient singleton
  clientPromise = globalThis.mongoClient ??= client.connect();
} else {
  // In production mode, always create a new connection
  clientPromise = client.connect();
}

export default clientPromise;
