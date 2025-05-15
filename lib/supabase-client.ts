import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import config from './config'

// Get Supabase credentials from config
const { url: supabaseUrl, anonKey: supabaseKey, serviceRoleKey } = config.supabase

// Type for client environment
export type ClientEnv = 'server' | 'client' | 'admin'

/**
 * Get the appropriate Supabase client based on the environment
 * 
 * @param env - The environment to get the client for
 * @returns A Supabase client instance
 */
export function getSupabaseClient(env: ClientEnv = 'client') {
  // For browser/client usage
  if (env === 'client') {
    return createClient(supabaseUrl, supabaseKey)
  }
  
  // For admin operations (using service role key)
  if (env === 'admin' && serviceRoleKey) {
    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  // Default to client for safety
  return createClient(supabaseUrl, supabaseKey)
}

/**
 * Create a server-side Supabase client with cookie handling
 * To be used in server components and API routes
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.delete({ name, ...options })
        },
      },
    }
  )
}