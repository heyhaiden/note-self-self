"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, FileText, ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SubmitPage() {
  const router = useRouter()
  const [noteText, setNoteText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!termsAccepted) {
      setError("Please accept the terms to continue.")
      return
    }

    // Validate that either text or image is provided
    if (!noteText && !imageFile) {
      setError("Please provide either text or an image of your note.")
      return
    }

    setIsSubmitting(true)

    try {
      let screenshotUrl = null

      // If there's an image file, upload it to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `screenshots/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("notes")
          .upload(filePath, imageFile)

        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`)
        }

        // Get the public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage.from("notes").getPublicUrl(filePath)

        screenshotUrl = publicUrl
      }

      // Submit the note to our API
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: noteText,
          screenshot_url: screenshotUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit note")
      }

      // Redirect to processing page to show the animation
      router.push("/submit/processing")
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
          </nav>
        </div>
      </header>

      <div className="container px-4 md:px-6 py-12 md:py-20">
        <Link href="/" className="inline-flex items-center text-sm mb-8 hover:underline underline-offset-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <div className="mb-2 text-xs tracking-widest uppercase">Submit</div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Share your thoughts</h1>
            <p className="text-base font-light text-gray-600">
              Share something directly from your notes app. Upload a screenshot or copy/paste the text—we want to see
              the digital fragments of your life.
            </p>
          </div>

          {error && <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
                <TabsTrigger
                  value="text"
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-4 py-3 text-sm font-light"
                >
                  <FileText className="h-4 w-4" />
                  Copy/Paste Text
                </TabsTrigger>
                <TabsTrigger
                  value="image"
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-4 py-3 text-sm font-light"
                >
                  <ImageIcon className="h-4 w-4" />
                  Upload Screenshot
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-6 space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="note-text" className="text-sm font-light">
                    Your note (copy/paste from your notes app)
                  </Label>
                  <Textarea
                    id="note-text"
                    placeholder="Paste directly from your notes app or type it exactly as it appears..."
                    className="min-h-32 font-light rounded-none border-gray-300 focus:border-black focus:ring-black"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <p className="text-xs font-light text-gray-500">
                    Don't edit or polish it—we want the raw, unfiltered version.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-6 space-y-4">
                <div className="space-y-4">
                  <Label htmlFor="note-image" className="text-sm font-light">
                    Upload a screenshot from your notes app
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-none p-6 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Note screenshot preview"
                          className="max-h-64 mx-auto"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-none border-gray-300 hover:bg-gray-50 text-sm font-light"
                          onClick={() => {
                            setImageFile(null)
                            setImagePreview(null)
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-light text-gray-600">
                            Drag and drop your screenshot, or click to browse
                          </p>
                        </div>
                        <Input
                          id="note-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-none border-gray-300 hover:bg-gray-50 text-sm font-light"
                          onClick={() => document.getElementById("note-image")?.click()}
                        >
                          Select Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-light text-gray-500">Supported formats: JPG, PNG, GIF (max 5MB)</p>
                </div>
              </TabsContent>
            </Tabs>

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
                  <Link href="/terms" className="underline underline-offset-4">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || (!noteText && !imageFile) || !termsAccepted}
                className="w-full rounded-none bg-black text-white hover:bg-gray-800 py-6 text-sm font-light tracking-wide"
              >
                {isSubmitting ? "Submitting..." : "Submit anonymously"}
              </Button>
              <p className="text-xs font-light text-gray-500 text-center mt-4">
                Your submission will be reviewed before being transformed into art.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
