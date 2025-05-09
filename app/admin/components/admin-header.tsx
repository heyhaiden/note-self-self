"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"

export default function AdminHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-light">Submission Management</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild className="rounded-none border-gray-200 font-light">
            <Link href="/admin/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-black font-light">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-light">{user?.email}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="h-auto p-0 text-xs text-gray-500 font-light hover:text-black"
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
