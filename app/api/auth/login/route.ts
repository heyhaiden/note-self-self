import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import config from '@/lib/config'

// Dynamic rendering is set at the route level via route.ts

// Get credentials from config
const { username: ADMIN_USERNAME, password: ADMIN_PASSWORD } = config.admin
const { cookieName, cookieMaxAge, cookieSecure } = config.auth

// Validate that credentials are set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('Admin credentials not configured in environment variables')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true })
      
      // Set HTTP-only cookie
      response.cookies.set(cookieName, 'true', {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: 'strict',
        maxAge: cookieMaxAge, // From config
      })

      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 