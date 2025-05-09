import { api, Service } from "@/lib/api"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServicioPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServicioPage({ params }: ServicioPageProps) {
  // Obtener el servicio específico
  let service: Service | undefined = undefined
  
  // Usar `await` para resolver `params`
  const { id } = await params;

  try {
    // Aquí deberíamos tener un endpoint para obtener un servicio por ID
    // Como no lo tenemos, vamos a obtener todos y filtrar
    const response = await api.services.list()
    service = response.data.find((s) => s.id.toString() === id)
  } catch (error) {
    console.error("Error al cargar el servicio:", error)
  }

  // Si no se encuentra el servicio, mostrar 404
  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{service.nombre}</h1>

        <p className="text-lg mb-8">
          Conectamos a los mejores profesionales de {service.nombre?.toLowerCase()} con clientes que necesitan servicios de
          calidad.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">¿Necesitas un servicio de {service.nombre.toLowerCase()}?</h2>
          <p className="mb-4">
            Nuestros profesionales verificados están listos para ayudarte con cualquier proyecto o reparación.
          </p>
          <Link href={`/solicitar?service=${service.id}`}>
            <Button className="mt-2">Solicitar este servicio</Button>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/servicios" className="text-primary hover:underline">
            ← Ver todos los servicios
          </Link>
        </div>
      </div>
    </div>
  )
}
