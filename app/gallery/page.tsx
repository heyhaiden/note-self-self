import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"
import type { Category } from "@/lib/supabase"

// Gallery item type for the page
type GalleryItem = {
  id: number
  content: string
  category: {
    id: number
    name: string
    slug: string
  }
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

// Fetch data from Supabase
async function getGalleryData() {
  const supabase = createServerSupabaseClient()

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Fetch approved notes with their categories and artwork
  const { data: notes } = await supabase
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
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(12)

  // Format the gallery items
  const galleryItems =
    notes?.map((item) => ({
      id: item.id,
      content: item.content,
      category: item.categories as Category,
      artwork: item.artwork?.[0] || null,
      is_screenshot: item.is_screenshot,
      screenshot_url: item.screenshot_url,
      created_at: item.created_at,
      approved_at: item.approved_at,
    })) || []

  return {
    categories: categories || [],
    galleryItems,
  }
}

export default async function GalleryPage() {
  const { categories, galleryItems } = await getGalleryData()

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

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto space-x-6 overflow-x-auto">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
            >
              All
            </TabsTrigger>

            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.slug}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light whitespace-nowrap"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.length > 0 ? (
                galleryItems.map((item) => <GalleryItem key={item.id} item={item} />)
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <p className="text-gray-500 font-light">No notes found. Be the first to submit!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.slug} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.filter((item) => item.category?.slug === category.slug).length > 0 ? (
                  galleryItems
                    .filter((item) => item.category?.slug === category.slug)
                    .map((item) => <GalleryItem key={item.id} item={item} />)
                ) : (
                  <div className="col-span-3 py-12 text-center">
                    <p className="text-gray-500 font-light">No notes found in this category. Be the first to submit!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

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

interface GalleryItemProps {
  item: GalleryItem
}

function GalleryItem({ item }: GalleryItemProps) {
  // Determine the image source - either artwork image, screenshot, or placeholder
  const imageSource =
    item.artwork?.image_url ||
    (item.is_screenshot && item.screenshot_url) ||
    `/placeholder.svg?height=400&width=400&query=minimalist abstract line art, black and white, ${item.id}`

  return (
    <Link href={`/gallery/${item.id}`} className="group">
      <div className="border border-gray-200 group-hover:border-gray-300 transition-colors h-full flex flex-col">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
          <img
            src={imageSource || "/placeholder.svg"}
            alt={item.artwork?.alt_text || `Abstract representation of note: ${item.content.substring(0, 30)}...`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">
            {item.category?.name || "Uncategorized"}
          </div>
          <p className="text-base font-light leading-relaxed flex-grow">{item.content}</p>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="w-12 h-[1px] bg-black"></div>
            <span className="text-xs font-light text-gray-500">View</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
