import { NextResponse } from "next/server";
import { ANALYTICS_SESSION_COOKIE } from "@/app/(shared)/lib/analytics";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;
function middleware(request) {
  const response = NextResponse.next();
  const existing = request.cookies.get(ANALYTICS_SESSION_COOKIE);
  if (!existing?.value) {
    const sessionId = crypto.randomUUID();
    response.cookies.set(ANALYTICS_SESSION_COOKIE, sessionId, {
      path: "/",
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
      httpOnly: false
      // so client can read for useAnalytics
    });
  }
  return response;
}
const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
export { config };
export { middleware };
