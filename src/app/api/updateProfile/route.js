import clientPromise from "../../lib/mongodb";

export const POST = async (req) => {
  try {
    // Parse the request body
    const body = await req.json();
    const { username, email, newPassword, profileImage } = body;

    console.log("username", username);

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("users");

    
    // Update the user's profile in the database
    const updateData = {
      username,
      profileImage,
    };

    // Only update the password if it is provided
    if (newPassword) {
      updateData.newPassword = newPassword;
    }

    await collection.updateOne(
    { email },
      { $set: updateData }
    );

    // if (result.modifiedCount === 0) {
    //   throw new Error("Failed to update profile");
    // }

    return new Response(
      JSON.stringify({ message: "Profile updated successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
