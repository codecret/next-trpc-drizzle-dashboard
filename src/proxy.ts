import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Internationalization middleware
 */
const handleI18nRouting = createMiddleware(routing);

/**
 * Routes that don't require authentication
 */
const publicRoutes = ["/auth", "/api"];

/**
 * Routes that are locale root paths
 */
const localeRoots = routing.locales.map((locale) => `/${locale}`);

/**
 * Check if the path is a public route
 */
function isPublicRoute(pathname: string): boolean {
  return (
    pathname === "/" ||
    localeRoots.includes(pathname) ||
    publicRoutes.some((route) => pathname.includes(route))
  );
}

/**
 * Proxy function for handling requests
 * Combines authentication and internationalization
 *
 * @see https://nextjs.org/docs/app/guides/upgrading/version-16
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes - let them handle their own auth
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public routes - just handle i18n
  if (isPublicRoute(pathname)) {
    return handleI18nRouting(request);
  }

  // Protected routes - check authentication
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    // Redirect to sign-in page
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated, proceed with i18n routing
  return handleI18nRouting(request);
}

/**
 * Matcher configuration for the proxy
 * Excludes static files and internal Next.js routes
 */
export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
