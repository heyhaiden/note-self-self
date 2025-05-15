import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-client"
import { notFound } from "next/navigation"

// Dynamic rendering is explicitly set for this route
export const dynamic = 'force-dynamic'

// Fetch note details from Supabase
async function getNoteDetails(id: number) {
  const supabase = await createServerSupabaseClient()

  // Fetch the note with its category and artwork
  const { data: note, error } = await supabase
    .from("notes")
    .select(`
      id,
      content,
      created_at,
      approved_at,
      is_screenshot,
      screenshot_url,
      categories:category_id(id, name, slug),
      artwork:artwork(id, image_url, alt_text)
    `)
    .eq("id", id)
    .eq("status", "approved")
    .single()

  if (error || !note) {
    return null
  }

  // Fetch related notes
  const { data: relatedNotes } = await supabase
    .from("notes")
    .select(`
      id,
      content,
      categories:category_id(id, name, slug)
    `)
    .eq("status", "approved")
    .neq("id", id)
    .limit(2)

  return {
    note,
    relatedNotes: relatedNotes || [],
  }
}

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const noteId = Number.parseInt(params.id)

  if (isNaN(noteId)) {
    notFound()
  }

  const data = await getNoteDetails(noteId)

  if (!data) {
    notFound()
  }

  const { note, relatedNotes } = data

  // Determine the image source - either artwork image, screenshot, or placeholder
  const imageSource =
    note.artwork?.[0]?.image_url ||
    (note.is_screenshot && note.screenshot_url) ||
    `/placeholder.svg?height=600&width=600&query=minimalist abstract line art, black and white, ${note.id}`

  return (
    <div className="relative min-h-screen bg-white text-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-lg font-light tracking-wider">
            NOTE<span className="font-normal">SELF</span>SELF
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/gallery" className="text-sm font-light tracking-wide hover:underline underline-offset-4">
              Gallery
            </Link>
            <Link href="/about" className="text-sm font-light tracking-wide hover:underline underline-offset-4">
              About
            </Link>
            <Button asChild variant="outline" className="rounded-none border-black text-sm font-light tracking-wide">
              <Link href="/submit">Submit</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container px-4 md:px-6 py-12">
        <Link href="/gallery" className="inline-flex items-center text-sm mb-8 hover:underline underline-offset-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Image Section */}
          <div className="bg-gray-50 border border-gray-100">
            <img
              src={imageSource || "/placeholder.svg"}
              alt={
                note.artwork?.[0]?.alt_text || `Abstract representation of note: ${note.content.substring(0, 30)}...`
              }
              className="w-full h-auto"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs tracking-wider uppercase text-gray-500">
                  {note.categories?.[0]?.name || "Uncategorized"}
                </span>
                <span className="text-xs font-light text-gray-400">
                  {new Date(note.approved_at || note.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="border-t border-b border-gray-100 py-8 mb-8">
                <p className="text-xl md:text-2xl font-light leading-relaxed">{note.content}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">About this piece</div>
                  <p className="text-base font-light text-gray-600 leading-relaxed">
                    This note was captured directly from someone's notes app and transformed into minimalist line art
                    using our generative algorithm. The abstract patterns reflect the emotional undertones and structure
                    of the original note, creating a visual representation of our digital thought fragments.
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-none border-black hover:bg-gray-50 px-8 py-6 text-sm font-light tracking-wide"
                  >
                    <Link href="/submit">Share your own thought</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Related Notes */}
            {relatedNotes.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="text-xs tracking-wider uppercase mb-6 text-gray-500">Related notes</div>
                <div className="space-y-6">
                  {relatedNotes.map((item) => (
                    <Link key={item.id} href={`/gallery/${item.id}`} className="block group">
                      <div className="border border-gray-200 group-hover:border-gray-300 transition-colors p-6">
                        <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">
                          {item.categories?.[0]?.name || "Uncategorized"}
                        </div>
                        <p className="text-base font-light leading-relaxed">{item.content}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                          <div className="w-12 h-[1px] bg-black"></div>
                          <span className="text-xs font-light text-gray-500">View</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
