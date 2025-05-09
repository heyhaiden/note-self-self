"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bulkApproveSubmissions, bulkRejectSubmissions } from "../actions"
import { useToast } from "@/hooks/use-toast"

interface BulkActionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedIds: number[]
}

export function BulkActionModal({ isOpen, onClose, selectedIds }: BulkActionModalProps) {
  const [action, setAction] = useState<"approve" | "reject">("approve")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIds.length === 0) {
      toast({
        title: "Error",
        description: "No submissions selected",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("noteIds", JSON.stringify(selectedIds))

    let result
    if (action === "approve") {
      result = await bulkApproveSubmissions(formData)
    } else {
      formData.append("rejectionReason", rejectionReason)
      result = await bulkRejectSubmissions(formData)
    }

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
          <DialogTitle>Bulk Action</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="action" className="text-sm font-light">
                Action
              </label>
              <Select value={action} onValueChange={(value) => setAction(value as "approve" | "reject")}>
                <SelectTrigger className="rounded-none border-gray-300 focus:border-black focus:ring-black">
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {action === "reject" && (
              <div className="space-y-2">
                <label htmlFor="rejection-reason" className="text-sm font-light">
                  Reason for rejection
                </label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="min-h-32 font-light rounded-none border-gray-300 focus:border-black focus:ring-black"
                />
              </div>
            )}
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
              {isSubmitting
                ? action === "approve"
                  ? "Approving..."
                  : "Rejecting..."
                : `${action === "approve" ? "Approve" : "Reject"} ${selectedIds.length} Submissions`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
