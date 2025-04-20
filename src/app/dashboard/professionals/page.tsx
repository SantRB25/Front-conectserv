"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { AccessDenied } from "@/components/access-denied";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlexBetween, FlexEnd } from "@/components/ui/flex";
import { useProfesionales } from "@/hooks/useProfesionales";
import Title from "@/components/ui/form-section";
import { ProfesionalModal } from "./ProfesionalModal";
import { ProfesionalesTable } from "./ProfesionalesTable";
import Pagination from "@/components/ui/pagination";
import { apiAdmin, Profesional } from "@/lib/apiAdmin";

export default function ProfessionalsPage() {
  const { data: session } = useSession();
  const [pagina, setPagina] = useState(1);
  const [servicio, setServicio] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [accionConfirmada, setAccionConfirmada] = useState(false);
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState<Profesional|null>(null);

  const { servicios, paginacion, loading } = useProfesionales(session?.token, pagina, servicio,accionConfirmada);

  if (session?.user?.tipo_usuario !== "administrador") {
    return <AccessDenied />;
  }

  const handleAccion = async (modo: "aprobar" | "eliminar", uuid: string) => {
    if (!session?.token) return;
    await apiAdmin.profesionales[modo](session.token, uuid);
    setModalAbierto(false);
    setAccionConfirmada(!accionConfirmada);
  };

  return (
    <div className="space-y-6">
      <Title>Gestión de Profesionales</Title>

      {/* Filtro */}
      <Card>
        <CardHeader>
          <FlexBetween>
            <h1 className="mb-3 md:mb-0">Filtrar por:</h1>
            <Select
              onValueChange={(value) => setServicio(value === "null" ? null : parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Todos</SelectItem>
                {servicios.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FlexBetween>
        </CardHeader>
      </Card>

      {/* Tabla */}
      <Card>
        <CardContent>
          <ProfesionalesTable
            data={paginacion?.data ?? []}
            loading={loading}
            onVerDetalle={(pro) => {
              setProfesionalSeleccionado(pro);
              setModalAbierto(true);
            }}
          />
          <FlexEnd className="mt-4">
            {paginacion && (
              <Pagination
                links={paginacion.links}
                onPageChange={(page) => setPagina(page)}
              />
            )}
          </FlexEnd>
        </CardContent>
      </Card>

      {/* Modal */}
      <ProfesionalModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        handleAccion={handleAccion}
        profesional={profesionalSeleccionado}
      />
    </div>
  );
}
