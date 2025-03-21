"use client"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Link } from "@/components/ui/link"

export function CallToAction() {
  return (
    <section className="py-16 bg-[#FF6B0B] text-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">
            Encuentra a los Mejores Profesionales para tu Hogar, institución o empresa. ¡Rápido y Sin Complicaciones!
          </h2>
          <p className="text-lg text-white/80">
            ¿Necesitas ayuda para resolver problemas en tu hogar? Con ConectServ, conectar con profesionales verificados
            es fácil y seguro. Olvídate de la búsqueda interminable y de la incertidumbre; en solo unos pasos,
            encontrarás a un profesional confiable, listo para solucionar tus necesidades de mantenimiento, reparación y
            más.
          </p>
          <p className="text-xl font-medium">
            Conecta en minutos, recibe atención confiable y olvídate de las preocupaciones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <p className="text-lg font-medium">
              ¿Eres un profesional? Regístrate y comienza a conectar con personas que buscan tus servicios
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#FF6B0B] hover:bg-white/90">
                Regístrate
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

