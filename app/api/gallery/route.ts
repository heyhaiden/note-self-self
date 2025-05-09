import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("notes")
      .select(`
        id,
        content,
        created_at,
        approved_at,
        is_screenshot,
        screenshot_url,
        categories:category_id(id, name, slug, description),
        artwork:artwork(id, image_url, alt_text)
      `)
      .eq("status", "approved")
      .order("approved_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if provided
    if (category) {
      query = query.eq("categories.slug", category)
    }

    // Execute query
    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching gallery items:", error)
      return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
    }

    // Format the response
    const galleryItems = data.map((item) => ({
      id: item.id,
      content: item.content,
      category: item.categories,
      artwork: item.artwork?.[0] || null,
      is_screenshot: item.is_screenshot,
      screenshot_url: item.screenshot_url,
      created_at: item.created_at,
      approved_at: item.approved_at,
    }))

    return NextResponse.json({
      items: galleryItems,
      page,
      limit,
      total: count || 0,
      hasMore: offset + limit < (count || 0),
    })
  } catch (error) {
    console.error("Error in gallery API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
