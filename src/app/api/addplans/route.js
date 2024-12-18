import clientPromise from "../../lib/mongodb";

export async function POST(req) {
  try {
    // Parse the incoming JSON data
    const { planData, planCompleted } = await req.json();

    if (!planData) {
      return new Response(JSON.stringify({ error: 'planData is required' }), { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('workoutRecord');
    const collection = db.collection('plans');

    // Insert the data into the database
    const workoutPlan = {
      planData,
      planCompleted,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(workoutPlan);

    // Send a success response
    return new Response(JSON.stringify({ message: 'Plan added successfully', result }), { status: 201 });
  } catch (error) {
    console.error('Error in API handler:', error);
    return new Response(JSON.stringify({ error: 'Failed to add plan' }), { status: 500 });
  }
}
