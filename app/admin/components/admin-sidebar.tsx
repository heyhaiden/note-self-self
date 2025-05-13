"use client"

import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Clock, BarChart3, ImageIcon, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 border-r border-gray-100 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-100">
        <div className="text-lg font-light tracking-wider">
          NOTE<span className="font-normal">SELF</span>SELF
        </div>
        <p className="text-xs font-light text-gray-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-3 py-2 ${
            isActive("/admin") &&
            !isActive("/admin/gallery") &&
            !isActive("/admin/analytics") &&
            !isActive("/admin/settings")
              ? "bg-gray-100 text-black"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span className="text-sm font-light">Submissions</span>
        </Link>
        <Link
          href="/admin/gallery"
          className={`flex items-center gap-3 px-3 py-2 ${
            isActive("/admin/gallery") ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="text-sm font-light">Gallery</span>
        </Link>
        <Link
          href="/admin/analytics"
          className={`flex items-center gap-3 px-3 py-2 ${
            isActive("/admin/analytics") ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm font-light">Analytics</span>
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-3 py-2 ${
            isActive("/admin/settings") ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-light">Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={signOut}
          className="w-full justify-start text-gray-600 font-light hover:bg-gray-100 hover:text-black"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
