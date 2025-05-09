import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const data = await request.json()

    // Validate required fields
    if (!data.content && !data.screenshot_url) {
      return NextResponse.json({ error: "Either content or screenshot_url is required" }, { status: 400 })
    }

    // Prepare note data
    const noteData = {
      content: data.content || "",
      is_screenshot: !!data.screenshot_url,
      screenshot_url: data.screenshot_url || null,
      status: "pending",
      category_id: data.category_id || null,
    }

    // Insert note into database
    const { data: note, error } = await supabase.from("notes").insert(noteData).select().single()

    if (error) {
      console.error("Error inserting note:", error)
      return NextResponse.json({ error: "Failed to submit note" }, { status: 500 })
    }

    return NextResponse.json({ success: true, note })
  } catch (error) {
    console.error("Error in notes API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
