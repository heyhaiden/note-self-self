import { NextResponse } from "next/server"

type ApiResponseOptions = {
  status?: number
  headers?: HeadersInit
}

export function createApiResponse<T>(
  data: T | null,
  success = true,
  message?: string,
  options: ApiResponseOptions = {},
) {
  const { status = success ? 200 : 400, headers = {} } = options

  // Add security headers
  const secureHeaders = {
    ...headers,
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline';",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  }

  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    {
      status,
      headers: secureHeaders,
    },
  )
}

// Helper for error responses
export function createErrorResponse(message: string, status = 400, errors?: any) {
  return createApiResponse(null, false, message, { status })
}
