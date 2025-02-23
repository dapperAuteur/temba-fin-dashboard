import { NextResponse } from "next/server";
import Tag from "./../../../(models)/Tag";
import { isAuthenticated } from "./../../helpers/auth";

export async function GET(req, {params}) {
  const {_id} = params;

  let foundTag = await Tag.find({_id: _id})
    .then((obj) => {
      return obj;
    });
  return NextResponse.json(
    {
      tag: foundTag
    },
    {
      status: 200
    }
  )
}

export async function PATCH(req, {params}) {
  
  try {
    const {_id} = params;
    const body = await req.json();
    const tagData = body.formData;

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: _id }, {...tagData}, { new: true }
    )
    return NextResponse.json({
      success: true,
      message: "Tag Updated.",
      data: updatedTag},
      {
        status: 201
      });
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}

export async function DELETE(req, {params}) {
  
  try {
    const user = await isAuthenticated();
    const { _id } = params;
    if (user?.userRole !== "admin") {
      return NextResponse.json(
        { message: "You're NOT Authorized to DELETE Tag!" },
        { status: 409 }
      );
    }

    const res = await Tag.deleteOne({_id});
    if (!res.deletedCount) {
      return NextResponse.json(
        { message: "Tag NOT DELETED!" },
        { status: 409 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Tag DELETED",
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}