// components/ui/ProfesionalModal.tsx
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Profesional } from "@/lib/apiAdmin"; // Asegúrate de importar la interfaz correcta
import { Flex } from "@/components/ui/flex";
import { FilePreview } from "@/components/ui/file-preview";

interface ProfesionalModalProps {
  open: boolean;
  onClose: () => void;
  handleAccion: (modo: "aprobar" | "eliminar", uuid: string) =>void;
  profesional: Profesional | null;
}

export const ProfesionalModal: React.FC<ProfesionalModalProps> = ({
  open,
  onClose,
  handleAccion,
  profesional,
}) => {
  if (!profesional) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {profesional.nombres} {profesional.apellidos}
          </DialogTitle>
          <DialogDescription>
            Información completa del profesional
          </DialogDescription>
        </DialogHeader>

        <Flex className="gap-6 items-start">
          <div className="space-y-2 text-sm">
            <p>
              <strong>Profesiones:</strong> {profesional.profesiones}
            </p>
            <p>
              <strong>Ubicación:</strong> {profesional.ubicacion_texto}
            </p>
            <p>
              <strong>Whatsapp:</strong> {profesional.whatsapp}
            </p>
            <p>
              <strong>Verificado:</strong>{" "}
              {profesional.verificado ? "Sí" : "No"}
            </p>
            <p>
              <strong>Creado:</strong> {profesional.created_at}
            </p>
            <p>
              <strong>Latitud:</strong> {profesional.latitud}
            </p>
            <p>
              <strong>Longitud:</strong> {profesional.longitud}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs mb-1 font-medium">Identidad frontal</p>
              {profesional.imagen_identidad_frontal ? (
                <FilePreview url={profesional.imagen_identidad_frontal} />
              ) : (
                <span className="text-muted-foreground text-xs">
                  No disponible
                </span>
              )}
            </div>

            <div>
              <p className="text-xs mb-1 font-medium">Identidad dorso</p>
              {profesional.imagen_identidad_dorso ? (
                <FilePreview url={profesional.imagen_identidad_dorso} />
              ) : (
                <span className="text-muted-foreground text-xs">
                  No disponible
                </span>
              )}
            </div>

            <div>
              <p className="text-xs mb-1 font-medium">Imagen real</p>
              {profesional.imagen_real ? (
                <FilePreview url={profesional.imagen_real} />
              ) : (
                <span className="text-muted-foreground text-xs">
                  No disponible
                </span>
              )}
            </div>
          </div>
        </Flex>

        <DialogFooter>
          <Flex>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
          <Button
              variant="destructive"
              onClick={() => handleAccion("eliminar", profesional.uuid)}
            >
              Eliminar
            </Button>

            <Button
              variant="success"
              onClick={() => handleAccion("aprobar", profesional.uuid)}
            >
              Aprobar
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
