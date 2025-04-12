import { api, type Service } from "@/lib/api"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default async function ServiciosPage() {
  // Obtener la lista de servicios desde la API
  let services: Service[] = []
  try {
    const response = await api.services.list()
    services = response.data
  } catch (error) {
    console.error("Error al cargar los servicios:", error)
    services = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nuestros Servicios</h1>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <Link key={service.id} href={`/servicios/${service.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h2 className="font-medium">{service.name}</h2>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">No hay servicios disponibles en este momento.</p>
      )}
    </div>
  )
}

