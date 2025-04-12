"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { AccessDenied } from "@/components/access-denied"

export default function RequestsPage() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const accessDenied = searchParams.get("access_denied") === "true"

  // Si el acceso está denegado, mostrar el componente de acceso denegado
  if (accessDenied) {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Solicitudes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aquí puedes ver y gestionar todas las solicitudes de servicios pendientes.</p>

          <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-400">No hay solicitudes pendientes en este momento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
