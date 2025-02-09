import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/accounts/:path*",
    "/transactions/:path*",
    "/api/accounts/:path*",
    "/api/transactions/:path*",
    // "/((?!api/auth|auth/signin/auth/signup|_next/static|_next/image|favicon.ico).*)"
  ]
}
