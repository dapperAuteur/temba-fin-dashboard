import Account from "./../../../(models)/Account";
import { NextResponse } from "next/server";
import { isAuthenticated, isOwner } from "./../../helpers/auth";

export async function GET(req, { params }) {
  try {
    const user = await isAuthenticated(req); // Confirm user is logged in
    const { _id } = params;

    // Check if the user is the owner of the account
    await isOwner(_id, user.id);

    // Fetch the account
    const foundAccount = await Account.findOne({ _id, userId: user.id }).populate("tags");

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
// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
// export async function PATCH(req, {params}) {
//   const { _id } = params;
//   console.log('40 api/accounts/[_id].js _id :>> ', _id);
//   const body = await req.json();
//   console.log('42 api/accounts/[_id].js body :>> ', body);
//   const acctData = body.formData;

//   try {

//     const updatedAccount = await Account.findOneAndUpdate({
//       _id
//     }, acctData, {
//       new: true
//     });
//     console.log('71 api/accounts/[_id].js updatedAccount :>> ', updatedAccount);
    
//     return NextResponse.json(
//       {
//         account: updatedAccount
//       },
//       {
//         status: 200
//       }
//     )
//   } catch (error) {
//     console.log('84 app/api/accounts/[_id]/route error :>> ', error);
//     return NextResponse.json(
//       {
//         message: "Error", error
//       },
//       {
//         status: 500
//       }
//     )
//   }
// }

// export async function DELETE(req, { params }) {
//   const { _id } = params;
//   try {
//     const res = await Account.deleteOne({_id});
//     if (!res) {
//       return NextResponse.json(
//         {
//           message: "Account NOT DELETED!"
//         },
//         {
//           status: 409
//         }
//       )
//     }
//     return NextResponse.json(
//       {
//         message: "Account DELETED"
//       },
//       {
//         status: 200
//       }
//     )
//   } catch (error) {
//     console.log('111 app/api/accounts/[_id]/route error :>> ', error);
//     return NextResponse.json(
//       {
//         message: "Error", error
//       },
//       {
//         status: 500
//       }
//     )
//   }
// }

// Update an account (restricted to owner)
export async function PATCH(req, { params }) {
  try {
    const user = await isAuthenticated(req);
    const { _id } = params;
    const body = await req.json();
    const acctData = body.formData;

    // Check if the user is the owner of the account
    await isOwner(_id, user.id);

    // Add or remove tags if provided
    if (acctData.tags) {
      const updatedAccount = await Account.findOneAndUpdate(
        { _id, userId: user.id },
        { $set: { tags: acctData.tags } }, // Replace the tags array
        { new: true }
      );
      return NextResponse.json(
        { account: updatedAccount },
        { status: 200 }
      );
    }

    // Update other account fields
    const updatedAccount = await Account.findOneAndUpdate(
      { _id, userId: user.id },
      acctData,
      { new: true }
    );

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
    const { _id } = params;

    // Check if the user is the owner of the account
    await isOwner(_id, user.id);

    const res = await Account.deleteOne({ _id, userId: user.id });

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