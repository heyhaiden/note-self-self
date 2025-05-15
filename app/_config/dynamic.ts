// Global configuration for dynamic rendering
// This configuration applies to the entire application
// Next.js checks for this file to determine which routes should be dynamic

// Force dynamic rendering for the entire app
export const dynamic = 'force-dynamic'

// Specify that we want to use Node.js runtime
export const runtime = 'nodejs'

// Export a default export to ensure the file is correctly processed
export default { dynamic, runtime }