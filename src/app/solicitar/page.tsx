import { Suspense } from "react"
import { SolicitarForm } from "@/components/solicitar/solicitar-form"
import { Toaster } from "@/components/ui/toaster"
import { X } from "lucide-react"
import Link from "next/link"

export default function SolicitarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header azul */}
      <header className="bg-[#0058A2] text-white py-6 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold">Encuentra expertos cerca de ti</h1>
          <p className="mt-2">Conecta con los mejores profesionales de tu zona, sin compromiso</p>

          {/* Botón de cerrar */}
          <Link href="/" className="absolute right-4 top-4 text-white hover:text-white/80">
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </Link>

          {/* Barra de progreso */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="bg-white/30 h-2 rounded-full w-full">
              <div className="bg-white h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
            <p className="text-sm mt-1">50% completado</p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <Suspense fallback={<div className="text-center">Cargando...</div>}>
            <SolicitarForm />
          </Suspense>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

