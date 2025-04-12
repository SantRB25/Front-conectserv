import type React from "react"
import Link from "next/link"

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row mx-auto">
      {/* Sección Izquierda - Imagen */}
      <div className="hidden lg:block lg:w-3/5 flex-1">
        <img src="/profesionales.jpg" alt="Registro" className="w-full h-full object-cover" />
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full lg:w-2/5 p-6 lg:p-16 flex flex-col">
        {/* Botón para volver al home */}
        <div className="self-start mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-color hover:text-primary-color/80 transition-colors"
          >
            <img src="/logo.svg" className="h-7" alt="Logo" />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}

