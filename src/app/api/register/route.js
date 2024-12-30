import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { email, password, username, profileImage } = await req.json();

  const salt = await bcrypt.genSalt(10); // Generate a salt
  const hashedPassword = await bcrypt.hash(password, salt)

  const client = await clientPromise;
  const db = client.db("workoutRecord");
  const collection = db.collection("users");

  // Check if email already exists
  const existingEmailUser = await collection.findOne({ email });
  if (existingEmailUser) {
    return new Response(
      JSON.stringify({ error: "Email is already registered" }),
      { status: 400 }
    );
  }

  // Check if username already exists
  const existingUsernameUser = await collection.findOne({ username });
  if (existingUsernameUser) {
    return new Response(
      JSON.stringify({ error: "Username is already taken" }),
      { status: 400 }
    );
  }

  // Create new user object
  const user = {
    email,
    password: hashedPassword,
    username,
    profileImage: profileImage
  };

  // Insert new user into the database
  const result = await collection.insertOne(user);
  
  return new Response(JSON.stringify(result), { status: 201 });
}
