"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useRegisterStore } from "@/store/register-store"
import { useState } from "react"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { signIn } from "@/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

const formSchema = z.object({
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export function StepFour() {
  const { setStep, setFormData, formData } = useRegisterStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: formData.password || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Guardar la contraseña en el estado del formulario
      setFormData(values)

      const allFormData = {
        ...formData,
        ...values,
      }


      // 1. Registrar al usuario en la API
      const response = await api.professional.register(allFormData)

      if (!response.success) {
        throw new Error(response.message || "Error en el registro")
      }

      router.push("/register/success")
/*
      // 2. Determinar las credenciales para iniciar sesión según el método de registro
      let credentials: Record<string, string> = {}

      switch (allFormData.registrationType) {
        case "google":
          if (!allFormData.google_id) {
            throw new Error("No se encontró el ID de Google para iniciar sesión")
          }
          credentials = {
            type: "google_id",
            id: allFormData.google_id,
            password: allFormData.password,
          }
          break

        case "facebook":
          if (!allFormData.facebook_id) {
            throw new Error("No se encontró el ID de Facebook para iniciar sesión")
          }
          credentials = {
            type: "facebook_id",
            id: allFormData.facebook_id,
            password: allFormData.password,
          }
          break

        default:
          if (!allFormData.email) {
            throw new Error("No se encontró un email válido para iniciar sesión")
          }
          credentials = {
            type: "email",
            id: allFormData.email,
            password: allFormData.password,
          }
      }

      // 3. Iniciar sesión con NextAuth
      const signInResult = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error || "Error al iniciar sesión")
      }

      // 4. Redirigir al dashboard
      router.push("/dashboard")*/
    } catch (error: any) {
      console.error("Error en el proceso:", error)
      setError(error.message || "Ocurrió un error durante el registro")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" {...field} placeholder="Contraseña" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4">
          <Button type="button" variant="outline" onClick={() => setStep(3)} disabled={isLoading}>
            Atrás
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : (
              "Finalizar registro"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

