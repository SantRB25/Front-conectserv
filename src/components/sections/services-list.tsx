import {
  Snowflake,
  Wind,
  PenToolIcon as Tool,
  Hammer,
  Paintbrush,
  Building2,
  Droplets,
  Grid,
  PlugIcon as Pipeline,
  Flower2,
  Sofa,
  HomeIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Container } from "@/components/ui/container"

const services = [
  { nombre: "Refrigeracion", icon: Snowflake },
  { nombre: "Aire acondicionado", icon: Wind },
  { nombre: "Electricidad", icon: Tool },
  { nombre: "Carpinteria", icon: Hammer },
  { nombre: "Pintura", icon: Paintbrush },
  { nombre: "Albañileria general", icon: Building2 },
  { nombre: "Limpieza de piscinas", icon: Droplets },
  { nombre: "Colocacion de pisos", icon: Grid },
  { nombre: "Plomeria", icon: Pipeline },
  { nombre: "Jardineria y limpieza", icon: Flower2 },
  { nombre: "Muebles sobre medida", icon: Sofa },
  { nombre: "Remodelaciones y fachada", icon: HomeIcon },
]

export function ServicesList() {
  return (
    <section className="py-20">
      <Container className="text-center">
        <h2 className="text-3xl font-bold mb-16">Lista de servicios</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.nombre} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium">{service.nombre}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

