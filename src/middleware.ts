import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analytics";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 15)}`;
}

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAdmin = pathname.startsWith("/admin");
  const isLoginPage = pathname.startsWith("/admin/login");

  if (isAdmin && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  const res = NextResponse.next();
  const existing = req.cookies.get(ANALYTICS_SESSION_COOKIE)?.value;
  if (!existing) {
    res.cookies.set(ANALYTICS_SESSION_COOKIE, generateSessionId(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  }
  return res;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
