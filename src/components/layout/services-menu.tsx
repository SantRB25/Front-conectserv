"use client" // Asegurar que es un componente cliente

import { useState, useEffect } from "react"
import { api, type Service } from "@/lib/api"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ServicesMenu() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await api.services.list()
        setServices(response.data)
      } catch (error) {
        console.error("Error al cargar los servicios:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-sm font-medium hover:text-primary-color">
          Servicios
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {loading ? (
          <DropdownMenuItem disabled>Cargando...</DropdownMenuItem>
        ) : services.length > 0 ? (
          services.map((service) => (
            <DropdownMenuItem key={service.id}>
              <Link href={`/servicios/${service.id}`} className="w-full">
                {service.nombre}
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No hay servicios disponibles</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
