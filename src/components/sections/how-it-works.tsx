import { Zap, Users, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/ui/container"

const steps = [
  {
    number: 1,
    title: "Realiza tu Solicitud",
    description:
      "Completa el formulario indicando el tipo de servicio que necesitas, tu ubicación y tu número de contacto.",
    icon: Zap,
  },
  {
    number: 2,
    title: "Conexión con un Profesional Cercano",
    description: "La plataforma selecciona al profesional más cercano y disponible para atender tu solicitud.",
    icon: Users,
  },
  {
    number: 3,
    title: "Recibe el Servicio que Necesitas",
    description: "El profesional llegará en el horario acordado y resolverá tus requerimientos de forma eficiente.",
    icon: CheckCircle,
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <Container className="text-center">
        <h2 className="text-3xl font-bold mb-16 text-gray-800">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="bg-gray-50 shadow-sm relative group hover:shadow-md transition-all duration-300"
            >
              <CardContent className="pt-12 pb-8 px-6 text-center">
                <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2">
                  <div className="w-16 h-16 rounded-full bg-[#0058A2] text-white flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                </div>
                <step.icon className="w-8 h-8 mx-auto mb-4 text-[#0058A2]" />
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-lg text-gray-600">
          ¡Con solo unos pocos pasos, tendrás el servicio que necesitas de manera rápida y sin complicaciones!
        </p>
      </Container>
    </section>
  )
}

