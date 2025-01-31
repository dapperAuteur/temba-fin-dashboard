import Account from "../../(models)/Account";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const acctData = body.formData;

    console.log('line 9 acctData :>> ', acctData);

    if (!acctData?.account_name || !acctData?.account_type) {
      return NextResponse.json({
        message: "All fields are required."
      },
      {
        status: 400
      });
    }
    // check for duplicate account names
    const duplicate = await Account.findOne({
      account_name: acctData.account_name
    })
      .lean()
      .exec();
    if (duplicate) {
      return NextResponse.json(
        { message: "Duplicate Account Name. Please Choose Another Name." },
        { status: 409 }
      );
    }

    await Account.create(acctData);
    return NextResponse.json(
      { message: "Account Created." },
      { status: 201 }
    );
  } catch (error) {
    console.log('36 ./app/api/accounts/route error :>> ', error);
    return NextResponse.json(
      { message: "Error", error },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {

    let accounts = await Account.find().populate("tags");
    console.log('accounts :>> ', accounts);
    return NextResponse.json(
      {
        accounts: accounts
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log('44 ./app/api/accounts/route error :>> ', error);
    return NextResponse.json(
      { message: "Error", error },
      { status: 500 });
  }
}