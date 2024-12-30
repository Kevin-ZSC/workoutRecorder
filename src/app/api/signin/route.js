import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("users");

    // Find user in the database
    const user = await collection.findOne({ email });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401 }
      );
    }


    // Successfully found user
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    console.log(email);
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("workoutRecord");
    const collection = db.collection("users");

    // Find user in the database
    const user = await collection.findOne(
      { email },
      { projection: { password: 0 } } 
    );


    // console.log("Queried User:", user);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
