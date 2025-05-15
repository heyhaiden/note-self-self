import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import config from './lib/config'

// Define protected admin routes
const ADMIN_ROUTES = [
  '/admin',
  '/api/notes/status', 
  '/api/notes/delete',
  '/api/notes/generate-image',
]

// Routes that should skip this middleware
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/admin/login',
]

// Get auth cookie name from config
const { cookieName } = config.auth

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if the route requires admin authentication
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
  
  if (isAdminRoute) {
    // Check for admin auth cookie
    const adminAuthCookie = request.cookies.get(cookieName)
    
    if (!adminAuthCookie || adminAuthCookie.value !== 'true') {
      // Redirect unauthenticated requests to login page
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all admin routes and admin API endpoints
    '/admin/:path*',
    '/api/notes/:path*/status',
    '/api/notes/:path*/delete',
    '/api/notes/:path*/generate-image',
  ],
} 