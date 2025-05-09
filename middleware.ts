import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createServerSupabaseClient()

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isAuthRoute =
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/admin/forgot-password" ||
    request.nextUrl.pathname === "/admin/reset-password"

  // If the route is an admin route but not an auth route, check for authentication
  if (isAdminRoute && !isAuthRoute) {
    // If the user is not authenticated, redirect to the login page
    if (!session) {
      const redirectUrl = new URL("/admin/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if the user has admin role
    const { data: userRole, error } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    // If there's an error or the user doesn't have admin role, redirect to login
    if (error || !userRole || userRole.role !== "admin") {
      // Sign out the user
      await supabase.auth.signOut()

      const redirectUrl = new URL("/admin/login", request.url)
      redirectUrl.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If the user is authenticated and trying to access an auth route, redirect to admin dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
}
