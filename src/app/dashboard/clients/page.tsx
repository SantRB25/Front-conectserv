"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { AccessDenied } from "@/components/access-denied"

export default function ClientsPage() {
  const { data: session } = useSession()

  // Verificación directa del rol de usuario - solo profesionales pueden acceder
  if (session?.user?.tipo_usuario === "administrador") {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mis Clientes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Clientes Activos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aquí podrás ver todos tus clientes activos y gestionar tus servicios.</p>

          <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-400">No tienes clientes activos en este momento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
