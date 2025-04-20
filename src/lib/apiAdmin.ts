import { fetchApi } from "@/lib/fetchApi"

interface ApiResponse<T> {
  success: boolean
  data: T | Paginacion<T>
  message?: string
}
export interface DataPagination {
  current_page: number
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
  links: PaginationLink[]
}
export interface Paginacion<T> extends DataPagination {
  data: T[]
}
export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface Profesional {
  uuid: string
  nombres: string
  apellidos?: string
  ubicacion_texto?: string
  profesiones?: string
  latitud?: number
  longitud?: number
  whatsapp?: string
  verificado?: boolean
  imagen_identidad_frontal?: string
  imagen_identidad_dorso?: string
  imagen_real?: string
  created_at?: string
}
// Agregar el objeto admin dentro del objeto api
export const apiAdmin = {
  profesionales: {
    listar: (token: string, page: number = 1, servicio: number | null = null) => {
      let url = `/admin/profesionales/listar/${page}`;
      if (servicio !== null) {
        url += `/${servicio}`;
      }

      return fetchApi<ApiResponse<Paginacion<Profesional>>>(url, {
        headers: {
          Authorization: token,
        },
        method: "GET",
      });
    },
    aprobar: (token: string, uuid: string) =>
      fetchApi(`/admin/profesionales/aprobar/${uuid}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }),

    eliminar: (token: string, uuid: string) =>
      fetchApi(`/admin/profesionales/eliminar/${uuid}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      }),
  },
};

