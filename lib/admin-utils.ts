import { createServerSupabaseClient } from "@/lib/supabase"

// Function to fetch pending submissions
export async function getPendingSubmissions(page = 1, limit = 10) {
  const supabase = createServerSupabaseClient()
  const offset = (page - 1) * limit

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

// Function to fetch processed submissions
export async function getProcessedSubmissions(page = 1, limit = 10) {
  const supabase = createServerSupabaseClient()
  const offset = (page - 1) * limit

  const { data, error, count } = await supabase
    .from("notes")
    .select("*, categories:category_id(*)", { count: "exact" })
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

// Function to get submission counts
export async function getSubmissionCounts() {
  const supabase = createServerSupabaseClient()

  // Get pending count
  const { count: pendingCount, error: pendingError } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Get approved count
  const { count: approvedCount, error: approvedError } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  // Get rejected count
  const { count: rejectedCount, error: rejectedError } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")

  // Get today's counts
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISOString = today.toISOString()

  const { count: todayPendingCount } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")
    .gte("created_at", todayISOString)

  const { count: todayApprovedCount } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .gte("approved_at", todayISOString)

  const { count: todayRejectedCount } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")
    .gte("updated_at", todayISOString)

  if (pendingError || approvedError || rejectedError) {
    console.error("Error fetching counts:", pendingError || approvedError || rejectedError)
    throw new Error("Failed to fetch submission counts")
  }

  return {
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
    todayPending: todayPendingCount || 0,
    todayApproved: todayApprovedCount || 0,
    todayRejected: todayRejectedCount || 0,
  }
}

// Function to get a single submission by ID
export async function getSubmissionById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("notes").select("*, categories:category_id(*)").eq("id", id).single()

  if (error) {
    console.error("Error fetching submission:", error)
    throw new Error("Failed to fetch submission")
  }

  return data
}

// Function to generate artwork for a note
export async function generateArtwork(noteId: number, noteContent: string) {
  // In a real implementation, this would call an AI service to generate artwork
  // For now, we'll create a placeholder image URL
  const imageUrl = `/placeholder.svg?height=600&width=600&query=minimalist abstract line art, black and white, ${encodeURIComponent(
    noteContent.substring(0, 50),
  )}`

  const supabase = createServerSupabaseClient()

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
