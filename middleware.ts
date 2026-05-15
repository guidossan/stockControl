import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const authPages = ["/login", "/register"];
const protectedPrefixes = [
  "/dashboard",
  "/products",
  "/categories",
  "/movements",
];

export function middleware(request: NextRequest) {
  const session = request.cookies.get("stockflow_session")?.value;
  const { pathname } = request.nextUrl;

  if (
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    !session
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authPages.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/products/:path*",
    "/categories/:path*",
    "/movements/:path*",
  ],
};
