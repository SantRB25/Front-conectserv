"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { api } from "@/lib/api"

export function useVerifyImages() {
  const { data: session } = useSession()
  const [isVerified, setIsVerified] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkImages() {
      if (!session?.user?.id || session?.user?.tipo_usuario === "administrador") {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await api.professional.verifyImages(session.user.id)

        setIsVerified(response.success)
        setMessage(response.message)
      } catch (error) {
        console.error("Error al verificar imágenes:", error)
        setIsVerified(false)
        setMessage("Error al verificar la información del perfil")
      } finally {
        setIsLoading(false)
      }
    }

    checkImages()
  }, [session])

  return { isVerified, message, isLoading }
}
