"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SubmitPage() {
  const router = useRouter()
  const [noteTitle, setNoteTitle] = useState("")
  const [noteText, setNoteText] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const [dialogType, setDialogType] = useState<"terms" | "privacy" | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!termsAccepted) {
      setError("Please accept the terms to continue.")
      return
    }

    // Validate that text is provided
    if (!noteText) {
      setError("Please provide text for your note.")
      return
    }

    setIsSubmitting(true)

    try {
      // Submit the note to our API
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: noteTitle,
          content: noteText,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to submit note")
        } else {
          throw new Error("Server error. Please try again later.")
        }
      }

      // Redirect to success page
      router.push("/submit/success")
    } catch (err) {
      console.error("Error submitting note:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsSubmitting(false)
    }
  }

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

      <div className="container px-4 md:px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center text-sm mb-8 hover:underline underline-offset-4">
          Back
        </Link>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-light mb-8">Share your thoughts</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-light">
                Title (optional)
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Give your note a title..."
                  className="font-light"
                  maxLength={50}
                  onFocus={() => setFocusedInput('title')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'title' && (
                  <p className="absolute bottom-2 right-3 text-sm text-gray-500">
                    {noteTitle.length}/50
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-light">
                Your note
              </Label>
              <div className="relative">
                <Textarea
                  id="note"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Paste your notes app submission here..."
                  className="min-h-[200px] font-light"
                  maxLength={500}
                  onFocus={() => setFocusedInput('note')}
                  onBlur={() => setFocusedInput(null)}
                />
                {focusedInput === 'note' && (
                  <p className="absolute bottom-2 right-3 text-sm text-gray-500">
                    {noteText.length}/500
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Label htmlFor="terms" className="text-sm font-light leading-none pt-0.5">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setDialogType("terms")}
                    className="underline underline-offset-4"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setDialogType("privacy")}
                    className="underline underline-offset-4"
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>
            </div>

            <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-4xl font-light">
                    {dialogType === "terms" ? "Terms of Service" : "Privacy Policy"}
                  </DialogTitle>
                </DialogHeader>
                {dialogType === "terms" ? (
                  <div className="prose prose-lg">
                    <p className="mb-4">
                      By submitting content to NoteSelfSelf, you agree to the following terms:
                    </p>

                    <h2 className="text-2xl font-light mt-8 mb-4">Content Guidelines</h2>
                    <ul className="list-disc pl-6 mb-8">
                      <li>All submissions must be anonymous and not contain identifying information</li>
                      <li>Content should be original and not infringe on others' rights</li>
                      <li>No hate speech, harassment, or harmful content</li>
                      <li>No spam or commercial content</li>
                    </ul>

                    <h2 className="text-2xl font-light mt-8 mb-4">Rights and Permissions</h2>
                    <p className="mb-4">
                      By submitting content, you grant NoteSelfSelf the right to:
                    </p>
                    <ul className="list-disc pl-6 mb-8">
                      <li>Display your content in the gallery</li>
                      <li>Transform your content into artwork</li>
                      <li>Share the artwork on social media platforms</li>
                    </ul>

                    <h2 className="text-2xl font-light mt-8 mb-4">Privacy</h2>
                    <p className="mb-8">
                      We do not collect or store any personal information. All submissions are completely anonymous.
                    </p>
                  </div>
                ) : (
                  <div className="prose prose-lg">
                    <h2 className="text-2xl font-light mt-8 mb-4">Data Collection</h2>
                    <p className="mb-4">
                      NoteSelfSelf is committed to protecting your privacy. We:
                    </p>
                    <ul className="list-disc pl-6 mb-8">
                      <li>Do not collect any personal information</li>
                      <li>Do not store any identifying data</li>
                      <li>Do not track user behavior</li>
                      <li>Do not use cookies or analytics</li>
                    </ul>

                    <h2 className="text-2xl font-light mt-8 mb-4">Content Privacy</h2>
                    <p className="mb-4">
                      All submissions are:
                    </p>
                    <ul className="list-disc pl-6 mb-8">
                      <li>Completely anonymous</li>
                      <li>Not linked to any user data</li>
                      <li>Stored securely</li>
                      <li>Never shared with third parties</li>
                    </ul>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-none bg-black text-white hover:bg-gray-800 px-8 py-6 text-sm font-light tracking-wide"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
