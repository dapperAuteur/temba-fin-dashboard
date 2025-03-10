import Account from "./../../../(models)/Account";
import { NextResponse } from "next/server";
import { isAuthenticated, isOwner } from "./../../helpers/auth";

export async function GET(req, { params }) {
  try {
    const user = await isAuthenticated(req); // Confirm user is logged in
    const { _id } = await params;

    // Check if the user is the owner of the account
    await isOwner(_id, user._id, Account);

    // Fetch the account
    const foundAccount = await Account.findOne({ _id, userId: user._id }).populate("tags");

    if (!foundAccount) {
      return NextResponse.json({
        success: false,
        message: "Account not found.",
      }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      data: foundAccount,
      message: "Account found successfully.",
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Unauthorized") ? 401 : 500 });
  }
}

// Update an account (restricted to owner)
export async function PATCH(req, { params }) {
  try {
    const user = await isAuthenticated();
    const { _id } = await params;
    const body = await req.json();
    const acctData = body.formData;
    
    // Check if the user is the owner of the account
    await isOwner(_id, user._id, Account);

    // Update other account fields
    const updatedAccount = await Account.findOneAndUpdate(
      { _id, userId: user._id },
      {
        ...acctData,
        tags: acctData.tags || []
      },
      { new: true }
    ).populate("tags");

    // In the POST handler
    return NextResponse.json({
      success: true,
      message: "Account Updated.",
      data: updatedAccount // Include the created account data
    }, { status: 201 });

  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}

// Delete an account (restricted to owner)
export async function DELETE(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    
    const { _id } = await params;

    // Check if the user is the owner of the account
    await isOwner(_id, user._id, Account);

    const res = await Account.deleteOne({ _id, userId: user._id });

    if (!res.deletedCount) {
      return NextResponse.json({
        success: false,
        message: "Account NOT DELETED!",
      }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      message: "Account DELETED",
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Error",
    }, { status: error.message.includes("Forbidden") ? 403 : 500 });
  }
}