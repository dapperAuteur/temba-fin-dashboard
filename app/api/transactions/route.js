import Transaction from "../../(models)/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const tranxData = body.formData;

    if (!tranxData?.amount || !tranxData?.accounts || !tranxData?.category || !tranxData?.userId) {
      return NextResponse.json({
        message: "Accounts, Amount, Category, and User are required."
      },
      {
        status: 400
      })
    }

    await Transaction.create(tranxData);
    return NextResponse.json(
      { message: "Transaction Created." },
      { status: 201 }
    );
  } catch (error) {
    console.log('POST Tranx error :>> ', error);
    return NextResponse.json(
      { message: "Error", error },
      { status: 500 }
    )
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