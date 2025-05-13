import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

// Validate that environment variables are set
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
      response.cookies.set('adminAuth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
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