import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simplified middleware to focus only on admin routes
export function middleware(request: NextRequest) {
  // Skip login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next()
  }

  // For all other admin routes, check the auth cookie
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('adminAuth')
    
    if (!authCookie || authCookie.value !== 'true') {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

// Only run middleware on admin routes to reduce complexity
export const config = {
  matcher: ['/admin/:path*']
} 