import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Si el usuario no está autenticado y trata de acceder a rutas protegidas
  if (!session && pathname.startsWith("/dashboard")) {
    // Redirigir al login con el returnTo para volver después de iniciar sesión
    const url = new URL("/login", request.url)
    url.searchParams.set("returnTo", pathname)
    return NextResponse.redirect(url)
  }

  // Si el usuario está autenticado y trata de acceder a login o register, redirigir al dashboard
  if (session && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // En cualquier otro caso, permitir el acceso
  return NextResponse.next()
}

// Configurar las rutas que deben ser verificadas por el middleware
export const config = {
  matcher: [
    "/dashboard/:path*", // Proteger todas las rutas bajo /dashboard
    "/login", // Verificar login
    "/register", // Verificar register
  ],
}
