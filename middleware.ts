import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    console.log("Middleware: Processing request for", request.nextUrl.pathname)
    
    // Create a Supabase client configured to use cookies
    const supabase = createServerSupabaseClient()

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Middleware: Session status:", session ? "Found" : "Not found")

    // Check if the request is for an admin route
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isAuthRoute =
      request.nextUrl.pathname === "/admin/login" ||
      request.nextUrl.pathname === "/admin/forgot-password" ||
      request.nextUrl.pathname === "/admin/reset-password"

    console.log("Middleware: Route type:", { isAdminRoute, isAuthRoute })

    // If the route is an admin route but not an auth route, check for authentication
    if (isAdminRoute && !isAuthRoute) {
      // If the user is not authenticated, redirect to the login page
      if (!session) {
        console.log("Middleware: No session, redirecting to login")
        const redirectUrl = new URL("/admin/login", request.url)
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      try {
        // Check if the user has admin role
        const { data: userRole, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("user_id", session.user.id)
          .single()

        console.log("Middleware: Admin role check:", { userRole, error })

        // If there's an error or the user doesn't have admin role, redirect to login
        if (error || !userRole || userRole.role !== "admin") {
          console.log("Middleware: User is not an admin, signing out and redirecting")
          // Sign out the user
          await supabase.auth.signOut()

          const redirectUrl = new URL("/admin/login", request.url)
          redirectUrl.searchParams.set("error", "unauthorized")
          return NextResponse.redirect(redirectUrl)
        }
      } catch (error) {
        console.error("Middleware: Error checking admin role:", error)
        const redirectUrl = new URL("/admin/login", request.url)
        redirectUrl.searchParams.set("error", "server_error")
        return NextResponse.redirect(redirectUrl)
      }
    }

    // If the user is authenticated and trying to access an auth route, redirect to admin dashboard
    if (session && isAuthRoute) {
      console.log("Middleware: User is authenticated and trying to access auth route, redirecting to admin")
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    console.log("Middleware: All checks passed, proceeding with request")
    return NextResponse.next()
  } catch (error) {
    console.error("Middleware: Unexpected error:", error)
    // In case of any error, redirect to login
    const redirectUrl = new URL("/admin/login", request.url)
    redirectUrl.searchParams.set("error", "server_error")
    return NextResponse.redirect(redirectUrl)
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
}
