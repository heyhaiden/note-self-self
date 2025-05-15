// Force all gallery routes to be dynamically rendered
// This is needed because they access the database which uses cookies

export const dynamic = 'force-dynamic'

// This export is needed for the file to be processed as a route segment config
export const runtime = 'nodejs'