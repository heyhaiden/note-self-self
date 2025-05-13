import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-lg font-light tracking-wider">
            NOTE<span className="font-normal">SELF</span>SELF
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/about" className="text-sm font-light tracking-wide hover:underline underline-offset-4">
              About
            </Link>
            <Button asChild variant="outline" className="rounded-none border-black text-sm font-light tracking-wide">
              <Link href="/submit">Submit</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto relative">
            {/* Image positioned absolutely */}
            <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[80%] aspect-square z-0">
              <img
                src="/notes_app_hero - Edited.png"
                alt="Notes app hero illustration"
                className="w-full h-full object-contain"
                aria-hidden="true"
              />
            </div>
            {/* Text content with relative positioning */}
            <div className="relative z-10 w-[45%]">
              <div className="mb-8 text-xs tracking-widest uppercase">NoteSelfSelf</div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.1]">
                big feelings,
                <br />
                <span className="font-normal">lo profile.</span>
              </h1>
              <p className="text-lg md:text-xl font-light mb-10 max-w-xl leading-relaxed">
                Share the unfiltered thoughts from your notes app, transformed into minimalist line art. From grocery
                lists to existential crises—we want to see it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="rounded-none bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-light tracking-wide"
                >
                  <Link href="/submit">Share your thoughts</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="mb-2 text-xs tracking-widest uppercase">Process</div>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">How it works</h2>
            <p className="text-base font-light text-gray-600">
              A simple process for turning your private thoughts into abstract art.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-light mb-6">01</div>
              <h3 className="text-lg font-normal mb-3 text-center">Write anonymously</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed max-w-[250px] text-left">
                Screenshot or copy/paste directly from your notes app. No editing necessary—we want the raw, unfiltered
                version.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-light mb-6">02</div>
              <h3 className="text-lg font-normal mb-3 text-center">Transform to art</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed max-w-[250px] text-left">
                Our system converts your words into unique, minimalist line art that captures their essence.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-light mb-6">03</div>
              <h3 className="text-lg font-normal mb-3 text-center">Join the gallery</h3>
              <p className="text-sm font-light text-gray-600 leading-relaxed max-w-[250px] text-left">
                Your thoughts become part of our collection, resonating with others who feel the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 md:py-32 border-t border-b border-gray-100">
        <div className="container px-4 md:px-6">
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="text-xl md:text-3xl font-light italic leading-relaxed mb-6">
              "The notes app is the last honest place in our digital lives."
            </p>
            <footer className="text-sm font-light">— NoteSelfSelf</footer>
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-sm font-light mb-2">
                NOTE<span className="font-normal">SELF</span>SELF
              </div>
              <p className="text-xs font-light text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-sm font-light">
              <Link href="/privacy" className="hover:underline underline-offset-4">
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline underline-offset-4">
                Terms
              </Link>
              <Link href="/faq" className="hover:underline underline-offset-4">
                FAQ
              </Link>
              <Link href="/contact" className="hover:underline underline-offset-4">
                Contact
              </Link>
              <a
                href="https://instagram.com/noteselfself"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
