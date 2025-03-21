"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut, Menu, User, Bell } from "lucide-react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium md:hidden">ConectServ</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              {session?.user?.image ? (
                <img
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "Usuario"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="hidden sm:inline-block">{session?.user?.name || "Mi cuenta"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

