import { Suspense } from "react"
import { redirect } from "next/navigation"
import Image from "next/image"
import { auth } from "@/auth"
import LoginForm from "@/components/auth/login-form"

export default async function LoginPage() {
  // Verificar si el usuario ya está autenticado
  const session = await auth()

  // Si ya está autenticado, redirigir al dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna de imagen - Oculta en móvil, visible en md y superior */}
      <div className="hidden md:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/70 z-10"></div>
        <Image
          src="/placeholder.jpg"
          alt="Profesionales conectando servicios"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">ConectServ</h1>
          <p className="text-xl max-w-md text-center">
            Conectamos profesionales con clientes que necesitan sus servicios
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Más clientes</h3>
              <p className="text-sm text-white/80">Expande tu negocio con nuevos clientes cada día</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Más ingresos</h3>
              <p className="text-sm text-white/80">Aumenta tus ingresos con trabajos bien remunerados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna del formulario */}
      <div className="w-full md:w-[45rem] flex items-center justify-center p-6 md:p-12">
        <div className="w-full md:max-w-[20rem] border-none">
        <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h2>
              <p className="text-gray-500">Ingresa a tu cuenta de profesional</p>
            </div>

            <Suspense
              fallback={
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
        </div>
      </div>
    </div>
  )
}

