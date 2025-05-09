import type { NextRequest } from "next/server"
import { createSupabaseClient } from "@/lib/supabase-client"
import { NoteSubmissionSchema } from "@/lib/validation"
import { createApiResponse, createErrorResponse } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    // Validate the request body against our schema
    const body = await request.json()
    const result = NoteSubmissionSchema.safeParse(body)

    if (!result.success) {
      return createErrorResponse("Invalid submission data", 400, result.error.format())
    }

    const validData = result.data

    // Sanitize content to prevent XSS
    const sanitizedContent = validData.content.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")

    // Validate that either content or screenshot_url is provided
    if (!sanitizedContent && !validData.screenshot_url) {
      return createErrorResponse("Either content or screenshot URL is required", 400)
    }

    // With RLS policies in place, we can use the regular client
    // Anonymous users are allowed to insert notes
    const supabase = createSupabaseClient()

    // Prepare note data
    const noteData = {
      content: sanitizedContent || "Screenshot submission",
      is_screenshot: !!validData.screenshot_url,
      screenshot_url: validData.screenshot_url || null,
      status: "pending",
      updated_at: new Date().toISOString(),
    }

    // Insert the note
    const { data: note, error } = await supabase.from("notes").insert(noteData).select().single()

    if (error) {
      console.error("Error inserting note:", error)
      return createErrorResponse("Failed to submit note", 500)
    }

    return createApiResponse(note)
  } catch (error) {
    console.error("Error in notes API:", error)
    return createErrorResponse("Internal server error", 500)
  }
}
