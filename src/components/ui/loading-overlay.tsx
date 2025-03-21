import { Loader2 } from "lucide-react"

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Redireccionando...</p>
      </div>
    </div>
  )
}

