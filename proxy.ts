import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/error", "/api/auth"];

const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export default async function proxy(request: NextRequest) {
  if (!secret) return NextResponse.next();

  try {
    const token = await getToken({ req: request, secret });
    const { pathname } = request.nextUrl;

    const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
    const isStatic = pathname.startsWith("/_next") || pathname.startsWith("/icons") || pathname === "/favicon.ico";

    if (isStatic || isPublic) return NextResponse.next();

    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  } catch (e) {
    console.error("Proxy error:", e);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons).*)"],
};
