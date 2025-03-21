import type React from "react"
import Script from "next/script"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import "./globals.css"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener la sesión del servidor
  const session = await auth()

  return (
    <html lang="es">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}

