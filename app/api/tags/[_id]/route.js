import { NextResponse } from "next/server";
import Tag from "./../../../(models)/Tag";

export async function GET(req, {params}) {
  console.log('params :>> ', params);
  const {_id} = params;
  console.log('8 server _id :>> ', _id);

  let foundTag = await Tag.find({_id: _id})
    .then((obj) => {
      console.log('11 server obj :>> ', obj);
      return obj;
    });
  console.log('14 server foundTag :>> ', foundTag);
  return NextResponse.json(
    {
      tag: foundTag
    },
    {
      status: 200
    }
  )
}

export async function PATCH(req, {params}) {
  const {_id} = params;
  const body = await req.json();
  const tagData = body.formData;
  try {

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: _id }, tagData, { new: true }
    )
    console.log('server 39 updatedTag :>> ', updatedTag);
    return NextResponse.json(
      {
        tag: updatedTag
      },
      {
        status: 200
      }
    )
  } catch (error) {
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

export async function DELETE(req, {params}) {
  console.log('params :>> ', params);
  const body = await req.json();
  const { _id } = params;
  console.log('body :>> ', body);
  const role = body.user.role;
  if (role !== "admin") {
    return NextResponse.json(
      { message: "You're NOT Authorized to DELETE Tag!" },
      { status: 409 }
    );
  }

  try {
    const res = await Tag.deleteOne({_id});
    if (!res.deletedCount) {
      return NextResponse.json(
        { message: "Tag NOT DELETED!" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Tag DELETED" },
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