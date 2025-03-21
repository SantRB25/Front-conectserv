"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b bg-background">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary-color">
            Logo
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary-color">
              Inicio
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:text-primary-color">
                  Servicios
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Electricistas</DropdownMenuItem>
                <DropdownMenuItem>Pintores</DropdownMenuItem>
                <DropdownMenuItem>Carpinteros</DropdownMenuItem>
                <DropdownMenuItem>Jardineros</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/solicitar" className="text-sm font-medium hover:text-primary-color">
              Solicitar Servicio
            </Link>
            <Link href="/acerca-de" className="text-sm font-medium hover:text-primary-color">
              Acerca de
            </Link>
            <Link href="/soporte" className="text-sm font-medium hover:text-primary-color">
              Soporte
            </Link>
            <Link href="/acceder" className="text-sm font-medium hover:text-primary-color">
              Acceder
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </Container>
      {isMenuOpen && (
        <div className="md:hidden">
          <Container>
            <nav className="py-4 flex flex-col gap-2">
              <Link href="/" className="text-sm font-medium hover:text-primary-color">
                Inicio
              </Link>
              <Link href="#" className="text-sm font-medium hover:text-primary-color">
                Servicios
              </Link>
              <Link href="/solicitar" className="text-sm font-medium hover:text-primary-color">
                Solicitar Servicio
              </Link>
              <Link href="/acerca-de" className="text-sm font-medium hover:text-primary-color">
                Acerca de
              </Link>
              <Link href="/soporte" className="text-sm font-medium hover:text-primary-color">
                Soporte
              </Link>
              <Link href="/acceder" className="text-sm font-medium hover:text-primary-color">
                Acceder
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}

