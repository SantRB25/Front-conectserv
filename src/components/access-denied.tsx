import { AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="bg-red-100 rounded-full h-24 w-24"></div>
        </div>
        <div className="relative z-10 bg-red-50 p-5 rounded-full border-2 border-red-200">
          <Lock className="h-14 w-14 text-red-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Acceso Denegado</h1>

      <div className="max-w-md mx-auto mb-8">
        <p className="text-gray-600 mb-4">
          No tienes permisos para acceder a esta sección. Esta área está reservada para usuarios con roles específicos.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>Si crees que deberías tener acceso a esta sección, por favor contacta al administrador del sistema.</p>
          </div>
        </div>
      </div>

      <Link href="/dashboard">
        <Button className="px-6">Volver al Dashboard</Button>
      </Link>
    </div>
  )
}
