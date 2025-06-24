/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/test-log/route.ts
import { NextResponse } from "next/server";
import { logAuthEvent } from "./../../../../lib/logging/authLogger";
import { AuthEventType } from "@/app/(models)/AuthLog";

export async function GET(request: Request) {
  console.log("Test log endpoint hit!");

  try {
    const logId = await logAuthEvent({
      request: request as any, // Casting for test purposes
      event: AuthEventType.LOGIN,
      email: "test@example.com",
      userId: "60d0fe4f5311236168a109ca", // Example ObjectId string
      status: "success",
      metadata: { test: "true" }
    });

    console.log("Log created with ID:", logId);
    return NextResponse.json({
      message: "Test log created successfully!",
      logId: logId,
    });
  } catch (error) {
    console.error("Error in test log endpoint:", error);
    return NextResponse.json(
      { message: "Failed to create test log", error: (error as Error).message },
      { status: 500 }
    );
  }
}