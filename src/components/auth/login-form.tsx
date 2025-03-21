"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Mail, Loader2, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Modificar la constante returnTo para que por defecto sea /dashboard
  const returnTo = searchParams.get("returnTo") || "/dashboard"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Mostrar error si viene en los parámetros de búsqueda
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(
        errorParam === "CredentialsSignin"
          ? "Credenciales inválidas. Por favor, verifica tu email y contraseña."
          : "Error al iniciar sesión. Por favor, intenta nuevamente.",
      )
    }
  }, [searchParams])

  // Y asegurar que la redirección después del login sea a dashboard
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        type: "email",
        id: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales inválidas. Por favor, verifica tu email y contraseña.")
      } else {
        // Redirigir al dashboard
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error("Error durante el inicio de sesión:", err)
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setIsLoading(false)
    }
  }

  // También modificar la función handleGoogleLogin
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
        <Alert variant="destructive">
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
        Continuar con Google
      </Button>

      <div className="relative flex items-center justify-center">
        <Separator className="flex-1" />
        <span className="px-3 text-xs text-muted-foreground">O</span>
        <Separator className="flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="tu@email.com" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-10" type="password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isLoading || isGoogleLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Iniciar Sesión
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link href="/register" className="text-primary hover:underline">
          ¿No tienes una cuenta? Regístrate
        </Link>
      </div>
    </>
  )
}

