"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useVerifyImages } from "@/hooks/use-verify-images"

export function ProfileAlert() {
  const { isVerified, message, isLoading } = useVerifyImages()

  // No mostrar nada mientras está cargando o si está verificado
  if (isLoading || isVerified) {
    return null
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Información de perfil incompleta</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
            <p className="mt-1">Por favor, complete su información para poder acceder a todas las funcionalidades.</p>
          </div>
          <div className="mt-4">
            <Link href="/dashboard/informacion">
              <Button size="sm" variant="outline" className="bg-white text-red-700 border-red-300 hover:bg-red-50">
                Completar información
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
