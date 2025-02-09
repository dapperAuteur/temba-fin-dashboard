import Account from "./../../../(models)/Account";
import { NextResponse } from "next/server";
import { isAuthenticated, isOwner } from "./../../helpers/auth";

export async function GET(req, { params }) {
  try {
    const user = await isAuthenticated(req); // Confirm user is logged in
    const { _id } = params;

    // Check if the user is the owner of the account
    await isOwner(_id, user._id);

    // Fetch the account
    const foundAccount = await Account.findOne({ _id, userId: user._id }).populate("tags");

    if (!foundAccount) {
      return NextResponse.json(
        { message: "Account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { account: foundAccount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

// Update an account (restricted to owner)
export async function PATCH(req, { params }) {
  try {
    const user = await isAuthenticated();
    const { _id } = await params;
    const body = await req.json();
    const acctData = body.formData;
    
    console.log('116 api/accounts/[_id].js acctData :>> ', acctData);

    // Check if the user is the owner of the account
    await isOwner(_id, user._id, Account);

    console.log('120 api/accounts/[_id].js after isOwner :>> ', user);

    // Update other account fields
    const updatedAccount = await Account.findOneAndUpdate(
      { _id, userId: user._id },
      {
        ...acctData,
        tags: acctData.tags || []
      },
      { new: true }
    ).populate("tags");

    console.log('141 api/accounts/[_id].js updatedAccount :>> ', updatedAccount);

    return NextResponse.json(
      { account: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Forbidden") ? 403 : 500 }
    );
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
      return NextResponse.json(
        { message: "Account NOT DELETED!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Account DELETED" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Forbidden") ? 403 : 500 }
    );
  }
}