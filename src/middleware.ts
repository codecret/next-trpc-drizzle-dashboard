import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const handleI18nRouting = createMiddleware(routing);

// Authentication Middleware for Admin Routes (e.g., '/admin/:path*' and '/dashboard/overview')
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/api")) {
    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname.includes("/auth") ||
    request.nextUrl.pathname === "/de" ||
    request.nextUrl.pathname === "/en" ||
    request.nextUrl.pathname === "/"
  ) {
    return handleI18nRouting(request);
  } else {
    const cookies = getSessionCookie(request);
    if (!cookies) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    return handleI18nRouting(request);
  }
}
export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(de|en)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
