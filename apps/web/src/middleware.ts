import { type NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE_NAME, type Role } from "./constants";

export const middleware = (request: NextRequest) => {
  const role = request.cookies.get(ROLE_COOKIE_NAME) as Role | undefined;

  // console.log("role", role);
  // const url = request.nextUrl.clone();

  // if (!role) {
  //   url.pathname = "/sign-in";
  //   return NextResponse.redirect(url);
  // }

  // switch (role) {
  //   case "user":
  //     url.pathname = "/vendor";
  //     return NextResponse.redirect(url);
  // }
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images in development mode
     */
    "/((?!api|static|.*\\..*|_next).*)",
  ],
};
