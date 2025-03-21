"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useRegisterStore } from "@/store/register-store"
import { RegisterForm } from "@/components/register/register-form"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterClient() {
  const { setFormData, setStep } = useRegisterStore()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificar si hay un mensaje de error o información
  const message = searchParams.get("message")

  // Si el mensaje es "user-exists", mostrar un mensaje y un botón para ir a login
  if (message === "user-exists") {
    return (
      <div className="py-16">
        <div className="container max-w-2xl mx-auto px-4 text-center">
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Ya tienes una cuenta registrada con este correo electrónico.</AlertDescription>
          </Alert>
          <div className="flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-semibold">Ya tienes una cuenta</h2>
            <Button onClick={() => router.push("/login")}>Ir a Iniciar Sesión</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 lg:py-16">
      <div className="container max-w-2xl mx-auto px-4">
        <RegisterForm />
      </div>
    </div>
  )
}

