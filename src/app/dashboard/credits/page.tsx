"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { CreditCard, Plus } from "lucide-react"
import { AccessDenied } from "@/components/access-denied"

export default function CreditsPage() {
  const { data: session } = useSession()

  // Verificación directa del rol de usuario - solo profesionales pueden acceder
  if (session?.user?.tipo_usuario === "administrador") {
    return <AccessDenied />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Créditos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Comprar Créditos
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Créditos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-gray-500">Créditos disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-400">No hay transacciones recientes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
