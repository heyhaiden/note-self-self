"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { generateArtwork } from "@/lib/admin-utils"
import { revalidatePath } from "next/cache"

// Action to approve a submission
export async function approveSubmission(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const noteId = Number(formData.get("noteId"))
    const categoryId = Number(formData.get("categoryId") || 0) || null

    // Get the note content for artwork generation
    const { data: note } = await supabase.from("notes").select("content").eq("id", noteId).single()

    if (!note) {
      throw new Error("Note not found")
    }

    // Update the note status to approved
    const { error } = await supabase
      .from("notes")
      .update({
        status: "approved",
        category_id: categoryId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)

    if (error) {
      throw new Error(`Failed to approve submission: ${error.message}`)
    }

    // Generate artwork for the approved note
    await generateArtwork(noteId, note.content)

    // Revalidate the admin and gallery pages
    revalidatePath("/admin")
    revalidatePath("/gallery")

    return { success: true, message: "Submission approved successfully" }
  } catch (error) {
    console.error("Error approving submission:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to approve submission",
    }
  }
}

// Action to reject a submission
export async function rejectSubmission(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const noteId = Number(formData.get("noteId"))
    const rejectionReason = (formData.get("rejectionReason") as string) || "Content not suitable"

    // Update the note status to rejected
    const { error } = await supabase
      .from("notes")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)

    if (error) {
      throw new Error(`Failed to reject submission: ${error.message}`)
    }

    // Revalidate the admin page
    revalidatePath("/admin")

    return { success: true, message: "Submission rejected successfully" }
  } catch (error) {
    console.error("Error rejecting submission:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reject submission",
    }
  }
}

// Action to bulk approve submissions
export async function bulkApproveSubmissions(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const noteIds = formData.get("noteIds") as string
    const ids = JSON.parse(noteIds) as number[]

    if (!ids.length) {
      return { success: false, message: "No submissions selected" }
    }

    // Get the notes for artwork generation
    const { data: notes } = await supabase.from("notes").select("id, content").in("id", ids)

    if (!notes || !notes.length) {
      throw new Error("Notes not found")
    }

    // Update all selected notes to approved
    const { error } = await supabase
      .from("notes")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .in("id", ids)

    if (error) {
      throw new Error(`Failed to approve submissions: ${error.message}`)
    }

    // Generate artwork for each approved note
    for (const note of notes) {
      await generateArtwork(note.id, note.content)
    }

    // Revalidate the admin and gallery pages
    revalidatePath("/admin")
    revalidatePath("/gallery")

    return { success: true, message: `${ids.length} submissions approved successfully` }
  } catch (error) {
    console.error("Error bulk approving submissions:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to approve submissions",
    }
  }
}

// Action to bulk reject submissions
export async function bulkRejectSubmissions(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const noteIds = formData.get("noteIds") as string
    const rejectionReason = (formData.get("rejectionReason") as string) || "Content not suitable"
    const ids = JSON.parse(noteIds) as number[]

    if (!ids.length) {
      return { success: false, message: "No submissions selected" }
    }

    // Update all selected notes to rejected
    const { error } = await supabase
      .from("notes")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason,
        updated_at: new Date().toISOString(),
      })
      .in("id", ids)

    if (error) {
      throw new Error(`Failed to reject submissions: ${error.message}`)
    }

    // Revalidate the admin page
    revalidatePath("/admin")

    return { success: true, message: `${ids.length} submissions rejected successfully` }
  } catch (error) {
    console.error("Error bulk rejecting submissions:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to reject submissions",
    }
  }
}
