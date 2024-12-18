import clientPromise from "../../lib/mongodb"; // Ensure the correct import path

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("plans");

    // Fetch all workout records
    const workouts = await collection.find({}).toArray();

    // Return the records as JSON
    return new Response(JSON.stringify(workouts), { status: 200 });
  } catch (error) {
    console.error("Error fetching workout data:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}
