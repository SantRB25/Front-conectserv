import { API_BASE_URL } from "@/config/constants"

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    // Primero obtenemos el texto de la respuesta
    const responseText = await response.text()

    // Intentamos parsear como JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.log("Respuesta no-JSON recibida:")
      console.log(responseText)
      throw new Error("La respuesta del servidor no es un JSON válido. Ver consola para detalles.")
    }

    // Si la respuesta no es exitosa, lanzamos un error con los detalles
    if (!response.ok) {
      console.error("Error API:", data)
      throw new Error(data.error || data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data as T
  } catch (error) {
    console.error("Error en fetchApi:", error)
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
  token?: string
  data?: any
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

export const api = {
  services: {
    list: () => fetchApi<ApiResponse<Service>>("/services"),
  },
  verification: {
    sendCode: (phoneNumber: string) =>
      fetchApi<{ success: boolean; message?: string; error?: string; details?: any }>(`/verify/whatsapp`, {
        method: "POST",
        body: JSON.stringify({ numero: phoneNumber }),
      }),
    checkCode: (phoneNumber: string, code: string) =>
      fetchApi<{ success: boolean; message?: string; error?: string }>("/verify/check", {
        method: "POST",
        body: JSON.stringify({ numero: phoneNumber, codigo: code }),
      }),
    verifyGoogleId: async (googleId: string) => {
      console.log("API: Verificando Google ID:", googleId)
      try {
        const response = await fetchApi<GoogleVerifyResponse>(`/verificar-google/${googleId}`)
        console.log("API: Respuesta de verificación:", response)
        return response
      } catch (error) {
        console.error("API: Error al verificar Google ID:", error)
        throw error
      }
    },
    verifyFacebookId: (facebookId: string) => fetchApi<FacebookVerifyResponse>(`/verify_facebook/${facebookId}`),
  },
  professional: {
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
      console.log(`API: Intentando login con medio: ${type}, id: ${id}`)
      try {
        const response = await fetchApi<LoginResponse>("/login", {
          method: "POST",
          body: JSON.stringify({
            medio: type,
            id: id,
            // No se envía la clave según la imagen
          }),
        })
        console.log("API: Respuesta de login:", response)
        return response
      } catch (error) {
        console.error("API: Error en login:", error)
        throw error
      }
    },
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
}

