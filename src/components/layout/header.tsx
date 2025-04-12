import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import Link from "next/link"
import { ServicesMenu } from "./services-menu"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-color">
            <img src="/logo.svg" className="h-7" alt="Logo" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary-color">
              Inicio
            </Link>

            {/* Menú de servicios con Suspense para carga asíncrona */}
            <Suspense
              fallback={
                <Button variant="ghost" className="text-sm font-medium hover:text-primary-color">
                  Servicios...
                </Button>
              }
            >
              <ServicesMenu />
            </Suspense>

            <Link href="/solicitar" className="text-sm font-medium hover:text-primary-color">
              Solicitar Servicio
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary-color">
              Acerca de
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-primary-color">
              Soporte
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary-color">
              Acceder
            </Link>
          </nav>

          {/* Menú móvil como componente cliente separado */}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

