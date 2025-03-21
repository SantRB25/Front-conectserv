import Link from "next/link"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SolicitudSuccessPage() {
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
              <div className="bg-white h-2 rounded-full w-full"></div>
            </div>
            <p className="text-sm mt-1">100% completado</p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-[400px] w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold">Solicitud de Servicios</h1>
          <p className="text-gray-700">
            Su solicitud ha sido registrada, un profesional más cercano se estará comunicando contigo en la brevedad
            posible, allí podrás comunicarse directamente y agendar el servicio
          </p>
          <p className="text-lg font-semibold">Muchas gracias por utilizar ConectServ!</p>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full bg-[#0058A2] hover:bg-blue-800">Volver al inicio</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

