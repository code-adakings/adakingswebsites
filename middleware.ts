import { NextRequest, NextResponse } from "next/server";

/**
 * Studio is embedded in this app at /studio (see app/studio/[[...tool]]/page.tsx).
 * To serve it at studio.adakings.com (root path) instead of adakings.com/studio,
 * transparently rewrite subdomain requests onto the /studio route. The browser's
 * address bar keeps the subdomain URL; only the internal routing changes.
 */
const STUDIO_HOSTNAME = "studio.adakings.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // API routes stay unrewritten so Studio code can call them (e.g. the
  // lending workflow's /api/lending/notify) from the subdomain too.
  if (host === STUDIO_HOSTNAME && !request.nextUrl.pathname.startsWith("/api/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/studio${request.nextUrl.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
