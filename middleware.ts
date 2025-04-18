import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/onboarding"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without being authenticated
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing auth routes while already authenticated
  if (isAuthRoute && session) {
    // Check if user has completed onboarding
    const supabaseClient = createMiddlewareClient({ req, res })
    const { data: profile } = await supabaseClient.from("profiles").select("*").eq("id", session.user.id).single()

    // If profile exists, redirect to dashboard, otherwise to onboarding
    const redirectPath = profile ? "/dashboard" : "/onboarding"
    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/login", "/register"],
}
