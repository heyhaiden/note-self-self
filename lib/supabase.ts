import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Types for our database tables
export type Note = {
  id: number
  content: string
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
  artwork: Artwork
  created_at: string
  approved_at: string | null
}

// Create a singleton for the browser client
let browserClient: ReturnType<typeof createClient> | null = null

export const supabase = (() => {
  if (typeof window === "undefined") {
    // We're on the server, we can't use a singleton here
    // because we need to get cookies from the request
    return createServerClient()
  }

  // Client-side: use singleton pattern
  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase URL and anon key are required")
    }

    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: "noteselfself-auth",
        autoRefreshToken: true,
      },
    })
  }

  return browserClient
})()

// Create a server-side client (for use in server components and API routes)
function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and service key are required for server client")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
  })
}

// Create a server-side client with cookies
export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!supabaseUrl) {
      throw new Error("Supabase URL is required for server client")
    }

    // For API routes and server actions that need to bypass RLS, use the service role key
    if (supabaseServiceKey) {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    }

    // For regular server components, use the anon key with cookies
    if (!supabaseAnonKey) {
      throw new Error("Supabase anon key is required for server client")
    }

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    // Fallback to a basic client if cookies() fails
    return createServerClient()
  }
}

// Create a server-side admin client that always uses the service role key
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL and service role key are required for admin client")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Helper function to ensure storage bucket exists
export async function ensureStorageBucketExists() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets()

    // Check if the notes bucket exists
    const notesBucket = buckets?.find((bucket) => bucket.name === "notes")

    if (!notesBucket) {
      // Create the bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket("notes", {
        public: true, // Make the bucket public
      })

      if (error) {
        console.error("Error creating notes bucket:", error)
      } else {
        console.log("Notes bucket created successfully")
      }
    }
  } catch (error) {
    console.error("Error checking/creating storage bucket:", error)
  }
}
