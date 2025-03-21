import { auth } from "@/auth"
import { redirect } from "next/navigation"
import RegisterClient from "./register-client"

export default async function RegisterPage() {
  // Obtener sesión desde NextAuth
  const session = await auth()

  // Si el usuario ya está autenticado, redirigir al dashboard
  if (session) {
    redirect("/dashboard")
  }

  // Si no hay sesión, mostrar el formulario de registro
  return <RegisterClient />
}

