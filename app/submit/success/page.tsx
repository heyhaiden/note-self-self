import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  return (
    <div className="relative min-h-screen bg-white text-black flex flex-col">
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
          </nav>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
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

            <div className="space-y-3">
              <Button
                asChild
                className="w-full rounded-none bg-black text-white hover:bg-gray-800 py-6 text-sm font-light tracking-wide"
              >
                <Link href="/gallery">Browse gallery</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-black hover:bg-gray-50 py-6 text-sm font-light tracking-wide"
              >
                <Link href="/">Return home</Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs font-light text-gray-500">Thank you for contributing to NoteSelfSelf.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
