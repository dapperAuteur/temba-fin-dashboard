import Tag from "../../(models)/Tag";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./../helpers/auth";
import { AuthenticationError } from './../helpers/errors';

// Create a new tag
export async function POST(req) {
  try {
    await isAuthenticated();
    const body = await req.json();
    const tagData = body.formData;

    if (!tagData?.name) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          message: error.message || "Tag name is required."
        }, { status: 401 });
      }
    }

    // Check for duplicate tag names
    const duplicate = await Tag.findOne({
      name: tagData.name,
    }).lean();

    if (duplicate) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          message: error.message || "Duplicate Tag Name. Please Choose Another Name."
        }, { status: 409 });
      }
    }

    let newTag = await Tag.create(tagData);
    return NextResponse.json({
      success: true,
      message: "Tag created successfully.",
      data: newTag
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error instanceof AuthenticationError) {
      return NextResponse.json({
        success: false,
        message: error.message || "Error"
      }, { status: error.message.includes("Unauthorized") ? 401 : 500 });
    }
  }
}

// Get all tags for the logged-in user
export async function GET(req) {
  try {
    const user = await isAuthenticated(req);
    const tags = await Tag.find({ userId: user._id });
    return NextResponse.json({ tags }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}