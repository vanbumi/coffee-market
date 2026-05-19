import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Middleware NextAuth v5 — proteksi route /admin/*
 * Semua route /admin/* kecuali /admin/login wajib terautentikasi
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Bypass halaman login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Proteksi semua route /admin/*
  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Terautentikasi — lanjutkan
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
