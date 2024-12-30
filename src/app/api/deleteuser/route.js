import clientPromise from "../../lib/mongodb";

export const DELETE = async (req) => {
  try {
    const body = await req.json(); // Parse the request body
    const { email } = body;

    console.log(email);
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("users");

    const result = await collection.deleteOne({ email });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Account deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete account" }),
      { status: 500 }
    );
  }
};
