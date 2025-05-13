import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
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

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] -mt-16">
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-light tracking-tight mb-2">Submission received</h1>
              <p className="text-base font-light text-gray-600">
                Your note has been submitted anonymously and will be transformed into art.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 border border-gray-200 bg-gray-50">
                <div className="text-xs tracking-wider uppercase mb-2 text-gray-500">What happens next</div>
                <ul className="text-sm font-light space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">—</span>
                    <span>Our team will review your submission</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">—</span>
                    <span>Your note will be transformed into minimalist line art</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">—</span>
                    <span>If approved, it will appear in our gallery</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">—</span>
                    <span>Your identity remains completely anonymous</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="flex-1 rounded-none bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-light tracking-wide"
                >
                  <Link href="/gallery">View Gallery</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-none border-black hover:bg-gray-50 px-8 py-6 text-sm font-light tracking-wide"
                >
                  <Link href="/submit">Submit Another</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
