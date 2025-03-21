import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export function Footer() {
  return (
    <footer className="bg-dark text-white">
      <Container className="py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sobre Nosotros</h3>
            <p className="text-sm text-gray-300">
              Conectamos profesionales verificados con personas que necesitan servicios confiables para el hogar y
              empresas.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Electricidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Plomería
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Carpintería
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white">
                  Ver todos
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Soporte</h3>
            <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white">Soporte Whatsapp</Button>
            <div className="text-sm text-gray-300">
              <p>¿Necesitas ayuda?</p>
              <p>Contáctanos: support@conectserv.com</p>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2024 ConectServ. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Políticas de Privacidad
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Términos de Servicio
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

