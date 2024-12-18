import clientPromise from "../../lib/mongodb";

export async function POST(req) {
  // Parse incoming JSON data from the frontend
  const { planData, planCompleted } = await req.json();

  // Connect to MongoDB
  const client = await clientPromise;
  const db = client.db("workoutRecord");
  const collection = db.collection("plans");

  // Prepare the data for insertion
  const workoutPlan = {
    planData,
    planCompleted,
  };

  // Insert the data into the "workouts" collection
  const result = await collection.insertOne(workoutPlan);

  // Return the result to the frontend
  return new Response(JSON.stringify(result), { status: 201 });
}
