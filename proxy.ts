import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-session";

const LOGIN_PATH = "/admin/login";

/** First line of defence for /admin. Pages and server actions re-check with requireAdmin(). */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_PATH) return NextResponse.next();

  if (!verifySessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
