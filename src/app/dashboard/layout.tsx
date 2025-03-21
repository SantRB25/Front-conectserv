import type React from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificación adicional de seguridad en el servidor
  const session = await auth()

  // Si no hay sesión, redirigir al login
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo a la izquierda */}
      <DashboardSidebar />

      {/* Contenido principal con header y contenido */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

