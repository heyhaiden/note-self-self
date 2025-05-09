import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Simple in-memory cache for auth checks (in a real app, use Redis or similar)
const authCache: Record<string, { isAdmin: boolean; timestamp: number }> = {}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

export async function middleware(request: NextRequest) {
  // Skip middleware for auth routes
  const isAuthRoute = ["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(
    request.nextUrl.pathname,
  )

  if (isAuthRoute) {
    return NextResponse.next()
  }

  // Only protect admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  try {
    // Get auth token from cookies
    const authToken =
      request.cookies.get("sb-access-token")?.value ||
      request.cookies.get("sb-refresh-token")?.value ||
      request.cookies.get("supabase-auth-token")?.value

    if (!authToken) {
      console.log("No auth token found, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check cache first
    const cacheKey = authToken.slice(0, 50) // Use part of the token as cache key
    const cachedAuth = authCache[cacheKey]

    if (cachedAuth && Date.now() - cachedAuth.timestamp < CACHE_TTL) {
      if (cachedAuth.isAdmin) {
        return NextResponse.next()
      } else {
        return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url))
      }
    }

    // Create a Supabase client with cookies from the request
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
      },
    })

    // Get the user's session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      console.log("No session found in middleware, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Check if user exists in admin_users table
    const { data, error } = await supabase.from("admin_users").select("id").eq("user_id", session.user.id).maybeSingle()

    // Cache the result
    authCache[cacheKey] = {
      isAdmin: !error && !!data,
      timestamp: Date.now(),
    }

    // If not in admin_users table, redirect to login
    if (error || !data) {
      console.log("User not in admin_users table, redirecting to login")
      return NextResponse.redirect(new URL("/admin/login?error=unauthorized", request.url))
    }

    // User is authenticated and is in admin_users table
    return NextResponse.next()
  } catch (error) {
    console.error("Error in middleware:", error)
    return NextResponse.redirect(new URL("/admin/login?error=server", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*"],
}
