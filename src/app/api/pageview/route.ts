import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/client";

export async function POST(request: NextRequest) {
  try {
    if (!sanityClient) return NextResponse.json({}, { status: 200 });

    const body = await request.json();
    const { path, referrer, userAgent } = body as {
      path?: string;
      referrer?: string;
      userAgent?: string;
    };
    const country = request.headers.get("cf-ipcountry") ?? "";

    await sanityClient.create({
      _type: "pageView",
      path: path ?? "",
      referrer: referrer ?? "",
      userAgent: userAgent ?? "",
      country,
      visitedAt: new Date().toISOString(),
    });
  } catch {
    // silent fail — never block the main site
  }

  return NextResponse.json({}, { status: 200 });
}
