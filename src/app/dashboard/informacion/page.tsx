"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { AccessDenied } from "@/components/access-denied";
import { UploadCloud, FileText, Loader2, Trash } from "lucide-react";
import Image from "next/image";

function isPdf(url: string | null) {
  return url?.toLowerCase().endsWith(".pdf");
}

function FilePreview({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <div className="w-[200px] h-[200px] rounded-xl overflow-hidden shadow border flex items-center justify-center">
      {isPdf(url) ? (
        <FileText className="w-16 h-16 text-gray-500" />
      ) : (
        <Image
          src={url}
          alt="Documento"
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}

export default function SubirDocumentosPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [setMessage] = useState<string | null>(null);
  const [profesionalDocumentoFrontal, setProfesionalDocumentoFrontal] =
    useState<string | null>(null);
  const [profesionalDocumentoDorso, setProfesionalDocumentoDorso] = useState<
    string | null
  >(null);
  const [profesionalDocumentoReal, setProfesionalDocumentoReal] = useState<
    string | null
  >(null);
  const [files, setFiles] = useState({
    frontal: null as File | null,
    dorso: null as File | null,
    real: null as File | null,
  });

  if (session?.user?.tipo_usuario !== "profesional") return <AccessDenied />;
  /*
  const handleTrash = async (document: string) => {
    if (!session?.user?.id || session.user.tipo_usuario === "administrador") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.professional.getDocuments(session.user.id);

      await getDocuments();
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      setMessage("Error al eliminar el documento");
    } finally {
      setIsLoading(false);
    }
  };*/

  const getDocuments = async () => {
    if (!session?.user?.id || session.user.tipo_usuario === "administrador") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.professional.getDocuments(session.user.id);

      setProfesionalDocumentoFrontal(response.data.imagen_identidad_frontal);
      setProfesionalDocumentoDorso(response.data.imagen_identidad_dorso);
      setProfesionalDocumentoReal(response.data.imagen_real);
    } catch (error) {
      console.error("Error al verificar imágenes:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleTrash = async (documento: string) => {
    if (!session?.user?.id || session.user.tipo_usuario === "administrador") {
      return;
    }

    try {
      setIsLoading(true);
      await api.professional.deleteDocument(session.user.id, documento);
      await getDocuments();
      toast.success("Documento eliminado");
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      toast.error("Error al eliminar el documento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) return;
    const formData = new FormData();
    formData.append("user_id", session.user.id.toString());
    if (files.frontal)
      formData.append("imagen_identidad_frontal", files.frontal);
    if (files.dorso) formData.append("imagen_identidad_dorso", files.dorso);
    if (files.real) formData.append("imagen_real", files.real);

    try {
      setLoading(true);
      const res = await api.professional.uploadDocs(formData);
      await getDocuments();
      toast.success("Documentos subidos correctamente");
    } catch (err: any) {
      toast.error("Error al subir documentos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDocuments();
  }, [session]);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
  <h1 className="text-3xl font-semibold text-gray-800">Verificación de Identidad</h1>
  <p className="text-gray-500">Sube tus documentos oficiales para verificar tu perfil profesional. Los datos son confidenciales.</p>

  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Documentos Requeridos</CardTitle>
    </CardHeader>
    <CardContent className="space-y-8">

      {/* Documento Frontal */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Imagen Frontal del Documento</Label>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) =>
            setFiles({ ...files, frontal: e.target.files?.[0] || null })
          }
        />
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando...
          </div>
        ) : profesionalDocumentoFrontal ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <FilePreview url={profesionalDocumentoFrontal} />
            <Button
              type="button"
              onClick={() => handleTrash("frontal")}
              variant="ghost"
              className="text-red-500 hover:text-red-600 text-2xl"
            >
              <Trash />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Documento Dorso */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Imagen del Dorso del Documento</Label>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) =>
            setFiles({ ...files, dorso: e.target.files?.[0] || null })
          }
        />
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando...
          </div>
        ) : profesionalDocumentoDorso ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <FilePreview url={profesionalDocumentoDorso} />
            <Button
              type="button"
              onClick={() => handleTrash("dorso")}
              variant="ghost"
              className="text-red-500 hover:text-red-600 text-2xl"
            >
              <Trash />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Foto Real */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Foto Real del Profesional</Label>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) =>
            setFiles({ ...files, real: e.target.files?.[0] || null })
          }
        />
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando...
          </div>
        ) : profesionalDocumentoReal ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border">
            <FilePreview url={profesionalDocumentoReal} />
            <Button
              type="button"
              onClick={() => handleTrash("real")}
              variant="ghost"
              className="text-red-500 hover:text-red-600 text-2xl"
            >
              <Trash />
            </Button>
          </div>
        ) : null}
      </div>

      {/* Botón Subir */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4 mr-2" />
              Subir Documentos
            </>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
</div>

  );
}
