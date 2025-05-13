"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Note } from "@/lib/notes-storage"
import { Check, X } from "lucide-react"

interface SubmissionListProps {
  notes: Note[]
}

export function SubmissionList({ notes }: SubmissionListProps) {
  const [localNotes, setLocalNotes] = useState(notes)
  const [processingId, setProcessingId] = useState<number | null>(null)

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

  if (localNotes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 font-light">No submissions found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {localNotes.map((note) => (
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
          </div>

          {note.status === 'pending' && (
            <div className="flex gap-3">
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
            </div>
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
      ))}
    </div>
  )
} 