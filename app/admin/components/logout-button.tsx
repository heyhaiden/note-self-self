"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <Button
      variant="outline"
      className="rounded-none border-black text-sm font-light tracking-wide"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
} 