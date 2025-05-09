import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
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

      <div className="container px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="mb-2 text-xs tracking-widest uppercase">About</div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
              A window into the soul through our digital selves.
            </h1>
            <div className="w-12 h-[1px] bg-black mb-8"></div>
            <p className="text-lg md:text-xl font-light leading-relaxed">
              NoteSelfSelf is a platform for the unfiltered thoughts we keep hidden in our notes apps.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-light mb-4">The Concept</h2>
              <p className="text-base font-light leading-relaxed mb-4">
                We all have them—those random musings, confessions, and observations that live in our notes app. The
                grocery lists sitting next to existential questions. The draft texts we never sent. The 3 AM thoughts we
                needed to capture before they disappeared.
              </p>
              <p className="text-base font-light leading-relaxed mb-4">
                NoteSelfSelf invites you to share these digital fragments anonymously. Submit a screenshot or copy/paste
                directly from your notes app—whether it's profound, mundane, or somewhere in between.
              </p>
              <p className="text-base font-light leading-relaxed">
                <span className="font-normal">big feelings, lo profile.</span> This is a space for introverts to
                overshare without the anxiety of being identified.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-light mb-4">01</div>
                  <h3 className="text-lg font-normal mb-2">Submit Your Note</h3>
                  <p className="text-base font-light leading-relaxed">
                    Screenshot or copy/paste directly from your notes app. Submit anything from deep reflections to
                    shopping lists—it's all welcome here.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-light mb-4">02</div>
                  <h3 className="text-lg font-normal mb-2">Transformation</h3>
                  <p className="text-base font-light leading-relaxed">
                    We convert your note into minimalist black and white line art that captures its essence while
                    preserving your anonymity.
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-light mb-4">03</div>
                  <h3 className="text-lg font-normal mb-2">Join the Gallery</h3>
                  <p className="text-base font-light leading-relaxed">
                    Your transformed note becomes part of our collection, connecting with others who might be thinking
                    the same thing.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4">What to Submit</h2>
              <p className="text-base font-light leading-relaxed mb-4">
                There are no rules about what makes a "good" submission. We want to see it all:
              </p>
              <ul className="space-y-2 text-base font-light leading-relaxed mb-4">
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Unsent messages to exes, friends, or bosses</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Late-night existential questions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Grocery lists with unexpected items</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Half-formed creative ideas</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Confessions you've never shared</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Observations about strangers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">—</span>
                  <span>Reminders that make no sense out of context</span>
                </li>
              </ul>
              <p className="text-base font-light leading-relaxed">
                The more authentic, the better. We're looking for the unfiltered, unedited thoughts that reveal the
                strange, beautiful complexity of being human.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light mb-4">Privacy & Anonymity</h2>
              <p className="text-base font-light leading-relaxed mb-4">
                All submissions are completely anonymous. We don't collect identifying information, and we encourage you
                to remove any names or details that might reveal your identity or others'.
              </p>
              <p className="text-base font-light leading-relaxed">
                We review submissions to ensure they don't contain identifying information before transforming them into
                art and adding them to our gallery.
              </p>
            </section>

            <div className="pt-8 border-t border-gray-100">
              <Button
                asChild
                className="rounded-none bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-light tracking-wide"
              >
                <Link href="/submit">Submit your note</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

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
