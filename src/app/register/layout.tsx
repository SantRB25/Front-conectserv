import type React from "react"

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
      <div className="w-full lg:w-2/5 p-6 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  )
}

