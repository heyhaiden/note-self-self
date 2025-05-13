"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/lib/notes-storage"
import { Check, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

interface SubmissionListProps {
  notes: Note[]
}

export function SubmissionList({ notes }: SubmissionListProps) {
  const [localNotes, setLocalNotes] = useState(notes)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [generatingImageId, setGeneratingImageId] = useState<number | null>(null)

  const handleStatusUpdate = async (id: number, status: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      const response = await fetch(`/api/notes/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const updatedNote = await response.json()
      setLocalNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? updatedNote : note
        )
      )
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleGenerateImage = async (id: number) => {
    setGeneratingImageId(id)
    try {
      console.log('Generating image for note:', id)
      const response = await fetch(`/api/notes/${id}/generate-image`, {
        method: 'POST',
      })

      if (!response.ok) {
        let errorMessage = 'Failed to generate image';
        try {
          const errorData = await response.json()
          console.error('Error response from generate-image API:', errorData)
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          // If the error response is not valid JSON
          const errorText = await response.text()
          console.error('Error response (text):', errorText)
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const updatedNote = await response.json()
      console.log('Received updated note:', updatedNote)
      
      setLocalNotes(prevNotes => {
        const newNotes = prevNotes.map(note =>
          note.id === id ? updatedNote : note
        )
        console.log('Updated local notes:', newNotes)
        return newNotes
      })
    } catch (error) {
      console.error('Error generating image:', error)
      // You might want to show this error to the user in a toast or alert
      alert(error instanceof Error ? error.message : 'Failed to generate image')
    } finally {
      setGeneratingImageId(null)
    }
  }

  if (localNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-light">No submissions found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {localNotes.map((note) => {
        console.log('Rendering note:', note)
        return (
          <div
            key={note.id}
            className="border border-gray-200 p-6 flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="flex-grow">
              <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">
                ID: {note.id}
              </div>
              <p className="text-base font-light leading-relaxed">{note.content}</p>
              <div className="mt-4 text-sm text-gray-500">
                Submitted: {new Date(note.created_at).toLocaleString()}
              </div>
              
              {/* Image Preview Section */}
              {note.artwork && note.artwork.image_url && (
                <div className="mt-6">
                  <div className="text-xs tracking-wider uppercase mb-3 text-gray-500">
                    Generated Artwork
                  </div>
                  <div className="relative aspect-square w-full max-w-[300px] border border-gray-200">
                    <Image
                      src={note.artwork.image_url}
                      alt={note.artwork.alt_text || "Generated artwork"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {note.title && (
                    <p className="mt-2 text-sm font-light">{note.title}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {note.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-gray-600 text-gray-600 hover:bg-gray-50"
                    onClick={() => handleGenerateImage(note.id)}
                    disabled={generatingImageId === note.id}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {generatingImageId === note.id ? "Generating..." : "Generate Image"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => handleStatusUpdate(note.id, 'approved')}
                    disabled={processingId === note.id}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-none border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => handleStatusUpdate(note.id, 'rejected')}
                    disabled={processingId === note.id}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}

              {note.status === 'approved' && (
                <div className="text-sm text-green-600">
                  Approved: {new Date(note.approved_at!).toLocaleString()}
                </div>
              )}

              {note.status === 'rejected' && (
                <div className="text-sm text-red-600">
                  Rejected
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
} 