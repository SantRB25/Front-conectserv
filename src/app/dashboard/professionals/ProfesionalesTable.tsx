import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Profesional } from "@/lib/apiAdmin";
import { CheckCircleIcon, Icon, ListIcon, Loader2 } from "lucide-react";

export const ProfesionalesTable = ({
  data,
  loading,
  onVerDetalle,
}: {
  data: Profesional[];
  loading: boolean;
  onVerDetalle: (pro: Profesional) => void;
}) => (
    <div className="w-full overflow-x-auto">
    <Table className="min-w-[800px]">
      <TableHeader>
        <TableRow>
          <TableHead>Nombres</TableHead>
          <TableHead>Profesiones</TableHead>
          <TableHead className="text-center">Fecha de solicitud</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead className="text-center">WhatsApp</TableHead>
          <TableHead className="text-center">Aprobado</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Flex className="justify-center gap-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cargando profesionales...</span>
              </Flex>
            </TableCell>
          </TableRow>
        ) : data.length ? (
          data.map((pro) => (
            <TableRow key={pro.uuid}>
              <TableCell>
                {pro.nombres} {pro.apellidos}
              </TableCell>
              <TableCell>{pro.profesiones}</TableCell>
              <TableCell className="text-center">{pro.created_at}</TableCell>
              <TableCell>{pro.ubicacion_texto}</TableCell>
              <TableCell className="text-center">{pro.whatsapp}</TableCell>
              <TableCell className="flex justify-center text-center">{pro.verificado ? <CheckCircleIcon className="text-green-600"/> : "-"}</TableCell>
              <TableCell>
                <Button onClick={() => onVerDetalle(pro)} size={"sm"}>
                  <ListIcon /> Ver detalle
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No hay profesionales
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
