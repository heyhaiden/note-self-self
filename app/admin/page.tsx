import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { getAllNotes } from "@/lib/notes-storage"
import { SubmissionList } from "./components/submission-list"

export default async function AdminPage() {
  const notes = await getAllNotes()
  const pendingNotes = notes.filter(note => note.status === 'pending')
  const approvedNotes = notes.filter(note => note.status === 'approved')
  const rejectedNotes = notes.filter(note => note.status === 'rejected')

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
            <Button asChild variant="outline" className="rounded-none border-black text-sm font-light tracking-wide">
              <Link href="/submit">Submit</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="container px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center text-sm mb-2 hover:underline underline-offset-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
            <h1 className="text-3xl font-light tracking-tight">Admin Dashboard</h1>
          </div>
        </div>

        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto space-x-6 overflow-x-auto">
            <TabsTrigger
              value="pending"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
            >
              Pending ({pendingNotes.length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
            >
              Approved ({approvedNotes.length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:text-black px-1 py-3 text-sm font-light"
            >
              Rejected ({rejectedNotes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-8">
            <SubmissionList notes={pendingNotes} />
          </TabsContent>

          <TabsContent value="approved" className="mt-8">
            <SubmissionList notes={approvedNotes} />
          </TabsContent>

          <TabsContent value="rejected" className="mt-8">
            <SubmissionList notes={rejectedNotes} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 