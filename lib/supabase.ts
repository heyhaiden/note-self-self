import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type Category = {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

export type Note = {
  id: number
  content: string
  category_id: number | null
  status: "pending" | "approved" | "rejected"
  is_screenshot: boolean
  screenshot_url: string | null
  rejection_reason: string | null
  created_at: string
  updated_at: string
  approved_at: string | null
}

export type Artwork = {
  id: number
  note_id: number
  image_url: string
  alt_text: string | null
  created_at: string
  updated_at: string
}

// Type for gallery items (joined notes and artwork)
export type GalleryItem = {
  id: number
  content: string
  category: Category
  artwork: Artwork
  created_at: string
  approved_at: string | null
}

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create client for client-side usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create a server-side client (for use in server components and API routes)
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceKey)
}
