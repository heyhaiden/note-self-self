import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "./database.types"

type ClientOptions = {
  admin?: boolean
  withCookies?: boolean
}

// Cache for clients to avoid creating too many instances
const clientCache = new Map<string, ReturnType<typeof createClient>>()

export function createSupabaseClient(options: ClientOptions = {}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  // Only use service role when absolutely necessary
  const key = options.admin ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Create a cache key based on options
  const cacheKey = `${options.admin ? "admin" : "anon"}-${options.withCookies ? "cookies" : "no-cookies"}`

  // Return cached client if available
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey) as ReturnType<typeof createClient<Database>>
  }

  const clientConfig: any = {
    auth: {
      persistSession: options.withCookies,
      autoRefreshToken: options.withCookies,
    },
  }

  // Add cookies for server components if needed
  if (options.withCookies) {
    try {
      const cookieStore = cookies()
      clientConfig.cookies = {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      }
    } catch (error) {
      console.warn("Failed to access cookies, continuing without cookie integration")
    }
  }

  const client = createClient<Database>(supabaseUrl, key, clientConfig)

  // Cache the client
  clientCache.set(cacheKey, client)

  return client
}

// Regular client for most operations - now this should work for most cases due to RLS
export function createServerSupabaseClient() {
  return createSupabaseClient({ withCookies: true })
}

// Admin client - use ONLY when absolutely necessary
export function createAdminSupabaseClient() {
  return createSupabaseClient({ admin: true })
}

// Clear client cache (useful for testing)
export function clearSupabaseClientCache() {
  clientCache.clear()
}
