"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DebugSession() {
  const { data: session, status } = useSession()
  const [showDebug, setShowDebug] = useState(false)

  if (status === "loading") {
    return <div>Cargando sesión...</div>
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Información de Depuración
          <Button variant="outline" size="sm" onClick={() => setShowDebug(!showDebug)}>
            {showDebug ? "Ocultar" : "Mostrar"} Detalles
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Estado de la sesión: <strong>{status}</strong>
        </p>
        <p>
          Tipo de usuario: <strong>{session?.user?.tipo_usuario || "No disponible"}</strong>
        </p>

        {showDebug && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Datos completos de la sesión:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-xs">{JSON.stringify(session, null, 2)}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
