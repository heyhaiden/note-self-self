"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { approveSubmission } from "../actions"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/lib/supabase"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: number
  categories: Category[]
}

export function CategoryModal({ isOpen, onClose, noteId, categories }: CategoryModalProps) {
  const [categoryId, setCategoryId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && categories.length > 0) {
      setCategoryId(categories[0].id.toString())
    }
  }, [isOpen, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("noteId", noteId.toString())
    formData.append("categoryId", categoryId)

    const result = await approveSubmission(formData)

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
          <DialogTitle>Approve Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-light">
                Select Category
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="rounded-none border-gray-300 focus:border-black focus:ring-black">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isSubmitting ? "Approving..." : "Approve Submission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
