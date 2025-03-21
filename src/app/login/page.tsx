import { Suspense } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import LoginForm from "@/components/auth/login-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function LoginPage() {
  // Verificar si el usuario ya está autenticado
  const session = await auth()

  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div className="p-4 text-center">Cargando...</div>}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

