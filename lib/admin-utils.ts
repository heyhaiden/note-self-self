import { createSupabaseClient } from "@/lib/supabase-client"

// Optimized function to fetch submission counts
export async function getSubmissionCounts() {
  const supabase = createSupabaseClient()

  // Get today's date at midnight
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISOString = today.toISOString()

  // Use the new database function
  const { data, error } = await supabase.rpc("get_submission_counts", { today_date: todayISOString })

  if (error) {
    console.error("Error fetching counts:", error)
    throw new Error("Failed to fetch submission counts")
  }

  // Return the counts with default values if data is null
  return {
    pending: data?.pending || 0,
    approved: data?.approved || 0,
    rejected: data?.rejected || 0,
    todayPending: data?.today_pending || 0,
    todayApproved: data?.today_approved || 0,
    todayRejected: data?.today_rejected || 0,
  }
}

// Optimized function to fetch pending submissions with pagination
export async function getPendingSubmissions(page = 1, limit = 10) {
  const supabase = createSupabaseClient()
  const offset = (page - 1) * limit

  // Use a single query with count option
  const { data, error, count } = await supabase
    .from("notes")
    .select("*", { count: "exact" })
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching pending submissions:", error)
    throw new Error("Failed to fetch pending submissions")
  }

  return {
    submissions: data || [],
    total: count || 0,
    page,
    limit,
    hasMore: offset + limit < (count || 0),
  }
}

// Optimized function to fetch processed submissions with pagination
export async function getProcessedSubmissions(page = 1, limit = 10) {
  const supabase = createSupabaseClient()
  const offset = (page - 1) * limit

  // Use a single query with count option
  const { data, error, count } = await supabase
    .from("notes")
    .select("*", { count: "exact" })
    .in("status", ["approved", "rejected"])
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching processed submissions:", error)
    throw new Error("Failed to fetch processed submissions")
  }

  return {
    submissions: data || [],
    total: count || 0,
    page,
    limit,
    hasMore: offset + limit < (count || 0),
  }
}

// Function to get a single submission by ID with caching
const submissionCache = new Map<number, any>()

export async function getSubmissionById(id: number) {
  // Check cache first
  if (submissionCache.has(id)) {
    return submissionCache.get(id)
  }

  const supabase = createSupabaseClient()

  const { data, error } = await supabase.from("notes").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching submission:", error)
    throw new Error("Failed to fetch submission")
  }

  // Cache the result (with a reasonable limit)
  if (submissionCache.size > 100) {
    // Clear oldest entries if cache gets too large
    const oldestKey = submissionCache.keys().next().value
    submissionCache.delete(oldestKey)
  }

  submissionCache.set(id, data)
  return data
}

// Function to generate artwork for a note
export async function generateArtwork(noteId: number, noteContent: string) {
  // In a real implementation, this would call an AI service to generate artwork
  // For now, we'll create a placeholder image URL
  const imageUrl = `/placeholder.svg?height=600&width=600&query=minimalist abstract line art, black and white, ${encodeURIComponent(
    noteContent.substring(0, 50),
  )}`

  const supabase = createSupabaseClient({ admin: true })

  // Create artwork record
  const { data, error } = await supabase
    .from("artwork")
    .insert({
      note_id: noteId,
      image_url: imageUrl,
      alt_text: `Abstract representation of note: ${noteContent.substring(0, 30)}...`,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating artwork:", error)
    throw new Error("Failed to create artwork")
  }

  return data
}
