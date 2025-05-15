// Import from the centralized client factory
import { createServerSupabaseClient as createClient } from './supabase-client'

// Re-export for backward compatibility
export const createServerSupabaseClient = createClient 