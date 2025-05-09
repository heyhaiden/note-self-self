import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Sample gallery items
const galleryItems = [
  {
    id: 1,
    noteText: "Remember to call mom on her birthday",
    imageUrl: "/birthday-call.png",
    alt: "AI artwork of birthday reminder note",
  },
  {
    id: 2,
    noteText: "Buy more cat food before Thursday",
    imageUrl: "/surreal-cat-food.png",
    alt: "AI artwork of cat food reminder",
  },
  {
    id: 3,
    noteText: "Ideas for novel: protagonist loses memory every night",
    imageUrl: "/memory-loss-abstract.png",
    alt: "AI artwork of novel idea note",
  },
  {
    id: 4,
    noteText: "Stop overthinking everything",
    imageUrl: "/tangled-untangled-thoughts.png",
    alt: "AI artwork of self-reminder note",
  },
]

export default function GallerySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Featured Creations</h2>
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link href="/gallery">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="aspect-square relative">
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.alt} className="object-cover w-full h-full" />
              </div>
              <CardContent className="p-4 bg-amber-50 border-t">
                <p className="text-sm font-medium line-clamp-2">{item.noteText}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
