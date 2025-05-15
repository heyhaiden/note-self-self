/**
 * Application configuration
 * Centralizes all environment variables and configuration settings
 */

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'

// Auth configuration
export const AUTH_CONFIG = {
  cookieName: 'adminAuth',
  cookieMaxAge: 60 * 60 * 24 * 7, // 7 days
  cookieSecure: isProduction,
}

// Supabase configuration
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
}

// Admin credentials
export const ADMIN_CONFIG = {
  username: process.env.ADMIN_USERNAME || '',
  password: process.env.ADMIN_PASSWORD || '',
}

// MindStudio configuration
export const MINDSTUDIO_CONFIG = {
  apiKey: process.env.MINDSTUDIO_API_KEY || '',
  agentId: process.env.MINDSTUDIO_AGENT_ID || '',
  apiUrl: 'https://api.mindstudio.ai/developer/v2/apps/run',
}

// Validation constants
export const VALIDATION = {
  maxTitleLength: 50,
  maxContentLength: 500,
  maxAltTextLength: 200,
}

// Ensure required environment variables are set
export function validateConfig() {
  const requiredVars = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: SUPABASE_CONFIG.url },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: SUPABASE_CONFIG.anonKey },
    { name: 'ADMIN_USERNAME', value: ADMIN_CONFIG.username },
    { name: 'ADMIN_PASSWORD', value: ADMIN_CONFIG.password },
  ]

  const missingVars = requiredVars
    .filter(v => !v.value)
    .map(v => v.name)

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

// Export default config object
const config = {
  isProduction,
  isDevelopment,
  isTest,
  auth: AUTH_CONFIG,
  supabase: SUPABASE_CONFIG,
  admin: ADMIN_CONFIG,
  mindstudio: MINDSTUDIO_CONFIG,
  validation: VALIDATION,
  validateConfig,
}

export default config