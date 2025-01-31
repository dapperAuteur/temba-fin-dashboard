import Account from "./../../../(models)/Account";
import { NextResponse } from "next/server";

export async function GET (req, { params }) {
  const { _id } = params;

  try {
    let foundAccount = await Account.find({_id: _id}).populate("tags")
      .then((obj) => {
        return obj;
      });

  return NextResponse.json(
    {
      account: foundAccount,
    },
    {
      status: 200
    }
  )
  } catch (error) {
    console.log('22 api/accounts/[_id].js error :>> ', error);
    return NextResponse.json(
      {
        message: "Error", error
      },
      {
        status: 500
      }
    )
  }
}

// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
export async function PATCH(req, {params}) {
  const { _id } = params;
  console.log('40 api/accounts/[_id].js _id :>> ', _id);
  const body = await req.json();
  console.log('42 api/accounts/[_id].js body :>> ', body);
  const acctData = body.formData;

  try {

    const updatedAccount = await Account.findOneAndUpdate({
      _id
    }, acctData, {
      new: true
    });
    console.log('71 api/accounts/[_id].js updatedAccount :>> ', updatedAccount);
    
    return NextResponse.json(
      {
        account: updatedAccount
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log('84 app/api/accounts/[_id]/route error :>> ', error);
    return NextResponse.json(
      {
        message: "Error", error
      },
      {
        status: 500
      }
    )
  }
}

export async function DELETE(req, { params }) {
  const { _id } = params;
  try {
    const res = await Account.deleteOne({_id});
    if (!res) {
      return NextResponse.json(
        {
          message: "Account NOT DELETED!"
        },
        {
          status: 409
        }
      )
    }
    return NextResponse.json(
      {
        message: "Account DELETED"
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log('111 app/api/accounts/[_id]/route error :>> ', error);
    return NextResponse.json(
      {
        message: "Error", error
      },
      {
        status: 500
      }
    )
  }
}