import Tag from "./../../(models)/Tag";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const tagData = body.formData;
    console.log('body :>> ', body);
    console.log('tagData :>> ', tagData);

  if (!tagData?.tag_name) {
    return NextResponse.json(
      {
        message: "Tag Name is Required."
      },
      {
        status: 400
      }
    )
  }

  const duplicate = await Tag.findOne({
    tag_name: tagData.tag_name
  })
    .lean()
    .exec();

    if (duplicate) {
      return NextResponse.json(
        {
          message: "NO Duplicate Tag Names. Choose Another Name."
        },
        {
          status: 409
        }
      )
    }
    await Tag.create(tagData);
    return NextResponse.json(
      {
        message: "Tag Created Successfully"
      },
      {
        status: 201
      }
    )
  } catch (error) {
    console.log('tag api 50 error :>> ', error);
    return NextResponse.json(
      {
        message: "Error", error,
      },
      {
        status: 500
      }
    )
  }
}

export async function GET(req) {
  try {
    let tags = await Tag.find();
    // console.log('tags :>> ', tags);
    return NextResponse.json(
      {
        data: tags
      },
      {
        status: 200
      }
    )
  } catch (error) {
    console.log('error :>> ', error);
    return NextResponse.json(
      {
        message: "Error", error
      }, 
      {
        status: 409
      }
    )
  }
}