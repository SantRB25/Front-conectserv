"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { AccessDenied } from "@/components/access-denied"

export default function ProfessionalsPage() {
  const { data: session } = useSession()

  if(session?.user?.tipo_usuario!='administrador'){
    return <AccessDenied />
  }
 

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Profesionales</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profesionales Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Aquí puedes ver y gestionar todos los profesionales registrados en la plataforma.
          </p>

          <div className="mt-6 p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-400">No hay profesionales registrados en este momento.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
