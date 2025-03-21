// Crear un archivo de declaración de tipos para extender la sesión de NextAuth

import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extender la sesión de usuario para incluir el ID
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

