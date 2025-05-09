"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { rejectSubmission } from "../actions"
import { useToast } from "@/hooks/use-toast"

interface RejectionModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: number
}

export function RejectionModal({ isOpen, onClose, noteId }: RejectionModalProps) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("noteId", noteId.toString())
    formData.append("rejectionReason", reason)

    const result = await rejectSubmission(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      onClose()
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>Reject Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="rejection-reason" className="text-sm font-light">
                Reason for rejection
              </label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter reason for rejection..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-32 font-light rounded-none border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-none border-gray-300 hover:bg-gray-50 text-sm font-light"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-none bg-black text-white hover:bg-gray-800 text-sm font-light"
            >
              {isSubmitting ? "Rejecting..." : "Reject Submission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
