import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/app/(models)/User"

export async function POST(req: NextRequest) {
  if (req.method === "POST") {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required",
        status: 400
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: "User already exists",
        status: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await User.create({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "User created successfully",
      userId: result.insertedId,
      status: 201
    });
  } else {
    NextResponse.json({
      message: "Method Not Allowed",
      status: 405
    }); // Method Not Allowed
  }
}
