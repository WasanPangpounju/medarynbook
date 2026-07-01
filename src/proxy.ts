import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const url = new URL(request.url);

  event.waitUntil(
    fetch(new URL("/api/pageview", request.url).toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: url.pathname,
        referrer: request.headers.get("referer") ?? "",
        userAgent: request.headers.get("user-agent") ?? "",
      }),
    }).catch(() => undefined)
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|api/|studio/|.*\\.ico$|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
