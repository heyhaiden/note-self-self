// This file ensures all admin routes are rendered dynamically
// We need this because admin pages interact with cookies for authentication

export const dynamic = 'force-dynamic'

// This export is needed for the file to be processed as a route segment config
export const runtime = 'nodejs'