"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { StepOne } from "./step-one"
import { StepTwo } from "./step-two"

// Esquema de validación para el paso 1
const stepOneSchema = z.object({
  servicio_id: z.string().min(1, {
    message: "Debes seleccionar un servicio.",
  }),
  descripcion: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
})

// Esquema de validación para el paso 2
const stepTwoSchema = z.object({
  ubicacion_texto: z.string().min(5, {
    message: "La ubicación debe tener al menos 5 caracteres.",
  }),
  latitud: z.number(),
  longitud: z.number(),
  whatsapp: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message: "Formato inválido. Debe incluir código de país (ej: +51993187237)",
  }),
  isWhatsappVerified: z.boolean().refine((val) => val === true, {
    message: "Debes verificar tu número de WhatsApp.",
  }),
})

// Esquema completo
const formSchema = stepOneSchema.merge(stepTwoSchema)

// Tipo para los datos del formulario
type FormData = z.infer<typeof formSchema>

export function SolicitarForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Inicializar el formulario
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      servicio_id: "",
      descripcion: "",
      ubicacion_texto: "",
      latitud: 0,
      longitud: 0,
      whatsapp: "",
      isWhatsappVerified: false,
    },
    mode: "onChange",
  })

  // Función para avanzar al siguiente paso
  const nextStep = async () => {
    // Validar el paso actual
    if (step === 1) {
      const isValid = await form.trigger(["servicio_id", "descripcion"])
      if (isValid) {
        setStep(2)
      }
    }
  }

  // Función para volver al paso anterior
  const prevStep = () => {
    setStep(1)
  }

  // Función para enviar el formulario
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Preparar los datos para enviar a la API
      const requestData = {
        servicio_id: data.servicio_id,
        ubicacion_texto: data.ubicacion_texto,
        latitud: data.latitud,
        longitud: data.longitud,
        descripcion: data.descripcion,
        whatsapp: data.whatsapp,
      }

      // Enviar la solicitud a la API
      const response = await api.solicitudes.create(requestData)

      if (response.success) {
        // Redirigir a la página de éxito
        router.push("/solicitar/success")
      } else {
        // Mostrar mensaje de error
        toast({
          variant: "destructive",
          title: "Error al enviar la solicitud",
          description: response.message || "Por favor, intenta nuevamente.",
        })

        // Si hay errores de validación, mostrarlos en el formulario
        if (response.errors) {
          Object.entries(response.errors).forEach(([field, errors]) => {
            if (field in form.formState.errors) {
              form.setError(field as any, {
                type: "manual",
                message: errors[0],
              })
            }
          })
        }
      }
    } catch (error: any) {
      console.error("Error al enviar solicitud:", error)
      toast({
        variant: "destructive",
        title: "Error al enviar la solicitud",
        description: "Ha ocurrido un error. Por favor, intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener el título de la pregunta según el paso actual
  const getStepTitle = () => {
    if (step === 1) {
      return "¿Qué tipo de servicio necesitas?"
    } else {
      return "¿Para qué zona necesitas el servicio?"
    }
  }

  // Verificar si el WhatsApp está verificado
  const isWhatsappVerified = form.watch("isWhatsappVerified")

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">{getStepTitle()}</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && <StepOne form={form} />}
          {step === 2 && <StepTwo form={form} />}

          <div className="flex justify-between pt-6 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={step === 1 ? () => router.push("/") : prevStep}
              className="flex-1"
            >
              Volver
            </Button>

            {step === 1 ? (
              <Button type="button" onClick={nextStep} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting || !isWhatsappVerified}
                className={`flex-1 ${!isWhatsappVerified ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} text-white`}
              >
                {isSubmitting ? "Enviando..." : "Siguiente"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}

