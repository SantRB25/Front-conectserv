import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extender la sesión de usuario para incluir el ID y token
   */
  interface Session {
    token?: string
    user: {
      id?: string
    } & DefaultSession["user"]
  }

  /**
   * Extender el token JWT
   */
  interface JWT {
    token?: string
  }

  /**
   * Extender el usuario para incluir el token
   */
  interface User {
    token?: string
  }
}

