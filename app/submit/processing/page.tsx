"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function ProcessingPage() {
  const router = useRouter()

  // Redirect to success page after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/submit/success")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

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
        <div className="max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-gray-400" />
          <h1 className="text-2xl font-light tracking-tight mb-2">Processing your submission</h1>
          <p className="text-base font-light text-gray-600 mb-8">Please wait while we process your note...</p>
          <div className="h-1 bg-gray-100 w-full max-w-xs mx-auto overflow-hidden">
            <div className="h-full bg-black animate-[progress_3s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
