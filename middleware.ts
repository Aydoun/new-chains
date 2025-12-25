import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request) {
    const isAuthPage = request.nextUrl.pathname.startsWith("/login");

    if (isAuthPage && request.nextauth.token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|public|login|images|.*\\.(.*)).*)",
  ],
};
