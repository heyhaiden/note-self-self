"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Upload, FileText, ImageIcon, AlertTriangle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SubmitPage() {
  const router = useRouter()
  const [noteText, setNoteText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"text" | "image">("text")
  const [bucketStatus, setBucketStatus] = useState<"checking" | "exists" | "not-exists" | "error">("checking")
  const [storageWarning, setStorageWarning] = useState<string | null>(null)

  // Check if the bucket exists when the component mounts
  useEffect(() => {
    async function checkBucketStatus() {
      try {
        // Call the server-side API to check bucket status
        const response = await fetch("/api/storage/setup")

        const result = await response.json()

        if (response.ok) {
          if (result.bucketExists) {
            setBucketStatus("exists")
          } else {
            setBucketStatus("not-exists")
            setStorageWarning("Image uploads are currently unavailable. Please use text submission instead.")
            // Force switch to text tab if bucket doesn't exist
            setActiveTab("text")
          }
        } else {
          console.error("Error checking bucket status:", result.error)
          setBucketStatus("error")
          setStorageWarning("Unable to verify storage status. Image uploads may not work.")
        }
      } catch (err) {
        console.error("Error checking bucket status:", err)
        setBucketStatus("error")
        setStorageWarning("Unable to verify storage status. Image uploads may not work.")
      }
    }

    checkBucketStatus()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image file is too large. Maximum size is 5MB.")
        return
      }

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
    if (activeTab === "text" && !noteText.trim()) {
      setError("Please enter your note text.")
      return
    }

    if (activeTab === "image" && !imageFile) {
      setError("Please upload a screenshot of your note.")
      return
    }

    // If bucket doesn't exist and we're in image tab, show error
    if (activeTab === "image" && bucketStatus !== "exists") {
      setError("Image uploads are currently unavailable. Please use text submission instead.")
      return
    }

    setIsSubmitting(true)

    try {
      let screenshotUrl = null

      // Only attempt to upload if bucket exists and we're in image tab
      if (activeTab === "image" && imageFile && bucketStatus === "exists") {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `screenshots/${fileName}`

        // Try to upload the file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("notes")
          .upload(filePath, imageFile)

        if (uploadError) {
          console.error("Upload error:", uploadError)

          // If we have text, continue with text-only submission
          if (noteText.trim()) {
            console.log("Continuing with text-only submission due to upload error")
          } else {
            throw new Error(`Error uploading image: ${uploadError.message}`)
          }
        } else {
          // Get the public URL for the uploaded file
          const {
            data: { publicUrl },
          } = supabase.storage.from("notes").getPublicUrl(filePath)

          screenshotUrl = publicUrl
        }
      }

      // Prepare submission data
      const submissionData = {
        content: noteText.trim() ? noteText : "Screenshot submission",
        screenshot_url: screenshotUrl,
      }

      // Submit the note to our API
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit note")
      }

      // Redirect to processing page
      router.push("/submit/processing")
    } catch (err) {
      console.error("Error submitting note:", err)

      // Show a more user-friendly error message
      if (err instanceof Error && err.message.includes("row-level security policy")) {
        setError(
          "We're experiencing technical difficulties with our submission system. Please try again later or contact support.",
        )
      } else {
        setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again later.")
      }

      setIsSubmitting(false)
    }
  }

  // Disable image tab if bucket doesn't exist
  const isImageTabDisabled = bucketStatus === "not-exists" || bucketStatus === "error"

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

          {storageWarning && (
            <Alert className="mb-6 rounded-none bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
              <AlertDescription className="text-amber-800">{storageWarning}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6 rounded-none">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <Tabs
              defaultValue="text"
              value={activeTab}
              onValueChange={(value) => {
                // Only allow changing to image tab if it's not disabled
                if (value === "image" && isImageTabDisabled) {
                  setError("Image uploads are currently unavailable. Please use text submission instead.")
                  return
                }
                setActiveTab(value as "text" | "image")
              }}
              className="w-full"
            >
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
                  disabled={isImageTabDisabled}
                  className="flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-4 py-3 text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
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

                  {/* Add a text field in the image tab as a fallback */}
                  <div className="pt-4 border-t border-gray-100 mt-4">
                    <Label htmlFor="note-text-fallback" className="text-sm font-light">
                      Note text (optional, used if image upload fails)
                    </Label>
                    <Textarea
                      id="note-text-fallback"
                      placeholder="Add a text description of your note as a backup..."
                      className="mt-2 min-h-24 font-light rounded-none border-gray-300 focus:border-black focus:ring-black"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                  </div>
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
                disabled={
                  isSubmitting ||
                  (activeTab === "text" && !noteText.trim()) ||
                  (activeTab === "image" && !imageFile && !noteText.trim()) ||
                  !termsAccepted
                }
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
