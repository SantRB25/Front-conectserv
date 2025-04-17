"use client"

import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, ListFilter, MessageSquare } from "lucide-react"
import { api, type Service } from "@/lib/api"

interface StepOneProps {
  form: UseFormReturn<any>
}

export function StepOne({ form }: StepOneProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true)
        const response = await api.services.list()
        setServices(response.data)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching services:", err)
        setError("No se pudieron cargar los servicios. Por favor, intente nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="servicio_id"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Cargando servicios...</span>
                      </div>
                    ) : services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.nombre}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-gray-500">No hay servicios disponibles</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="descripcion"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">Describe brevemente lo que necesitas</FormLabel>
            <FormControl>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Textarea
                  placeholder="Ej: Necesito reparar mi aire acondicionado que no enfría correctamente"
                  {...field}
                  className="min-h-[120px] text-[18px] font-medium border-[#2b2d2e] pl-10"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

