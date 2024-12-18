import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

// POST route to save workout data
export async function POST(req) {
  try {
    const body = await req.json();
    const { workoutPlanId, completedData, completedAt } = body;

    if (!workoutPlanId || !completedData) {
      return new Response("Invalid data provided", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("records");

    const workoutRecords = { workoutPlanId, completedData, completedAt };
    const result = await collection.insertOne(workoutRecords);

    return new Response(JSON.stringify(result), { status: 201 });
  } catch (error) {
    console.error("Error saving workout data:", error);
    return new Response("Server error", { status: 500 });
  }
}

// GET route to fetch all workout records
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("records");

    const records = await collection.find({}).toArray();

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (error) {
    console.error("Error fetching workout records:", error);
    return new Response("Server error", { status: 500 });
  }
}

// DELETE route to delete a specific workout record by ID
export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("Record ID is required", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("records");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new Response("Record not found", { status: 404 });
    }

    return new Response("Record deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting workout record:", error);
    return new Response("Server error", { status: 500 });
  }
}
