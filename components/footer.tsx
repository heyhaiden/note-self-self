'use client'

import Link from "next/link"

export function Footer() {
  return (
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
  )
} 