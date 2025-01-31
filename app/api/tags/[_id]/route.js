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
    return new Error
    // return NextResponse.json(
    //   {
    //     message: "Tag NOT DELETED! Must be Admin to delete Tag."
    //   },
    //   {
    //     status: 400
    //   }
    // )
  }

  try {
    const res = await Tag.deleteOne({_id});
    if (!res) {
      return NextResponse.json(
        {
          message: "Tag NOT DELETED!"
        },
        {
          status: 409
        }
      )
    }
    return NextResponse.json(
      {
        message: "Tag DELETED"
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log('79 app/api/tags/[_id]/route error :>> ', error);
    return NextResponse.json(
      {
        message: `Error: ${error}`
      },
      {
        status: 500
      }
    )
  }
}