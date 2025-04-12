"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, Phone, KeyRound } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { api } from "@/lib/api"

// Esquema para el formulario de WhatsApp
const whatsappFormSchema = z.object({
  whatsapp: z.string().min(9, {
    message: "El número de WhatsApp debe tener al menos 9 dígitos.",
  }),
})

// Esquema para el formulario de verificación de código
const codeFormSchema = z.object({
  code: z.string().length(6, {
    message: "El código debe tener 6 dígitos.",
  }),
})

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"phone" | "code">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Modificar la constante returnTo para que por defecto sea /dashboard
  const returnTo = searchParams.get("returnTo") || "/dashboard"

  // Formulario para WhatsApp
  const whatsappForm = useForm<z.infer<typeof whatsappFormSchema>>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: {
      whatsapp: "",
    },
  })

  // Formulario para código de verificación
  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: {
      code: "",
    },
  })

  // Mostrar error si viene en los parámetros de búsqueda
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin"
          ? "Credenciales inválidas. Por favor, verifica tu información."
          : "Error al iniciar sesión. Por favor, intenta nuevamente.",
      )
    }
  }, [searchParams])

  // Función para enviar código de verificación
  async function onSubmitWhatsapp(values: z.infer<typeof whatsappFormSchema>) {
    setIsLoading(true)
    setError(null)
    setPhoneNumber(values.whatsapp)

    try {
      // Llamar a la API para enviar el código de verificación
      const response = await api.verification.sendCode(values.whatsapp,'login')

      if (response.success) {
        setStep("code")
        codeForm.reset({ code: "" })
      } else {
        setError(response.details || "Error al enviar el código. Verifica tu número e intenta nuevamente.")
      }
    } catch (err: any) {
      setError(err.details || "Error al enviar el código. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para verificar el código
  async function onSubmitCode(values: z.infer<typeof codeFormSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      // Verificar el código
      const checkResponse = await api.verification.checkCode(phoneNumber, values.code)
      if (checkResponse.success) {
        // Si el código es correcto, iniciar sesión
        const result = await signIn("credentials", {
          type: "whatsapp",
          id: phoneNumber,
          redirect: false,
        })
        
        if (result?.error) {
          setError("Error al iniciar sesión. Por favor, intenta nuevamente.")
        } else {
          // Redirigir al dashboard
          router.push("/dashboard")
        }
      } else {
        setError("Código incorrecto. Por favor, verifica e intenta nuevamente.")
      }
    } catch (err: any) {
      console.error("Error al verificar código:", err)
      setError(err.message || "Error al verificar el código. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para manejar el login con Google
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      await signIn("google", {
        redirect: false,
      }).then((result) => {
        if (result?.error) {
          setError(`Error al iniciar sesión con Google: ${result.error}`)
          setIsGoogleLoading(false)
        } else if (result?.ok) {
          router.push("/dashboard")
        }
      })
    } catch (err: any) {
      console.error("Error en el inicio de sesión con Google:", err)
      setError(`Error al iniciar sesión con Google: ${err.message || "Error desconocido"}`)
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        variant="outline"
        className="w-full h-12"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
        )}
        Ingresar con Google
      </Button>

      <div className="relative flex items-center justify-center my-4">
        <Separator className="flex-1" />
        <span className="px-3 text-xs text-muted-foreground">o</span>
        <Separator className="flex-1" />
      </div>

      {step === "phone" ? (
        <Form {...whatsappForm}>
          <form onSubmit={whatsappForm.handleSubmit(onSubmitWhatsapp)} className="space-y-4">
            <FormField
              control={whatsappForm.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de WhatsApp</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="Ingresa tu número de WhatsApp" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Ingresar con WhatsApp
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-4">
          <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">Hemos enviado un código de verificación al número</p>
              <p className="font-medium">{phoneNumber}</p>
            </div>

            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de verificación</FormLabel>
                  <FormControl>
                  <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10 text-center tracking-widest font-mono text-lg"
                        placeholder="000000"
                        maxLength={6}
                        {...field}
                      />
                    </div>                  
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col space-y-2">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Verificar código
              </Button>
              <Button
                variant="ghost"
                type="button"
                className="text-sm"
                onClick={() => setStep("phone")}
                disabled={isLoading}
              >
                Cambiar número
              </Button>
            </div>
          </form>
        </Form>
      )}

      <div className="text-center text-sm mt-6">
        <Link href="/register" className="text-primary hover:underline">
          ¿Aún no tienes una cuenta? Regístrate
        </Link>
      </div>
    </>
  )
}

