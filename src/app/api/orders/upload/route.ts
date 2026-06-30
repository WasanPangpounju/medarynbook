import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/client";

export async function POST(request: Request) {
  if (!sanityClient) {
    return NextResponse.json({ error: "Sanity is not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const assetType = file.type.startsWith("image/") ? "image" : "file";
  const asset = await sanityClient.assets.upload(assetType, buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return NextResponse.json({ url: asset.url });
}
