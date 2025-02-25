import Vendor from "./../../(models)/Vendor";
import Tag from "./../../(models)/Tag";
import { isAuthenticated } from "./../helpers/auth";
import { NextResponse } from "next/server";
import { AuthenticationError } from './../helpers/errors';

// Create a new vendor
export async function POST(req) {
  try {
    await isAuthenticated();
    const body = await req.json();
    const vendorData = body.formData;

    if (!vendorData?.name) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          message: error.message || "Name field is required."
        }, { status: 401 });
      }
    }

    // Check for duplicate vendor names
    const duplicate = await Vendor.findOne({
      name: vendorData.name,
    }).lean();

    if (duplicate) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          message: error.message || "Duplicate Vendor Name. Please Choose Another Name."
        }, { status: 409 });
      }
    }

    let newVendor = await Vendor.create(vendorData);
    // In the POST handler
    return NextResponse.json({
      success: true,
      message: "Vendor Created.",
      data: newVendor // Include the created vendor data
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating vendor:", error);
    if (error instanceof AuthenticationError) {
      return NextResponse.json({
        success: false,
        message: error.message || "Error"
      }, { status: error.message.includes("Unauthorized") ? 401 : 500 });
    }
  }
}

// Get all vendors for the logged-in user
export async function GET() {
  try {
    console.log('64 app/api/vendors/route.js Tag :>> ', Tag);
    const vendors = await Vendor.find().populate("tags");

    return NextResponse.json({ vendors }, { status: 200 }, { success: true });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 },
      { success: false }
    );
  }
}