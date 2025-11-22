import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  const rolePaths = {
    admin: "/admin/dashboard",
    manager: "/manager/programs",
    member: "/member/certificats/formation",
    employee: "/employee/add-trainee",
  };

  // Redirect logged-in users away from /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL(rolePaths[token.role] || "/", req.url));
  }

  // If not logged in → block all protected routes
  const protectedRoutes = [
    "/admin",
    "/manager",
    "/member",
    "/employee",
  ];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL(rolePaths[token.role] || "/", req.url));
  }

  if (pathname.startsWith("/manager") && token.role !== "manager") {
    return NextResponse.redirect(new URL(rolePaths[token.role] || "/", req.url));
  }

  if (pathname.startsWith("/member") && token.role !== "member") {
    return NextResponse.redirect(new URL(rolePaths[token.role] || "/", req.url));
  }

  if (pathname.startsWith("/employee") && token.role !== "employee") {
    return NextResponse.redirect(new URL(rolePaths[token.role] || "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin/:path*",
    "/manager/:path*",
    "/member/:path*",
    "/employee/:path*",
  ],
};
