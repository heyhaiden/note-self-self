import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-full">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-light">Delete Note</h2>
        </div>
        
        <p className="text-gray-600 mb-8 font-light">
          Are you sure you want to delete this note? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            className="rounded-none border-gray-300 text-gray-600 hover:bg-gray-50"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="rounded-none border-red-600 text-red-600 hover:bg-red-50"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  )
} 