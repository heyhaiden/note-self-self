"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { RejectionModal } from "./rejection-modal"
import { BulkActionModal } from "./bulk-action-modal"
import { SubmissionDetail } from "./submission-detail"
import type { Note } from "@/lib/supabase"

interface AdminSubmissionsClientProps {
  pendingSubmissions: Note[]
  processedSubmissions: Note[]
  pendingTotal: number
  processedTotal: number
  currentPage: number
  limit: number
  currentTab: string
}

export default function AdminSubmissionsClient({
  pendingSubmissions,
  processedSubmissions,
  pendingTotal,
  processedTotal,
  currentPage,
  limit,
  currentTab,
}: AdminSubmissionsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedPendingIds, setSelectedPendingIds] = useState<number[]>([])
  const [selectedProcessedIds, setSelectedProcessedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false)
  const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState<number | null>(null)

  // Memoized handlers
  const handleTabChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set("tab", value)
      params.set("page", "1")
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams)
      params.set("page", newPage.toString())
      router.push(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname],
  )

  const handleSelectAllPending = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedPendingIds(pendingSubmissions.map((submission) => submission.id))
      } else {
        setSelectedPendingIds([])
      }
    },
    [pendingSubmissions],
  )

  const handleSelectAllProcessed = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedProcessedIds(processedSubmissions.map((submission) => submission.id))
      } else {
        setSelectedProcessedIds([])
      }
    },
    [processedSubmissions],
  )

  const handleSelectPending = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedPendingIds((prev) => [...prev, id])
    } else {
      setSelectedPendingIds((prev) => prev.filter((itemId) => itemId !== id))
    }
  }, [])

  const handleSelectProcessed = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedProcessedIds((prev) => [...prev, id])
    } else {
      setSelectedProcessedIds((prev) => prev.filter((itemId) => itemId !== id))
    }
  }, [])

  const handleApprove = useCallback(
    (id: number) => {
      setCurrentNoteId(id)
      // Create a FormData object and submit directly
      const formData = new FormData()
      formData.append("noteId", id.toString())

      // Import the approveSubmission function
      import("../actions").then(({ approveSubmission }) => {
        approveSubmission(formData).then((result) => {
          if (result.success) {
            // Refresh the page to show updated data
            router.refresh()
          }
        })
      })
    },
    [router],
  )

  const handleReject = useCallback((id: number) => {
    setCurrentNoteId(id)
    setIsRejectionModalOpen(true)
  }, [])

  const handleViewDetails = useCallback((id: number) => {
    setCurrentNoteId(id)
    setIsDetailModalOpen(true)
  }, [])

  const handleBulkAction = useCallback(() => {
    setIsBulkActionModalOpen(true)
  }, [])

  // Memoized filtered submissions
  const filteredPendingSubmissions = useMemo(() => {
    return pendingSubmissions.filter((submission) =>
      submission.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [pendingSubmissions, searchQuery])

  const filteredProcessedSubmissions = useMemo(() => {
    return processedSubmissions.filter((submission) =>
      submission.content.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [processedSubmissions, searchQuery])

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search submissions..."
              className="pl-10 rounded-none border-gray-200 focus:border-black focus:ring-black font-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-none border-gray-200 hover:bg-gray-50 font-light">
            Filter
          </Button>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-none border-gray-200 hover:bg-gray-50 font-light"
            onClick={handleBulkAction}
            disabled={
              (currentTab === "pending" && selectedPendingIds.length === 0) ||
              (currentTab === "processed" && selectedProcessedIds.length === 0)
            }
          >
            Bulk Actions
          </Button>
          <Button
            className="rounded-none bg-black text-white hover:bg-gray-800 font-light"
            onClick={handleBulkAction}
            disabled={
              (currentTab === "pending" && selectedPendingIds.length === 0) ||
              (currentTab === "processed" && selectedProcessedIds.length === 0)
            }
          >
            Process Selected
          </Button>
        </div>
      </div>

      <Tabs defaultValue={currentTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto space-x-6">
          <TabsTrigger
            value="pending"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
          >
            Pending Review
          </TabsTrigger>
          <TabsTrigger
            value="processed"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
          >
            Processed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card className="rounded-none border-gray-200">
            <CardContent className="p-6">
              <div className="border rounded-none border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="p-3 text-left">
                        <Checkbox
                          id="select-all"
                          checked={
                            selectedPendingIds.length === pendingSubmissions.length && pendingSubmissions.length > 0
                          }
                          onCheckedChange={(checked) => handleSelectAllPending(checked === true)}
                          className="rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Note Content
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Date Submitted
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Status
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPendingSubmissions.length > 0 ? (
                      filteredPendingSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-200">
                          <td className="p-3">
                            <Checkbox
                              id={`select-${submission.id}`}
                              checked={selectedPendingIds.includes(submission.id)}
                              onCheckedChange={(checked) => handleSelectPending(submission.id, checked === true)}
                              className="rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-light line-clamp-2">{submission.content}</div>
                            {submission.is_screenshot && (
                              <div className="mt-1">
                                <Badge
                                  variant="outline"
                                  className="rounded-none bg-gray-100 text-black font-light text-xs"
                                >
                                  Screenshot
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-sm font-light text-gray-500">
                            {new Date(submission.created_at).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="rounded-none bg-gray-100 text-black font-light">
                              Pending
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-gray-200"
                                onClick={() => handleApprove(submission.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-gray-200"
                                onClick={() => handleReject(submission.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 rounded-none border-gray-200"
                                onClick={() => handleViewDetails(submission.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500 font-light">
                          {searchQuery ? "No matching submissions found" : "No pending submissions"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-light text-gray-500">
                  Showing {filteredPendingSubmissions.length} of {pendingTotal} submissions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="rounded-none border-gray-200 font-light"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage * limit >= pendingTotal}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="rounded-none border-gray-200 font-light"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed" className="mt-6">
          <Card className="rounded-none border-gray-200">
            <CardContent className="p-6">
              <div className="border rounded-none border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="p-3 text-left">
                        <Checkbox
                          id="select-all-processed"
                          checked={
                            selectedProcessedIds.length === processedSubmissions.length &&
                            processedSubmissions.length > 0
                          }
                          onCheckedChange={(checked) => handleSelectAllProcessed(checked === true)}
                          className="rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                        />
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Note Content
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Date Processed
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Status
                      </th>
                      <th className="p-3 text-left font-light text-xs tracking-wider uppercase text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProcessedSubmissions.length > 0 ? (
                      filteredProcessedSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-200">
                          <td className="p-3">
                            <Checkbox
                              id={`select-processed-${submission.id}`}
                              checked={selectedProcessedIds.includes(submission.id)}
                              onCheckedChange={(checked) => handleSelectProcessed(submission.id, checked === true)}
                              className="rounded-none data-[state=checked]:bg-black data-[state=checked]:border-black"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-light line-clamp-2">{submission.content}</div>
                            {submission.is_screenshot && (
                              <div className="mt-1">
                                <Badge
                                  variant="outline"
                                  className="rounded-none bg-gray-100 text-black font-light text-xs"
                                >
                                  Screenshot
                                </Badge>
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-sm font-light text-gray-500">
                            {submission.status === "approved" && submission.approved_at
                              ? new Date(submission.approved_at).toLocaleString()
                              : submission.updated_at
                                ? new Date(submission.updated_at).toLocaleString()
                                : "-"}
                          </td>
                          <td className="p-3">
                            {submission.status === "approved" ? (
                              <Badge variant="outline" className="rounded-none bg-green-50 text-green-800 font-light">
                                Approved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-none bg-red-50 text-red-800 font-light">
                                Rejected
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-none border-gray-200 font-light"
                              onClick={() => handleViewDetails(submission.id)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-gray-500 font-light">
                          {searchQuery ? "No matching submissions found" : "No processed submissions"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm font-light text-gray-500">
                  Showing {filteredProcessedSubmissions.length} of {processedTotal} submissions
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="rounded-none border-gray-200 font-light"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage * limit >= processedTotal}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="rounded-none border-gray-200 font-light"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => setIsRejectionModalOpen(false)}
        noteId={currentNoteId || 0}
      />

      <BulkActionModal
        isOpen={isBulkActionModalOpen}
        onClose={() => setIsBulkActionModalOpen(false)}
        selectedIds={currentTab === "pending" ? selectedPendingIds : selectedProcessedIds}
      />

      <SubmissionDetail
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        submissionId={currentNoteId}
      />
    </>
  )
}
