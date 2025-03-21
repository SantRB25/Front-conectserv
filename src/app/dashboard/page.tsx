import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Documentos Pendientes</CardTitle>
            <CardDescription>Completa tu verificación subiendo los documentos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center text-amber-600">• Cédula de Identidad (Frontal)</li>
              <li className="flex items-center text-amber-600">• Cédula de Identidad (Dorso)</li>
              <li className="flex items-center text-amber-600">• Foto tipo Selfie</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de la Cuenta</CardTitle>
            <CardDescription>Tu cuenta está pendiente de verificación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-amber-600">Pendiente de revisión de documentos</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes</CardTitle>
            <CardDescription>Podrás ver las solicitudes cuando tu cuenta esté verificada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground">No hay solicitudes disponibles</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

