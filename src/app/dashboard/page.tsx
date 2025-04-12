"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  ClipboardCheck,
  CheckCircle,
  MousePointerClick,
  TrendingUp,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSession } from "next-auth/react"
import { DebugSession } from "./debug"
import { ProfileAlert } from "@/components/dashboard/profile-alert"

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboardStats()
  const { data: session } = useSession()

  // Determinar si el usuario es administrador
  const isAdmin = session?.user?.tipo_usuario === "administrador"

  return (
    <div className="space-y-6">
      {/* Componente de depuración - solo visible en desarrollo */}
      {process.env.NODE_ENV !== "production" && <DebugSession />}

      {/* Alerta de perfil incompleto - solo para profesionales */}
      {!isAdmin && <ProfileAlert />}

      {/* Overview Section - Solo visible para administradores */}
      {isAdmin && (
        <section className="bg-[#e6e9f5] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resumen de Profesionales</h2>
            <Button variant="outline" size="sm" className="bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              Filtro de Fecha
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-grow gap-6">
            <div className="max-w-[300px]">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl text-gray-800 font-semibold">{stats?.profesionales_registrados || 0}</p>
                        <p className="text-sm text-gray-500">Profesionales Registrados</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="max-w-[300px]">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <ClipboardCheck className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-2xl text-gray-800 font-semibold">{stats?.verificacion_pendiente || 0}</p>
                        <p className="text-sm text-gray-500">Verificación pendiente</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="max-w-[300px]">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl text-gray-800 font-semibold">{stats?.profesionales_activos || 0}</p>
                        <p className="text-sm text-gray-500">Profesionales activos</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Leads Section - Solo visible para administradores */}
      {isAdmin && (
        <section className="bg-[#e6e9f5] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resumen de Solicitudes</h2>
            <Button variant="outline" size="sm" className="bg-white">
              <Calendar className="h-4 w-4 mr-2" />
              Filtro de Fecha
            </Button>
          </div>

          <div className="flex flex-grow gap-6">
            <div className="max-w-[300px]">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <MousePointerClick className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl text-gray-800 font-semibold">650</p>
                      <p className="text-sm text-gray-500">Leads captados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-[300px]">
              <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl text-gray-800 font-semibold">508</p>
                      <p className="text-sm text-gray-500">Conversiones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contenido para profesionales */}
      {!isAdmin && (
        <section className="bg-[#e6e9f5] rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Bienvenido a tu panel de profesional</h2>
          </div>

          <Card className="bg-white border border-gray-100 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">
                Desde aquí podrás gestionar tus servicios, ver tus clientes y administrar tus créditos.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-blue-800 mb-2">Completa tu perfil</h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Un perfil completo aumenta tus posibilidades de ser contactado por clientes.
                    </p>
                    <Button size="sm" variant="outline" className="bg-white">
                      Editar perfil
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4">
                    <h3 className="font-medium text-green-800 mb-2">Adquiere créditos</h3>
                    <p className="text-sm text-green-700 mb-3">
                      Los créditos te permiten destacar entre los demás profesionales.
                    </p>
                    <Button size="sm" variant="outline" className="bg-white">
                      Ver planes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Additional dashboard content - visible para todos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-4">
              {/* Activity items would go here */}
              <p className="text-sm text-gray-500">No hay actividad reciente para mostrar</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas de Conversión</h3>
            <div className="h-40 flex items-center justify-center">
              {/* Chart would go here */}
              <p className="text-sm text-gray-500">Gráfico de conversión</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
