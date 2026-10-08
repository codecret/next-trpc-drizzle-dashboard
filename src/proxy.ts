import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createMiddleware(routing);

// Public-website phase: keep the existing dashboard/auth code dormant.
// Remove this gate only when the dashboard is deliberately reactivated.
const hiddenPagePrefixes = ["/admin", "/dashboard", "/auth"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const path = pathname.replace(/^\/(en|de)(?=\/|$)/, "") || "/";
  if (
    hiddenPagePrefixes.some(
      (prefix) => path === prefix || path.startsWith(`${prefix}/`)
    )
  ) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }
  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next|.*\\..*).*)"],
};
