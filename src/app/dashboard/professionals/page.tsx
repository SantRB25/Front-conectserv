"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { AccessDenied } from "@/components/access-denied";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flex, FlexBetween, FlexEnd } from "@/components/ui/flex";
import { useEffect, useState } from "react";
import { api, Service } from "@/lib/api";
import { Loader2 } from "lucide-react";
import {
  apiAdmin,
  Paginacion,
  PaginationLink,
  Profesional,
} from "@/lib/apiAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Title from "@/components/ui/form-section";
import Pagination from "@/components/ui/pagination";
import { Link } from "@/components/ui/link";
import { Button } from "@/components/ui/button";
import { ProfesionalModal } from "./ProfesionalModal";

export default function ProfessionalsPage() {
  const { data: session } = useSession();
  const [estaCargando, setEstaCargando] = useState(true);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [paginacion, setPaginacion] = useState<Paginacion<Profesional> | null>(
    null
  );

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [servicio, setServicio] = useState<number | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [profesionalSeleccionado, setProfesionalSeleccionado] =
    useState<Profesional | null>(null);

  if (session?.user?.tipo_usuario != "administrador") {
    return <AccessDenied />;
  }

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await api.services.list();
        setServicios(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServicios([]);
      } finally {
        setEstaCargando(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    fetchProfesionales();
  }, [paginaActual, servicio]);
  const shandleAccion = async (modo: "aprobar" | "eliminar", uuid: string)=>{
    if (!session?.token) return;

    try {
      if (modo === "aprobar") {
        await apiAdmin.profesionales.aprobar(session.token, uuid);
        fetchProfesionales(); 
        setModalAbierto(false);
      } else if (modo === "eliminar") {
        await apiAdmin.profesionales.eliminar(session.token, uuid);
        fetchProfesionales();
        setModalAbierto(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProfesionales = async () => {
    if (!session?.token) {
      setEstaCargando(false);
      return;
    }

    try {
      setEstaCargando(true);
      const response = await apiAdmin.profesionales.listar(
        session.token,
        paginaActual,
        servicio
      );
      setPaginacion(response.data as Paginacion<Profesional>);
    } catch (error) {
      console.error("Error fetching profesionales:", error);
      setPaginacion(null);
    } finally {
      setEstaCargando(false);
    }
  };
  const openModal = (profesional: Profesional) => {
    setProfesionalSeleccionado(profesional)
    setModalAbierto(true)
  }
  return (
    <div className="space-y-6">
      <Title>Gestión de Profesionales</Title>
      <Card>
        <CardHeader>
          <FlexBetween>
            <div></div>
            <FlexBetween className="gap-4">
              <h1>Filtrar por:</h1>
              <div>
                <Select
                  onValueChange={(value) =>
                    setServicio(value === "null" ? null : parseInt(value))
                  }
                  disabled={estaCargando}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por" />
                  </SelectTrigger>
                  <SelectContent>
                    {estaCargando ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Cargando servicios...</span>
                      </div>
                    ) : servicios.length > 0 ? (
                      <>
                        {/* Opción para TODOS los servicios */}
                        <SelectItem value="null">Todos</SelectItem>

                        {/* Lista de servicios */}
                        {servicios.map((servicio) => (
                          <SelectItem
                            key={servicio.id}
                            value={servicio.id.toString()}
                          >
                            {servicio.nombre}
                          </SelectItem>
                        ))}
                      </>
                    ) : (
                      <div className="flex items-center justify-center p-2">
                        <span>No hay servicios disponibles</span>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </FlexBetween>
          </FlexBetween>
        </CardHeader>
      </Card>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombres</TableHead>
                <TableHead>Profesiones</TableHead>
                <TableHead>Fecha de solicitud</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Aprobado</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            {!estaCargando ? (
              <TableBody>
                {paginacion?.data.length ? (
                  paginacion.data.map((pro) => (
                    <TableRow key={pro.uuid}>
                      <TableCell>
                        {pro.nombres} {pro.apellidos}
                      </TableCell>
                      <TableCell>{pro.profesiones}</TableCell>
                      <TableCell>{pro.created_at}</TableCell>
                      <TableCell>{pro.ubicacion_texto}</TableCell>
                      <TableCell>{pro.whatsapp}</TableCell>
                      <TableCell>{pro.verificado ? "Sí" : "No"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            openModal(pro);
                          }}
                          className=""
                        >
                          Ver detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay profesionales para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Flex className="justify-center gap-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando profesionales...</span>
                    </Flex>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
          <FlexEnd className="mt-4">
            {paginacion ? (
              <Pagination
                links={paginacion.links}
                onPageChange={(page) => setPaginaActual(page)}
              />
            ) : (
              <div className="flex items-center justify-center p-2">
                <span>No hay más datos</span>
              </div>
            )}
          </FlexEnd>
        </CardContent>
      </Card>

      <ProfesionalModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        handleAccion={shandleAccion}
        profesional={profesionalSeleccionado}
      />
    </div>
  );
}
