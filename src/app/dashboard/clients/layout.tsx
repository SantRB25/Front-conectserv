import type React from "react"

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Este layout no puede usar hooks directamente porque es un Server Component
  // Vamos a pasar el children directamente y manejar el acceso denegado en la página
  return <>{children}</>
}
