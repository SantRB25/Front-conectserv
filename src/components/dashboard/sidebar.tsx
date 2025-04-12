"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  MessageSquare,
  Calendar,
  ShoppingBag,
  BarChart3,
  HelpCircle,
  LogOut,
  X,
  CreditCard,
  Info,
  UserCircle,
  User,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"

// Definir los menús para cada tipo de usuario
const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profesionales",
    href: "/dashboard/professionals",
    icon: Users,
  },
  {
    title: "Solicitudes",
    href: "/dashboard/requests",
    icon: ShoppingBag,
  },
  {
    title: "Mensajes",
    href: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Calendario",
    href: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Soporte",
    href: "/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const professionalMenuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Info,
  },
  {
    title: "Información",
    href: "/dashboard/informacion",
    icon: User,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: UserCircle,
  },
  {
    title: "Créditos",
    href: "/dashboard/credits",
    icon: CreditCard,
  },
  {
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [menuItems, setMenuItems] = useState<typeof adminMenuItems>([])
  const [isLoading, setIsLoading] = useState(true)

  // Determinar qué menú mostrar según el rol del usuario
  useEffect(() => {
    if (status === "loading") return

    setIsLoading(false)

    // Verificar el tipo_usuario y establecer el menú correspondiente
    const userRole = session?.user?.tipo_usuario || session?.user?.role

    if (userRole === "administrador") {
      setMenuItems(adminMenuItems)
    } else {
      setMenuItems(professionalMenuItems)
    }
  }, [session, status])

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  // Mostrar un estado de carga mientras se determina el rol
  if (isLoading) {
    return (
      <div className="hidden md:flex md:w-64 bg-[#1e4e6d] text-white items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  // Obtener el tipo de usuario para mostrar en la UI
  const userRole = session?.user?.tipo_usuario || session?.user?.role

  // Update the menu item rendering to include the special design
  return (
    <>
      {/* Sidebar for medium and large screens - fixed */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-[#1e4e6d] text-white z-30">
        <div className="flex flex-col h-full">
          {/* User profile section */}
          <div className="flex flex-col items-center py-8 px-6 border-b border-[#2a5d7c]">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white mb-3">
              {session?.user?.image ? (
                <Image
                  src={session.user.image || "/placeholder.svg"}
                  alt={session.user.name || "Usuario"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2a5d7c] flex items-center justify-center">
                  <Users className="h-10 w-10 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium">{session?.user?.name || "Usuario"}</h3>
            <p className="text-xs text-gray-300 mt-1">{session?.user?.email || ""}</p>
            <div className="mt-2 px-3 py-1 bg-[#2a5d7c] rounded-full text-xs font-medium">
              {userRole === "administrador" ? "Administrador" : "Profesional"}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto pl-4 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href} className="relative">
                    {isActive && (
                      <>
                        {/* Left curve */}
                        <div className="absolute right-0 top-[-16px] h-4 w-4 bg-[#f5f7fa]">
                          <div className="absolute bottom-0 right-0 w-full h-full rounded-br-xl bg-[#1e4e6d]"></div>
                        </div>
                        {/* Right curve */}
                        <div className="absolute right-0 bottom-[-16px] h-4 w-4 bg-[#f5f7fa]">
                          <div className="absolute top-0 right-0 w-full h-full rounded-tr-xl bg-[#1e4e6d]"></div>
                        </div>
                      </>
                    )}
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-l-full transition-colors",
                        isActive
                          ? "bg-[#f5f7fa] text-[#1e4e6d] font-semibold"
                          : "text-gray-300 hover:bg-[#2a5d7c] hover:text-white rounded-md",
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-[#2a5d7c]">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2a5d7c] hover:text-white transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar - implemented as a drawer */}
      <div className="md:hidden">
        {showMobileMenu && (
          <div className="fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)}></div>

            {/* Sidebar drawer */}
            <div className="relative flex flex-col w-64 max-w-xs bg-[#1e4e6d] text-white">
              <div className="flex items-center justify-between p-4 border-b border-[#2a5d7c]">
                <h2 className="text-xl font-bold">Menu</h2>
                <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-md hover:bg-[#2a5d7c]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* User profile section */}
              <div className="flex items-center p-4 border-b border-[#2a5d7c]">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white mr-3">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "Usuario"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2a5d7c] flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{session?.user?.name || "Usuario"}</h3>
                  <p className="text-xs text-gray-300">{session?.user?.email || ""}</p>
                  <div className="mt-1 px-2 py-0.5 bg-[#2a5d7c] rounded-full text-xs inline-block">
                    {userRole === "administrador" ? "Administrador" : "Profesional"}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive ? "bg-[#2a5d7c] text-white" : "text-gray-300 hover:bg-[#2a5d7c] hover:text-white",
                          )}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Logout button */}
              <div className="p-4 border-t border-[#2a5d7c]">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-[#2a5d7c] hover:text-white transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
