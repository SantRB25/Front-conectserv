"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { AccessDenied } from "@/components/access-denied"

export default function ReportsPage() {
  const { data: session } = useSession()

  // Verificación directa del rol de usuario
  if (session?.user?.tipo_usuario !== "administrador") {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Aquí puedes ver estadísticas y reportes detallados de la plataforma.</p>

          <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-400">No hay datos suficientes para generar reportes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

