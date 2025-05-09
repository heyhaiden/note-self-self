"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSubmissionById } from "@/lib/admin-utils"
import type { Note } from "@/lib/supabase"

interface SubmissionDetailProps {
  isOpen: boolean
  onClose: () => void
  submissionId: number | null
}

export function SubmissionDetail({ isOpen, onClose, submissionId }: SubmissionDetailProps) {
  const [submission, setSubmission] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && submissionId) {
      setLoading(true)
      setError(null)

      getSubmissionById(submissionId)
        .then((data) => {
          setSubmission(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching submission:", err)
          setError("Failed to load submission details")
          setLoading(false)
        })
    }
  }, [isOpen, submissionId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">Loading submission details...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : submission ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-xs tracking-wider uppercase text-gray-500">Status</div>
                <Badge
                  variant="outline"
                  className={`rounded-none ${
                    submission.status === "approved"
                      ? "bg-green-50 text-green-800"
                      : submission.status === "rejected"
                        ? "bg-red-50 text-red-800"
                        : "bg-gray-100 text-black"
                  } font-light`}
                >
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="text-xs tracking-wider uppercase text-gray-500 mb-2">Content</div>
                <div className="p-4 bg-gray-50 border border-gray-200 font-light">{submission.content}</div>
              </div>

              {submission.is_screenshot && submission.screenshot_url && (
                <div className="mt-4">
                  <div className="text-xs tracking-wider uppercase text-gray-500 mb-2">Screenshot</div>
                  <div className="border border-gray-200">
                    <img
                      src={submission.screenshot_url || "/placeholder.svg"}
                      alt="Note screenshot"
                      className="max-h-64 w-auto mx-auto"
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="text-xs tracking-wider uppercase text-gray-500 mb-2">Details</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submission ID:</span>
                    <span>{submission.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submitted:</span>
                    <span>{new Date(submission.created_at).toLocaleString()}</span>
                  </div>
                  {submission.status === "approved" && submission.approved_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Approved:</span>
                      <span>{new Date(submission.approved_at).toLocaleString()}</span>
                    </div>
                  )}
                  {submission.status === "rejected" && submission.rejection_reason && (
                    <div className="flex flex-col">
                      <span className="text-gray-500">Rejection Reason:</span>
                      <span className="mt-1 p-2 bg-red-50 text-red-800 text-xs">{submission.rejection_reason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">No submission found</div>
        )}

        <DialogFooter>
          <Button onClick={onClose} className="rounded-none bg-black text-white hover:bg-gray-800 text-sm font-light">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
