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
      console.log(e);
      throw new Error("La respuesta del servidor no es un JSON válido. Ver consola para detalles.")
    }

    if (!response.ok) {
      console.error("Error API:", data)
      throw data
    }

    return data as T
  } catch (error) {
    console.log(error);
    throw error
  }
}

