"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilePreview } from "@/components/ui/file-preview";
import { Flex } from "@/components/ui/flex";
import IconDocumentoDorso from "@/components/ui/icons/IconDocumentoDorso";
import IconDocumentoFrontal from "@/components/ui/icons/IconDocumentoFrontal";
import IconFotoPerfil from "@/components/ui/icons/IconFotoPerfil";
import { api } from "@/lib/api";
import { apiAdmin } from "@/lib/apiAdmin";
import { Loader2, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type FileType = "frontal" | "dorso" | "real";

interface FileInputBlockProps {
  label: string;
  type: FileType;
  existingUrl: string | null;
  onDelete: () => void;
  isLoading: boolean;
}

function useDocumentoStep() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [estadoDocumento, setEstadoDocumento] = useState<string | null>(null);
  const [documentUrls, setDocumentUrls] = useState({
    frontal: null as string | null,
    dorso: null as string | null,
    real: null as string | null,
  });

  const checkStatus = async () => {
    if (!session?.token || !session?.user?.id) return;
    const response = await apiAdmin.profesionales.estadoDocumento(
      session.token,
      parseInt(session.user.id)
    );
    if (response.success) {
      setEstadoDocumento(response.data as string);
    }
  };

  const getDocuments = async () => {
    if (!session?.user?.id || session.user.tipo_usuario !== "profesional") return;

    try {
      const { data } = await api.professional.getDocuments(session.user.id);
      setDocumentUrls({
        frontal: data.imagen_identidad_frontal,
        dorso: data.imagen_identidad_dorso,
        real: data.imagen_real,
      });
    } catch (error) {
      console.error("Error al verificar imágenes:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!session?.user?.id || !estadoDocumento) return;
    const file = event.target.files?.[0];
    if (file && session.token) {
      const formData = new FormData();
      formData.append("documento", file);
      formData.append("tipo", estadoDocumento);
      formData.append("user_id", session.user.id);
      try {
        setLoading(true);
        const response = await apiAdmin.profesionales.subirDocumento(
          session.token,
          formData
        );
        if (response.success) {
          setEstadoDocumento(response.data);
          await getDocuments();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDelete = async (tipo: FileType) => {
    if (!session?.user?.id || !session?.token) return;
  
    try {

      setLoading(true);  
      await apiAdmin.profesionales.eliminarDocumento(session.token, session.user.id, tipo);
      //await getDocuments();
      checkStatus();
    } catch (err) {
      console.error("Error al eliminar documento:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkStatus();
    getDocuments();
  }, []);

  return { estadoDocumento, handleFileChange,handleDelete, loading, documentUrls };
}

function TituloDocumento({ estado }: { estado: string | null }) {
  const titulos: Record<string, string> = {
    imagen_identidad_frontal: "Frontal del documento",
    imagen_identidad_dorso: "Dorso del documento",
    imagen_real: "Foto de perfil",
    completo: "Documentación completa",
  };

  const descripciones: Record<string, string> = {
    imagen_identidad_frontal:
      "Toma una foto a tu documento o carga un PDF para confirmar tu perfil profesional. Este proceso es rápido y completamente confidencial.",
    imagen_identidad_dorso:
      "Ahora carga el dorso de tu documento para continuar con la verificación.",
    imagen_real:
      "Por último, subí una foto de perfil tipo carnet en donde se vea tu rostro claramente.",
    completo:
      "¡Has finalizado el proceso de carga de documentos! Pronto validaremos tu identidad.",
  };

  return (
    <header className="bg-[#0058A2] text-white py-6 relative">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold">{titulos[estado || ""]}</h1>
        <p className="mt-2">{descripciones[estado || ""]}</p>
        {estado !== "completo" && <BarraProgreso estado={estado} />}
      </div>
    </header>
  );
}

function BarraProgreso({ estado }: { estado: string | null }) {
  const progreso: Record<string, number> = {
    imagen_identidad_frontal: 33,
    imagen_identidad_dorso: 66,
    imagen_real: 99,
    completo: 100,
  };

  const porcentaje = progreso[estado || "imagen_identidad_frontal"] ?? 0;

  return (
    <div className="mt-6 max-w-md mx-auto">
      <div className="bg-white/30 h-2 rounded-full w-full">
        <div
          className="bg-white h-2 rounded-full"
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">{porcentaje}% completado</p>
    </div>
  );
}

function SelectorIcono({ estado }: { estado: string | null }) {
  if (estado === "imagen_identidad_dorso") return <IconDocumentoDorso className="w-32" />;
  if (estado === "imagen_real") return <IconFotoPerfil className="w-32" />;
  return <IconDocumentoFrontal className="w-32" />;
}

function FileInputBlock({ label, type, existingUrl, onDelete, isLoading }: FileInputBlockProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Cargando...
        </div>
      ) : existingUrl ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-3 rounded-md border gap-3">
          <FilePreview url={existingUrl} />
          <Button type="button" onClick={onDelete} variant="ghost" className="text-red-500 hover:text-red-600 text-2xl">
            <Trash />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function DocumentoUploader({ estado, handleFileChange, loading }: {
  estado: string | null;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-center w-full p-6">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <Loader2 className="w-10 h-10 animate-spin text-[#0058A2]" />
          ) : (
            <SelectorIcono estado={estado} />
          )}
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click para cargar</span> o soltá tu archivo
          </p>
          <p className="text-xs text-gray-500">PDF, PNG, JPG o GIF (MAX. 5MB)</p>
        </div>
        <input
          id="dropzone-file"
          onChange={handleFileChange}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
        />
      </label>
    </div>
  );
}

export default function Informacion() {
  const { estadoDocumento, handleFileChange,handleDelete, loading, documentUrls } = useDocumentoStep();

  return (
    <Card>
      {estadoDocumento ? (
        <>
          <TituloDocumento estado={estadoDocumento} />
          {estadoDocumento === "completo" ? (
            <div className="p-6 space-y-4">
              <p className="text-green-600 font-semibold text-center">
                Documentación cargada correctamente.
              </p>
              <FileInputBlock
                label="Imagen Frontal del Documento"
                type="frontal"
                existingUrl={documentUrls.frontal}
                onDelete={() => handleDelete("frontal")}
                isLoading={loading}
              />
              <FileInputBlock
                label="Imagen del Dorso del Documento"
                type="dorso"
                existingUrl={documentUrls.dorso}
                onDelete={() => handleDelete("dorso")}
                isLoading={loading}
              />
              <FileInputBlock
                label="Foto Real del Profesional"
                type="real"
                existingUrl={documentUrls.real}
                onDelete={() => handleDelete("real")}
                isLoading={loading}
              />
            </div>
          ) : (
            <DocumentoUploader
              estado={estadoDocumento}
              handleFileChange={handleFileChange}
              loading={loading}
            />
          )}
        </>
      ) : (
        <Flex className="h-[400px] justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0058A2]" />
        </Flex>
      )}
    </Card>
  );
}