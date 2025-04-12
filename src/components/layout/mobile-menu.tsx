"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X /> : <Menu />}
      </Button>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-background border-b">
          <Container>
            <nav className="py-4 flex flex-col gap-2">
              <Link
                href="/"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/solicitar"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Solicitar Servicio
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Soporte
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary-color"
                onClick={() => setIsMenuOpen(false)}
              >
                Acceder
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </div>
  )
}

