import Tag from "../../(models)/Tag";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./helpers/auth";

// Create a new tag
export async function POST(req) {
  try {
    const user = await isAuthenticated(req);
    const body = await req.json();
    const tagData = body.formData;

    if (!tagData?.name) {
      return NextResponse.json(
        { message: "Tag name is required." },
        { status: 400 }
      );
    }

    // Add the user ID to the tag data
    tagData.userId = user._id;

    // Check for duplicate tag names
    const duplicate = await Tag.findOne({
      name: tagData.name,
      userId: user._id,
    }).lean();

    if (duplicate) {
      return NextResponse.json(
        { message: "Duplicate tag name. Please choose another name." },
        { status: 409 }
      );
    }

    await Tag.create(tagData);
    return NextResponse.json(
      { message: "Tag created successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
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