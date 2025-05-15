import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search } from "lucide-react"
import { getAllNotes, Note } from "@/lib/data-access"
import { GalleryItem } from "./components/gallery-item"

// Dynamic rendering is set at the route level via route.ts

// Gallery item type for the page
type GalleryItem = {
  id: number
  title: string
  content: string
  artwork: {
    id: number
    image_url: string
    alt_text: string | null
  } | null
  is_screenshot: boolean
  screenshot_url: string | null
  created_at: string
  approved_at: string | null
}

// Convert Note to GalleryItem
function convertNoteToGalleryItem(note: Note): GalleryItem {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    artwork: note.artwork || null,
    is_screenshot: false,
    screenshot_url: null,
    created_at: note.created_at,
    approved_at: note.approved_at
  }
}

// Fetch data from local storage
async function getGalleryData() {
  const notes = await getAllNotes()
  console.log('All notes from database:', JSON.stringify(notes, null, 2))
  const approvedNotes = notes.filter(note => note.status === 'approved')
  console.log('Approved notes:', JSON.stringify(approvedNotes, null, 2))
  const galleryItems = approvedNotes.map(convertNoteToGalleryItem)
  console.log('Converted gallery items:', JSON.stringify(galleryItems, null, 2))

  return {
    galleryItems,
  }
}

export default async function GalleryPage() {
  const { galleryItems } = await getGalleryData()

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-sm mb-2 hover:underline underline-offset-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
            <h1 className="text-3xl font-light tracking-tight">Gallery</h1>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search notes..."
                className="pl-10 rounded-none border-gray-300 focus:border-black focus:ring-black font-light"
              />
            </div>
            <Button
              asChild
              className="rounded-none bg-black text-white hover:bg-gray-800 text-sm font-light tracking-wide"
            >
              <Link href="/submit">Submit your note</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.length > 0 ? (
            galleryItems.map((item) => <GalleryItem key={item.id} item={item} />)
          ) : (
            <div className="col-span-3 py-12 text-center">
              <p className="text-gray-500 font-light">No notes found. Be the first to submit!</p>
            </div>
          )}
        </div>

        {galleryItems.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              className="rounded-none border-black hover:bg-gray-50 px-8 py-6 text-sm font-light tracking-wide"
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
