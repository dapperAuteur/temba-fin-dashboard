import { NextResponse } from "next/server";
import Vendor from "./../../../(models)/Vendor";
import { isAuthenticated } from "./../../helpers/auth";

export async function GET(req, {params}) {
  const {_id} = params;

  let foundVendor = await Vendor.find({_id: _id})
    .then((obj) => {
      return obj;
    });
  return NextResponse.json(
    {
      vendor: foundVendor
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
    const vendorData = body.formData;

    const updatedVendor = await Vendor.findOneAndUpdate(
      { _id: _id }, {...vendorData}, { new: true }
    )
    return NextResponse.json({
      success: true,
      message: "Vendor Updated.",
      data: updatedVendor},
      {
        status: 201
      });
  } catch (error) {
    console.error("Error updating vendor:", error);
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
        { message: "You're NOT Authorized to DELETE Vendor!" },
        { status: 409 }
      );
    }

    const res = await Vendor.deleteOne({_id});
    if (!res.deletedCount) {
      return NextResponse.json(
        { message: "Vendor NOT DELETED!" },
        { status: 409 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Vendor DELETED",
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}