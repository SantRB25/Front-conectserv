import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { api } from "@/lib/api"

export const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        type: { label: "Type", type: "text" },
        id: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.type || !credentials?.id) {
          return null
        }

        try {
          // Llamar a la API para autenticar al usuario
          const response = await api.professional.login(
            credentials.type as string,
            credentials.id as string,
            (credentials.password as string) || "",
          )

          if (!response.success || !response.data) {
            throw new Error(response.message || "Credenciales inválidas")
          }

          // Devolver el usuario con el token para que NextAuth lo guarde en la sesión
          return {
            id: response.data.id.toString(),
            name: `${response.data.nombre} ${response.data.apellido}`,
            email: response.data.email || "",
            image: response.data.imagen || null,
            token: response.token,
            role: response.data.tipo_usuario
          }
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    // Modificar la sesión para incluir el ID y token
    async session({ session, token }) {
      if (session.user) {
        // Verificar que token.sub existe antes de asignarlo
        if (token.sub) {
          session.user.id = token.sub
        }

        // Añadir el token a la sesión si existe
        if (token.token) {
          session.token = token.token as string
        }
      }
      return session
    },
    // Asegurarse de que el token incluya el sub y el token de autenticación
    async jwt({ token, user, account, profile }) {
      // Cuando el usuario se autentica inicialmente
      if (user) {
        token.sub = user.id
        // Si el usuario tiene un token (de credentials provider), guardarlo
        if ("token" in user && user.token) {
          token.token = user.token
        }
      }

      // Si es autenticación con Google, validar directamente con nuestra API de login
      if (account?.provider === "google" && profile?.sub) {
        try {

          // Llamar directamente a login sin verificación previa
          const loginResponse = await api.professional.login("google", profile.sub, "")


          if (loginResponse.success && loginResponse.data) {
            // Si el login es exitoso, actualizar el token con la información del usuario
            token.sub = loginResponse.data.id.toString()
            token.token = loginResponse.token

          } else {
            return null as any
          }
        } catch (error) {
          console.error("Error al autenticar con Google:", error)
          return null as any
        }
      }

      return token
    },
    // Verificar si se debe permitir el inicio de sesión
    async signIn({ account, profile }) {
      // Para Google, intentar iniciar sesión directamente
      if (account?.provider === "google" && profile?.sub) {
        try {
          // No hacemos verificación previa, permitimos que el callback jwt maneje la autenticación
          return true
        } catch (error) {
          console.error("Error en signIn con Google:", error)
          return false
        }
      }

      // Para otros proveedores, permitir el inicio de sesión
      return true
    },
    // Personalizar la página de error
    async redirect({ url, baseUrl }) {
      // Si la URL es una página de error, añadir información de depuración
      if (url.startsWith(`${baseUrl}/login?error=`)) {
        return url
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
} satisfies NextAuthConfig

export const { handlers, signIn, signOut, auth } = NextAuth(config)

