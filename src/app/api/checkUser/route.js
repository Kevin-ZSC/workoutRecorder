import clientPromise from "../../lib/mongodb";

export const GET = async (req) => {
  try {
    // Extract username from query params correctly
    const url = req.nextUrl;
    const username = url.searchParams.get('username'); 

    console.log("Received username:", username);

    // If username is not provided, return an error
    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username is required" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("users");

    // Check if the username exists in the database
    const user = await collection.findOne({ username });

    if (user) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Username is available" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username:", error); // Log the error for debugging
    return new Response(
      JSON.stringify({ error: "Failed to check username" }),
      { status: 500 }
    );
  }
};
