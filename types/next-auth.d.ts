import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extender la sesión de usuario para incluir el ID, token y tipo_usuario
   */
  interface Session {
    token?: string
    user: {
      id?: string
      role?: string
      tipo_usuario?: string
    } & DefaultSession["user"]
  }

  /**
   * Extender el token JWT
   */
  interface JWT {
    token?: string
    role?: string
    tipo_usuario?: string
  }

  /**
   * Extender el usuario para incluir el token y tipo_usuario
   */
  interface User {
    token?: string
    role?: string
    tipo_usuario?: string
  }
}
