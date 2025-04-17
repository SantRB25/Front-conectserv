"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Service } from "@/lib/api"

interface MultiSelectProps {
  control: any
  services: Service[]
  isLoading?: boolean
}

export function MultiSelectServicios({ control, services, isLoading }: MultiSelectProps) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      control={control}
      name="services"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Servicios que ofreces</FormLabel>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {field.value && field.value.length > 0
                  ? `${field.value.length} seleccionados`
                  : "Selecciona hasta 3 servicios"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Buscar servicio..." />
                <CommandList>
                  <ScrollArea className="h-40">
                    {services.map((service) => (
                      <CommandItem
                        key={service.id}
                        value={service.nombre}
                        onSelect={() => {
                          let newValue = field.value || []
                          const exists = newValue.includes(service.id)

                          if (exists) {
                            newValue = newValue.filter((v: number) => v !== service.id)
                          } else if (newValue.length < 3) {
                            newValue = [...newValue, service.id]
                          }

                          field.onChange(newValue)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.includes(service.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {service.nombre}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="mt-2 flex flex-wrap gap-2">
            {field.value?.map((id: number) => {
              const s = services.find((srv) => srv.id === id)
              return (
                <Badge key={id} variant="outline">
                  {s?.nombre}
                </Badge>
              )
            })}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
