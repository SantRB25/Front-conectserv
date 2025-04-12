"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  const router = useRouter()
  const { data: session } = useSession()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Function to handle mobile menu toggle
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)

    // Dispatch a custom event that the sidebar can listen for
    const event = new CustomEvent("toggleMobileMenu", { detail: { isOpen: !showMobileMenu } })
    window.dispatchEvent(event)
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium text-gray-800 hidden md:block">
          Welcome {session?.user?.name?.split(" ")[0] || "User"}!
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-full border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* Theme toggle */}
        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <div className="h-5 w-5 rounded-full bg-blue-500"></div>
        </div>
      </div>
    </header>
  )
}

