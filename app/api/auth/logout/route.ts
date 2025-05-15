import { NextResponse } from 'next/server'
import config from '@/lib/config'

// Dynamic rendering is set at the route level via route.ts

// Get auth config
const { cookieName, cookieSecure } = config.auth

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the admin auth cookie
  response.cookies.set(cookieName, '', {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: 'strict',
    maxAge: 0, // This will expire the cookie immediately
  })

  return response
} 