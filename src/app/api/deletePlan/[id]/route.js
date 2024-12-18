
import clientPromise from "../../../lib/mongodb";  
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  const { id } = params;  
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
  }

  try {
    // Ensure that the id is converted to ObjectId
    const objectId = new ObjectId(id);
    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("plans");

    console.log("Deleting plan with ID:", id);  // Log for debugging

    // Delete the workout record by ID
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Plan not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Plan deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return new Response(JSON.stringify({ error: "Failed to delete plan" }), { status: 500 });
  }
}
