import { useEffect, useState } from "react";
import { api, Service } from "@/lib/api";
import { apiAdmin, Profesional, Paginacion } from "@/lib/apiAdmin";

export function useProfesionales(token: string | undefined, pagina: number, servicio: number | null,accionConfirmada: boolean) {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [paginacion, setPaginacion] = useState<Paginacion<Profesional> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services.list().then(res => setServicios(res.data)).catch(() => setServicios([]));
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiAdmin.profesionales.listar(token, pagina, servicio)
      .then(res => setPaginacion(res.data as Paginacion<Profesional>))
      .catch(() => setPaginacion(null))
      .finally(() => setLoading(false));
  }, [token, pagina, servicio,accionConfirmada]);

  return { servicios, paginacion, loading };
}
