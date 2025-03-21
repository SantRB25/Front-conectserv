"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Settings, MessageSquare, Calendar } from "lucide-react"

const menuItems = [
  {
    title: "Panel Principal",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documentos",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
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
    title: "Configuración",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar para pantallas medianas y grandes - fijo */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r z-30">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold text-primary">ConectServ</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar para móviles - se mostrará como un drawer */}
      <div className="md:hidden">{/* Implementación del drawer para móviles se puede agregar aquí */}</div>
    </>
  )
}

