import Account from "../../(models)/Account";
import Tag from "../../(models)/Tag";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./../helpers/auth";

// Create a new account
export async function POST(req) {
  try {
    const user = await isAuthenticated();
    const body = await req.json();
    const acctData = body.formData;

    if (!acctData?.name || !acctData?.type || !acctData?.balance) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
        { success: false }
      );
    }

    // Add the user ID to the account data
    acctData.userId = user._id;

    // Check for duplicate account names
    const duplicate = await Account.findOne({
      name: acctData.name,
      userId: user._id,
    }).lean();

    if (duplicate) {
      return NextResponse.json(
        { message: "Duplicate Account Name. Please Choose Another Name." },
        { status: 409 },
        { success: false }
      );
    }

    let newAccount = await Account.create(acctData);
    // In the POST handler
    return NextResponse.json({
      success: true,
      message: "Account Created.",
      data: newAccount // Include the created account data
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating account:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 },
      { success: false }
    );
  }
}

// Get all accounts for the logged-in user
export async function GET() {
  try {
    console.log('56 app/api/accounts/route.js Tag :>> ', Tag);
    const user = await isAuthenticated();
    const accounts = await Account.find({ userId: user._id }).populate("tags");

    return NextResponse.json({ accounts }, { status: 200 }, { success: true });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { message: error.message || "Error" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 },
      { success: false }
    );
  }
}