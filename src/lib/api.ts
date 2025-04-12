import { API_BASE_URL } from "@/config/constants"

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: isFormData
        ? options.headers // no forzar Content-Type
        : {
          "Content-Type": "application/json",
          ...options.headers,
        },
    })

    const responseText = await response.text()

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error("La respuesta del servidor no es un JSON válido. Ver consola para detalles.")
    }

    if (!response.ok) {
      console.error("Error API:", data)
      throw data
    }

    return data as T
  } catch (error) {
    throw error
  }
}


interface ApiResponse<T> {
  data: T[]
}

export interface Service {
  id: number
  name: string
}

export interface RegisterResponse {
  success: boolean
  message: string
}
export interface DeleteResponse {
  success: boolean
  message: string
}

export interface LoginResponse {
  success: boolean
  message: string
  token?: string
  data?: {
    id: number
    nombre: string
    apellido: string
    email: string
    imagen?: string
    tipo_usuario?: string
  }
}

export interface GoogleVerifyResponse {
  success: boolean
  exists: boolean
  user?: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
}

export interface FacebookVerifyResponse {
  success: boolean
  exists: boolean
  user?: {
    id: number
    nombre: string
    apellido: string
    email: string
  }
}

export interface SolicitudResponse {
  success: boolean
  message: string
  data?: any
  errors?: Record<string, string[]>
}

// Agregar la interfaz para las estadísticas del dashboard después de las interfaces existentes
export interface DashboardStatsResponse {
  success: boolean
  data: {
    profesionales_registrados: number
    verificacion_pendiente: number
    profesionales_activos: number
  }
  error?: string
}

// Añadir esta interfaz para la respuesta de verificación de imágenes
export interface VerifyImagesResponse {
  success: boolean
  message: string
}

export interface getDocumentsResponse {
  success: boolean
  message: string
  data: {
    imagen_identidad_frontal: string | null
    imagen_identidad_dorso: string | null
    imagen_real: string | null
  }
  errors?: string | object
  error?: string
}
// Agregar el objeto admin dentro del objeto api
export const api = {


  services: {
    list: () => fetchApi<ApiResponse<Service>>("/services"),
  },
  verification: {
    sendCode: (phoneNumber: string, type?: string) =>
      fetchApi<{ success: boolean; message?: string; error?: string; details?: any }>(`/verify/whatsapp`, {
        method: "POST",
        body: JSON.stringify({ numero: phoneNumber, type: type }),
      }),
    checkCode: (phoneNumber: string, code: string) =>
      fetchApi<{ success: boolean; message?: string; error?: string }>("/verify/check", {
        method: "POST",
        body: JSON.stringify({ numero: phoneNumber, codigo: code }),
      }),
    verifyGoogleId: async (googleId: string) => {
      try {
        const response = await fetchApi<GoogleVerifyResponse>(`/verificar-google/${googleId}`)
        return response
      } catch (error) {
        console.error("API: Error al verificar Google ID:", error)
        throw error
      }
    },
    verifyFacebookId: (facebookId: string) => fetchApi<FacebookVerifyResponse>(`/verify_facebook/${facebookId}`),
  },
  professional: {
    uploadDocs: (formData: FormData) =>
      fetch(`${API_BASE_URL}/profesional/subir-documentos`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          if (!res.ok) throw data
          return data as RegisterResponse
        } catch (e) {
          console.error("Respuesta no JSON:", text)
          throw new Error("Respuesta del servidor inválida.")
        }
      }),
    deleteDocument: (user_id: string, documento: string) =>
      fetchApi<DeleteResponse>("/profesional/delete-document", {
        method: "POST",
        body: JSON.stringify({
          user_id: user_id,
          documento: documento
        }),
      }),
    register: (data: any) =>
      fetchApi<RegisterResponse>("/profesionales", {
        method: "POST",
        body: JSON.stringify({
          servicio_id: data.service,
          ubicacion_texto: data.zone,
          latitud: data.lat,
          longitud: data.lng,
          nombre: data.names,
          apellido: data.lastNames,
          edad: data.age,
          whatsapp: data.whatsapp,
          clave: data.password,
          google_id: data.google_id,
          facebook_id: data.facebook_id,
          email: data.email,
        }),
      }),
    login: async (type: string, id: string, password: string) => {
      try {
        const response = await fetchApi<LoginResponse>("/login", {
          method: "POST",
          body: JSON.stringify({
            medio: type,
            id: id,
            // No se envía la clave según la imagen
          }),
        })
        return response
      } catch (error) {
        console.error("API: Error en login:", error)
        throw error
      }
    },
    verifyImages: (id: number | string) => fetchApi<VerifyImagesResponse>(`/profesionales/${id}/verificar-imagenes`),
    getDocuments: (id: number | string) => fetchApi<getDocumentsResponse>(`/profesional/${id}/obtener-documentos`),
  },
  solicitudes: {
    create: (data: {
      servicio_id: string
      ubicacion_texto: string
      latitud: number
      longitud: number
      descripcion: string
      whatsapp: string
    }) =>
      fetchApi<SolicitudResponse>("/solicitudes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  admin: {
    dashboard: {
      getStats: (token: string) =>
        fetchApi<DashboardStatsResponse>("/admin/dashboard/stats", {
          headers: {
            Authorization: token,
          },
        }),
    },
  },
}
