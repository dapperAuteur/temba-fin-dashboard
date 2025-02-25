import Transaction from "../../(models)/Transaction";
import { NextResponse } from "next/server";
import { isAuthenticated } from "./../helpers/auth";
import { AuthenticationError } from './../helpers/errors';

export async function POST(req) {
  try {
    const user = await isAuthenticated();
    const body = await req.json();
    const tranxData = body.formData;

    if (!tranxData?.amount || !tranxData?.accounts || !tranxData?.category || !tranxData?.userId) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json({
          success: false,
          message: error.message || "All fields are required."
        }, { status: 401 });
      }
    }

    // Add the user ID to the tranx data
    tranxData.userId = user._id;

    let newTranx = await Transaction.create(tranxData);
    return NextResponse.json({
      success: true,
      message: "Transaction Created.",
      data: newTranx // Include the created transaction data
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating account:", error);
    if (error instanceof AuthenticationError) {
      return NextResponse.json({
        success: false,
        message: error.message || "Error"
      }, { status: error.message.includes("Unauthorized") ? 401 : 500 });
    }
  }
}

export async function GET() {
  // console.log('GET req.cache :>> ', req.cache);
  try {
    let tranx = await Transaction.find().populate("accounts", "tags", "userId");
    return NextResponse.json(
      {
        transactions: tranx
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'max-age=60'
        }
      }
    )
  } catch (error) {
    console.log('GET Tranx error :>> ', error);
    return NextResponse.json(
      { message: "Error", error },
      { status: 500 }
    )
  }
}