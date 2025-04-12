"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { api, type DashboardStatsResponse } from "@/lib/api"

export function useDashboardStats() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStatsResponse["data"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDashboardStats() {
      if (!session?.token) {
        setError("No hay sesión activa")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await api.admin.dashboard.getStats(session.token)

        if (response.success) {
          setStats(response.data)
          setError(null)
        } else {
          throw new Error(response.error || "La respuesta no fue exitosa")
        }
      } catch (err: any) {
        console.error("Error al obtener estadísticas del dashboard:", err)
        setError(err.message || "Error al cargar las estadísticas")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [session])

  return { stats, isLoading, error }
}

