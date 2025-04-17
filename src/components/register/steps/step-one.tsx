"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterStore } from "@/store/register-store";
import { LocationPicker } from "@/components/ui/location-picker";
import { useEffect, useState } from "react";
import { api, type Service } from "@/lib/api";
import { Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MultiSelectServicios } from "@/components/ui/MultiSelectServicios";

// Esquema de validación actualizado para incluir email
const formSchema = z.object({
  /*service: z.string().min(1, {
    message: "Debes seleccionar un servicio.",
  }),*/
  services: z
    .array(z.number())
    .min(1, "Selecciona al menos un servicio")
    .max(3, "Puedes seleccionar hasta 3 servicios"),
  zone: z.string().min(2, {
    message: "La zona debe tener al menos 2 caracteres.",
  }),
  lat: z.number(),
  lng: z.number(),
  email: z
    .string()
    .email({
      message: "Por favor, ingresa un correo electrónico válido.",
    })
    .optional()
    .or(z.literal("")),
});

export function StepOne() {
  const { setStep, setFormData, formData } = useRegisterStore();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const registrationType = formData.registrationType;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: formData.services || [],
      zone: formData.zone || "",
      lat: formData.lat || 0,
      lng: formData.lng || 0,
      email: formData.email || "",
    },
  });

  useEffect(() => {
    async function fetchServices() {
      try {
        setIsLoading(true);
        const response = await api.services.list();
        setServices(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching services:", err);
        setError(
          "No se pudieron cargar los servicios. Por favor, intente nuevamente."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Asegurarse de que el email se incluya en formData

    setFormData({
      ...values,
      email: values.email || formData.email, // Mantener el email existente si no se proporciona uno nuevo
    });
    setStep(2);
  }

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    form.setValue("zone", location.address);
    form.setValue("lat", location.lat);
    form.setValue("lng", location.lng);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="my-7">
          <MultiSelectServicios
            control={form.control}
            services={services} // array con los servicios
            isLoading={isLoading}
          />
        </div>

        <div className="my-7">
          <FormField
            control={form.control}
            name="zone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="¿En qué zona trabajas?"
                      {...field}
                      readOnly
                    />
                    <LocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Campo de email para registro por email (no mostrar si ya se registró con Google o Facebook) */}
          {registrationType === "email" && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10"
                        placeholder="tu@email.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-between gap-4 my-7">
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            Atrás
          </Button>
          <Button type="submit">Continuar</Button>
        </div>
      </form>
    </Form>
  );
}
