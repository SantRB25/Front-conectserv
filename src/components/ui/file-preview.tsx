"use client"

import { FileText, Download } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FilePreviewProps {
  url: string | null
  className?: string
  nombreArchivo?: string // opcional, si quieres definir un nombre de descarga
}

function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf")
}

export const FilePreview: React.FC<FilePreviewProps> = ({ url, className, nombreArchivo }) => {
  if (!url) return null

  return (
    <div
      className={cn(
        "w-[200px] rounded-xl overflow-hidden shadow-lg border flex flex-col items-center justify-center space-y-2 p-2",
        className
      )}
    >
      <div className="w-full h-[100px] flex items-center justify-center">
        {isPdf(url) ? (
          <FileText className="w-12 h-12 text-gray-500" />
        ) : (
          <Image
            src={url}
            alt="Documento"
            width={200}
            height={100}
            className="object-cover w-full h-full rounded"
          />
        )}
      </div>

      <a
        href={url}
        download={nombreArchivo ?? true}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
      >
        <Download className="w-4 h-4" />
        Descargar
      </a>
    </div>
  )
}
